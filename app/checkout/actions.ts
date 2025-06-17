"use server";

import { useCartStore } from "@/stores/cart";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import Stripe from "stripe";

type Order = Tables<"orders">;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(
  shippingAddress: Order["shipping_address"],
  email: string,
) {
  const { cartItems } = useCartStore.getState();

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: [item.image_url],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: email,
    metadata: {
      shipping: JSON.stringify(shippingAddress),
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
  });

  if (session.url) {
    redirect(session.url);
  }
}
