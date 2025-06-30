"use server";

import { getServerSupabase } from "@/lib/mcp/supabase";
import { revalidatePath } from "next/cache";
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
  imageUrl: string;
  size?: string;
  cartItemId: string;
};

type ShippingAddress = {
  first_name: string;
  last_name: string;
  phone_number: string;
  street: string;
  address_complement?: string | null;
  city: string;
  postal_code: string;
  country: string;
  company_name?: string | null;
  delivery_instructions?: string | null;
};

// Form values from the checkout page
type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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
  const supabase = getServerSupabase();

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
        name: item.size ? `${item.name} (Size: ${item.size})` : item.name,
        images: [item.imageUrl],
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
      cartItems: JSON.stringify(cartItems),
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
  txHash: string | null,
  formValues: FormValues,
  tokenAmount: number,
  totalUsd: number,
  walletAddress?: string,
) {
  const supabase = getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  // 1. Insert into orders table
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total: totalUsd,
      total_token_amount: tokenAmount,
      status: "pending",
      payment_method: formValues.paymentMethod.toUpperCase(),
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      tx_hashes: txHash ? [txHash] : [],
      wallet_address: walletAddress,
      paid_amount: 0,
      remaining_amount: tokenAmount,
      // Shipping details
      shipping_email: formValues.email,
      shipping_first_name: formValues.firstName,
      shipping_last_name: formValues.lastName,
      shipping_street: formValues.street,
      shipping_city: formValues.city,
      shipping_postal_code: formValues.zip,
      shipping_country: formValues.country,
      shipping_phone_number: formValues.phoneNumber,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    return { success: false, error: "Failed to create order." };
  }

  // 2. Insert into order_items table
  const orderItemsData = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price,
    size: item.size,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    return { success: false, error: "Failed to save order items." };
  }

  return { success: true, orderId: order.id };
}
