import OrderConfirmationEmail from "@/components/emails/OrderConfirmationEmail";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

// TODO: Add your Stripe secret key and webhook secret to your environment variables.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// TODO: Add your Resend API key to your environment variables.
const resend = new Resend(process.env.RESEND_API_KEY!);

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

    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: session.client_reference_id ?? undefined,
          total_price: (session.amount_total ?? 0) / 100,
          shipping_address: session.metadata
            ? JSON.parse(session.metadata.shipping)
            : null,
          status: "Paid",
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Supabase order creation failed: ${error.message}`);
      }
      const customerEmail = session.customer_details?.email;
      if (customerEmail) {
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
        );
        const items = lineItems.data.map((item) => ({
          name: item.description ?? "Unknown Item",
          quantity: item.quantity ?? 0,
          price: (item.price?.unit_amount ?? 0) / 100,
        }));

        await resend.emails.send({
          from: "Hyperwear <noreply@hyperwear.com>",
          to: customerEmail,
          subject: "Your Hyperwear Order Confirmation",
          react: OrderConfirmationEmail({
            customerName: session.customer_details?.name ?? "Valued Customer",
            orderId: order.id.toString(),
            orderDate: new Date(order.created_at).toLocaleDateString(),
            items,
            total: order.total_price,
          }),
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Error processing checkout session:", message);
      // We don't return 500 to stripe, because it would retry the webhook
    }
  }

  return NextResponse.json({ received: true });
}
