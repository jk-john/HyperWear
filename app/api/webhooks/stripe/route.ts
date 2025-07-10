import OrderConfirmationEmail from "@/components/emails/OrderConfirmationEmail";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

// TODO: Add your Stripe secret key and webhook secret to your environment variables.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// TODO: Add your Resend API key to your environment variables.
const resend = new Resend(process.env.RESEND_API_KEY!);

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  variant_id: string | null;
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    try {
      const supabase = createClient();

      if (orderId) {
        // If orderId is in metadata, update the existing order
        const { data: updatedOrder, error: updateError } = await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("id", orderId)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Supabase order update failed: ${updateError.message}`);
        }

        // Send confirmation email for the updated order
        const customerEmail = session.customer_details?.email;
        if (customerEmail) {
          const cartItems: CartItem[] = session.metadata?.cartItems
            ? JSON.parse(session.metadata.cartItems)
            : [];
          const items = cartItems.map((item) => ({
            name: item.size ? `${item.name} (Size: ${item.size})` : item.name,
            quantity: item.quantity ?? 0,
            price: item.price ?? 0,
          }));

          await resend.emails.send({
            from: "HyperWear <noreply@hyperwear.io>",
            to: customerEmail,
            subject: "Your HyperWear Order Confirmation",
            react: OrderConfirmationEmail({
              customerName:
                session.customer_details?.name ?? "Valued Customer",
              orderId: updatedOrder.id.toString(),
              orderDate: new Date(updatedOrder.created_at).toLocaleDateString(),
              items,
              total: (session.amount_total ?? 0) / 100,
            }),
          });
        }
      } else {
        // Fallback: create a new order if orderId is not in metadata
        const shippingDetails = session.metadata?.shipping
          ? JSON.parse(session.metadata.shipping)
          : {};
        const cartItems: CartItem[] = session.metadata?.cartItems
          ? JSON.parse(session.metadata.cartItems)
          : [];

        const { data: order, error } = await supabase
          .from("orders")
          .insert({
            user_id: session.client_reference_id ?? undefined,
            total: (session.amount_total ?? 0) / 100,
            delivery_name: shippingDetails.name,
            delivery_email: shippingDetails.email,
            address_line1: shippingDetails.street,
            city: shippingDetails.city,
            postal_code: shippingDetails.zip,
            country: shippingDetails.country,
            status: "paid",
            payment_method: "Stripe",
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Supabase order creation failed: ${error.message}`);
        }

        if (order && cartItems.length > 0) {
          const orderItems = cartItems.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price_at_purchase: item.price,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

          if (itemsError) {
            throw new Error(
              `Supabase order items creation failed: ${itemsError.message}`,
            );
          }
        }

        const customerEmail = session.customer_details?.email;
        if (customerEmail) {
          const items = cartItems.map((item) => ({
            name: item.size ? `${item.name} (Size: ${item.size})` : item.name,
            quantity: item.quantity ?? 0,
            price: item.price ?? 0,
          }));

          await resend.emails.send({
            from: "HyperWear <noreply@hyperwear.io>",
            to: customerEmail,
            subject: "Your HyperWear Order Confirmation",
            react: OrderConfirmationEmail({
              customerName:
                session.customer_details?.name ?? "Valued Customer",
              orderId: order.id.toString(),
              orderDate: new Date(order.created_at).toLocaleDateString(),
              items,
              total: (session.amount_total ?? 0) / 100,
            }),
          });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Error processing checkout session:", message);
      // We don't return 500 to stripe, because it would retry the webhook
    }
  }

  return NextResponse.json({ received: true });
}
