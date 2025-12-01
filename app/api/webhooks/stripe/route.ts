import OrderConfirmationEmail from "@/components/emails/OrderConfirmationEmail";
import { CartItem } from "@/types";
import { Tables } from "@/types/supabase";
import { createServiceClient } from "@/types/utils/supabase/service";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

// TODO: Add your Stripe secret key and webhook secret to your environment variables.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// TODO: Add your Resend API key to your environment variables.
const resend = new Resend(process.env.RESEND_API_KEY!);

async function sendOrderConfirmationEmail(
  order: Tables<"orders">,
  session: Stripe.Checkout.Session,
  cartItems: CartItem[],
) {
  const customerEmail = session.customer_details?.email;
  if (!customerEmail) {
    console.error(
      `[WEBHOOK] No customer email found for order ${order.id}, cannot send confirmation.`,
    );
    return;
  }

  const supabase = createServiceClient();
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("email_sent")
    .eq("id", order.id)
    .single();

  if (existingOrder?.email_sent === true) {
    console.log(
      `[WEBHOOK] Email already sent for order ${order.id}, skipping.`,
    );
    return;
  }

  try {
    const items = cartItems.map((item) => {
      let name = item.name;
      if (item.size) name += ` (Size: ${item.size})`;
      if (item.iphoneModel) name += ` (Model: ${item.iphoneModel})`;
      return {
        name,
        quantity: item.quantity ?? 0,
        price: item.price ?? 0,
      };
    });

    await resend.emails.send({
      from: "HyperWear <noreply@hyperwear.io>",
      to: customerEmail,
      subject: "Your HyperWear Order Confirmation",
      react: OrderConfirmationEmail({
        customerName: session.customer_details?.name ?? "Valued Customer",
        orderId: order.id.toString(),
        orderDate: new Date(order.created_at).toLocaleDateString(),
        items,
        total: (session.amount_total ?? 0) / 100,
        receiptUrl: null,
      }),
    });

    await supabase
      .from("orders")
      .update({ email_sent: true })
      .eq("id", order.id);

    console.log(
      `[WEBHOOK] Order confirmation email sent for order ${order.id}`,
    );
  } catch (emailError) {
    console.error(
      `[WEBHOOK] Failed to send email for order ${order.id}:`,
      emailError,
    );
    await supabase
      .from("orders")
      .update({ email_sent: false })
      .eq("id", order.id);
  }
}

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
      const supabase = createServiceClient();

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
        const cartItems: CartItem[] = session.metadata?.cartItems
          ? JSON.parse(session.metadata.cartItems)
          : [];
        await sendOrderConfirmationEmail(updatedOrder, session, cartItems);
      } else {
        // Fallback: create a new order if orderId is not in metadata
        const shippingDetails = session.metadata?.shipping
          ? JSON.parse(session.metadata.shipping)
          : {};
        const cartItems: CartItem[] = session.metadata?.cartItems
          ? JSON.parse(session.metadata.cartItems)
          : [];

        const totalAmount = (session.amount_total ?? 0) / 100;
        
        // Calculate shipping cost from cart items (same logic as checkout)
        const cartSubtotal = cartItems.reduce((sum: number, item: CartItem) => 
          sum + (item.price * item.quantity), 0
        );
        const calculatedShipping = cartSubtotal >= 60 ? 0 : 9.99;
        
        console.log(`[WEBHOOK] Creating order with stripe_session_id: ${session.id}`);
        
        // Check for existing order (idempotency)
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("*")
          .eq("stripe_session_id", session.id)
          .single();
        
        if (existingOrder) {
          console.log(`[WEBHOOK] Order already exists for session ${session.id}, skipping creation`);
          await sendOrderConfirmationEmail(existingOrder, session, cartItems);
          return NextResponse.json({ received: true });
        }
        
        // Get receipt URL from payment intent
        let receiptUrl = null;
        if (session.payment_intent) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(
              session.payment_intent as string,
              { expand: ['latest_charge'] }
            );
            if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge === 'object') {
              receiptUrl = paymentIntent.latest_charge.receipt_url;
            }
          } catch (err) {
            console.error('[WEBHOOK] Failed to retrieve receipt URL:', err);
          }
        }
        
        // Extract iPhone model from cart items (if any)
        const iphoneModel = cartItems.find((item: CartItem) => item.iphoneModel)?.iphoneModel || null;

        const { data: order, error } = await supabase
          .from("orders")
          .insert({
            user_id: session.metadata?.userId || session.client_reference_id || undefined,
            total: totalAmount, // Use 'total' instead of 'total_usd'
            total_token_amount: totalAmount, // Use 'total_token_amount' instead of 'total_hype'
            status: "paid",
            payment_method: "Stripe",
            stripe_session_id: session.id, // Store session ID for success page lookup
            amount_subtotal: cartSubtotal, // Calculated cart subtotal in dollars
            amount_shipping: calculatedShipping, // Calculated shipping cost in dollars
            amount_tax: (session.total_details?.amount_tax || 0) / 100, // Convert cents to dollars
            amount_total: (session.amount_total || 0) / 100, // Convert cents to dollars
            currency: session.currency || 'usd',
            receipt_url: receiptUrl,
            email_sent: false, // Use 'email_sent' boolean instead of 'email_sent_status'
            shipping_first_name: shippingDetails.first_name || session.customer_details?.name?.split(' ')[0] || 'Customer',
            shipping_last_name: shippingDetails.last_name || session.customer_details?.name?.split(' ')[1] || '',
            shipping_email: shippingDetails.email || session.customer_details?.email || '',
            shipping_phone_number: shippingDetails.phone_number || session.customer_details?.phone || '',
            shipping_street: shippingDetails.street || '',
            shipping_city: shippingDetails.city || '',
            shipping_postal_code: shippingDetails.postal_code || shippingDetails.zip || '',
            shipping_country: shippingDetails.country || '',
            iphone_model: iphoneModel,
          })
          .select()
          .single();

        if (error) {
          console.error(`[WEBHOOK] Order creation failed:`, error);
          throw new Error(`Supabase order creation failed: ${error.message}`);
        }
        
        console.log(`[WEBHOOK] Order created successfully! Order ID: ${order.id}, Stripe Session ID: ${order.stripe_session_id}`);

        if (order && cartItems.length > 0) {
          const orderItems = cartItems.map((item: CartItem) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
            size: item.size,
            color: item.color,
            iphone_model: item.iphoneModel,
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

        // Send confirmation email
        await sendOrderConfirmationEmail(order, session, cartItems);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Error processing checkout session:", message);
      // We don't return 500 to stripe, because it would retry the webhook
    }
  }

  return NextResponse.json({ received: true });
}
