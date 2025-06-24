"use server";

import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";

// TODO: Add your Stripe secret key to your environment variables.
// You can find your secret key in the Stripe dashboard.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const ORDER_LIMIT = 100;

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
};

export async function createCheckoutSession(
  cartItems: CartItem[],
  shippingAddress: Tables<"orders">["shipping_address"],
  email: string,
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Check order count
  const { count, error: countError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("Error fetching order count:", countError);
    return { error: "Could not process your order at this time." };
  }

  if (count !== null && count >= ORDER_LIMIT) {
    return {
      error:
        "We've reached our order limit for the first drop! Thanks for your amazing support.",
    };
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: email,
    client_reference_id: user?.id,
    metadata: {
      shipping: JSON.stringify(shippingAddress),
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
  });

  if (session.url) {
    revalidatePath("/products");
    redirect(session.url);
  }
}

export async function createManualOrder(formData: FormData) {
  "use server";

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const walletAddress = formData.get("walletAddress") as string;
  const cartTotalUsd = parseFloat(formData.get("cartTotalUsd") as string);

  try {
    // This fetch needs to be absolute URL for server-side fetching
    const hypePriceResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/hype-price`,
    );
    if (!hypePriceResponse.ok) {
      throw new Error("Failed to fetch HYPE price");
    }
    const { hypeToUsd } = await hypePriceResponse.json();
    const amountHype = cartTotalUsd / hypeToUsd;

    const supabase = createClient(cookies());

    const { error } = await supabase
      .from("manual_orders")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          wallet_address: walletAddress,
          cart_total_usd: cartTotalUsd,
          amount_hype: amountHype,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting manual order:", error);
      throw new Error("Failed to save order.");
    }

    redirect(
      `/checkout/hype-confirmation?amount=${amountHype}&cartTotal=${cartTotalUsd}`,
    );
  } catch (error) {
    console.error("Error creating manual order:", error);
    // Redirect to an error page or show an error message
    redirect("/checkout/cancel");
  }
}
