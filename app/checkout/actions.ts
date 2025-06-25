"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
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

type ShippingAddress = {
  name: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
};

export async function createCheckoutSession(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress,
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

export async function createHypeOrder(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cartItems = JSON.parse(
    (formData.get("cartItems") as string) || "[]",
  ) as CartItem[];
  const shippingAddress = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    street: formData.get("street") as string,
    city: formData.get("city") as string,
    zip: formData.get("zip") as string,
    country: formData.get("country") as string,
  };
  const walletAddress = formData.get("walletAddress") as string;
  const cartTotalUsd = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // 1. Fetch HYPE price
  let hypeToUsd;
  try {
    const headerObj = await headers();
    const host = headerObj.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const hypePriceResponse = await fetch(
      `${protocol}://${host}/api/hype-price`,
      {
        cache: "no-store",
      },
    );
    if (!hypePriceResponse.ok) {
      throw new Error("Failed to fetch HYPE price");
    }
    const priceData = await hypePriceResponse.json();
    hypeToUsd = priceData.hypeToUsd;
  } catch (error) {
    console.error(error);
    return { error: "Could not retrieve HYPE price." };
  }

  const amountHype = (cartTotalUsd / hypeToUsd).toFixed(2);

  // 2. Insert into orders table
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id,
      status: "pending",
      total: cartTotalUsd,
      payment_method: "HYPE",
      delivery_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      delivery_email: shippingAddress.email,
      address_line1: shippingAddress.street,
      city: shippingAddress.city,
      postal_code: shippingAddress.zip,
      country: shippingAddress.country,
      wallet_address: walletAddress,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    return { error: "Failed to create order." };
  }

  // 3. Insert into order_items table
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Error inserting order items:", itemsError);
    // TODO: Maybe delete the order here if items fail to insert
    return { error: "Failed to save order details." };
  }

  // 4. Optionally update user's wallet address
  if (user && walletAddress) {
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ wallet_address: walletAddress })
      .eq("id", user.id);
    if (userUpdateError) {
      // Not a critical error, so just log it
      console.warn("Could not update user wallet address:", userUpdateError);
    }
  }

  // 5. Return order details for the frontend to handle
  return {
    success: true,
    orderId: order.id,
    amountHype: amountHype,
    cartTotal: cartTotalUsd.toString(),
    receivingAddress: process.env.RECEIVING_WALLET_ADDRESS,
  };
}

export async function cancelHypeOrder(orderId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  if (error) {
    console.error("Error cancelling order:", error);
    return { success: false, error: "Failed to cancel order." };
  }

  return { success: true };
}
