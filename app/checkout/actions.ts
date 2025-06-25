"use server";

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

type ShippingAddress = {
  name: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
};

// Form values from the checkout page
type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  paymentMethod: "stripe" | "nowpayments" | "hype" | "usdhl";
  evmAddress?: string;
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

export async function finalizeHypeOrder(
  cartItems: CartItem[],
  txHash: string,
  formValues: FormValues,
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  const cartTotalUsd = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // 1. Insert into orders table with 'paid' status
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "paid", // Set status directly to paid
      total: cartTotalUsd,
      payment_method: "HYPE",
      delivery_name: `${formValues.firstName} ${formValues.lastName}`,
      delivery_email: formValues.email,
      address_line1: formValues.street,
      city: formValues.city,
      postal_code: formValues.zip,
      country: formValues.country,
      wallet_address: formValues.evmAddress,
      tx_hash: txHash, // Store the transaction hash
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating final order:", orderError);
    return { success: false, error: "Failed to save the order." };
  }

  // 2. Insert into order_items table
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
    console.error("Error inserting final order items:", itemsError);
    // This is a critical error. The order is created but has no items.
    // In a production scenario, you'd want to handle this more gracefully.
    // (e.g., delete the order, or queue a job for manual review).
    return {
      success: false,
      error: "Failed to save order details. Please contact support.",
    };
  }

  // Optionally: Trigger a confirmation email here

  return { success: true, orderId: order.id };
}
