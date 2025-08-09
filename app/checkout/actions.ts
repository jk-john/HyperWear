"use server";

import { CartItem, CheckoutFormValues, ShippingAddress } from "@/types";
import { createClient as getServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const getShippingCost = (cartTotal: number): number => {
  return cartTotal >= 60 ? 0 : 9.99;
};

// TODO: Add your Stripe secret key to your environment variables.
// You can find your secret key in the Stripe dashboard.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const ORDER_LIMIT = 100;

async function findOrCreateOrder(
  supabase: ReturnType<typeof getServerSupabase>,
  userId: string,
  orderPayload: TablesInsert<"orders">,
  cartItems: CartItem[],
) {
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .in("status", ["pending", "underpaid"])
    .maybeSingle();

  let order;

  if (existingOrder) {
    // Clear out old items before updating
    await supabase.from("order_items").delete().eq("order_id", existingOrder.id);

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(orderPayload)
      .eq("id", existingOrder.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating existing order:", updateError);
      throw new Error("Could not update your order.");
    }
    order = updatedOrder;
  } else {
    const { data: newOrder, error: createError } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (createError) {
      console.error("Error creating new order:", createError);
      throw new Error("Could not create your order.");
    }
    order = newOrder;
  }

  // Add the current cart items to the order
  const orderItemsData = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price,
    size: item.size,
    color: item.color,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    console.error("Error inserting order items:", itemsError);
    throw new Error("Could not save items for your order.");
  }

  return order;
}

export async function createCheckoutSession(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress,
  email: string,
) {
  const supabase = getServerSupabase();

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This should be handled by page-level auth, but as a safeguard:
    return { error: "User not authenticated." };
  }

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  try {
    const order = await findOrCreateOrder(
      supabase,
      user.id,
      {
        user_id: user.id,
        total,
        status: "pending" as const,
        payment_method: "Stripe",
        shipping_first_name: shippingAddress.first_name,
        shipping_last_name: shippingAddress.last_name,
        shipping_street: shippingAddress.street,
        shipping_city: shippingAddress.city,
        shipping_postal_code: shippingAddress.postal_code,
        shipping_country: shippingAddress.country,
        shipping_phone_number: shippingAddress.phone_number,
        shipping_email: email,
      },
      cartItems,
    );

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: [
            item.name,
            item.size && `Size: ${item.size}`,
            item.color && `Color: ${item.color}`,
          ]
            .filter(Boolean)
            .join(" - "),
          images: [item.imageUrl],
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
      client_reference_id: user?.id,
      metadata: {
        orderId: order.id,
        shipping: JSON.stringify(shippingAddress),
        cartItems: JSON.stringify(cartItems),
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel?orderId=${order.id}`,
    });

    if (session.url) {
      revalidatePath("/products");
      redirect(session.url);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function cancelOrder(orderId: string) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, user_id, status")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, error: "Order not found." };
  }

  if (order.user_id !== user.id) {
    return { success: false, error: "You are not authorized to cancel this order." };
  }

  if (order.status !== "pending" && order.status !== "underpaid") {
    return {
      success: false,
      error: `Cannot cancel an order with status: ${order.status}.`,
    };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", order.id);

  if (updateError) {
    console.error("Error cancelling order:", updateError);
    return { success: false, error: "Failed to cancel the order." };
  }

  revalidatePath("/checkout");
  return { success: true };
}

export async function initiateHypePayment(
  cartItems: CartItem[],
  formValues: CheckoutFormValues,
) {
  const supabase = getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingCost = getShippingCost(cartTotal);
  const finalTotalUsd = cartTotal + shippingCost;

  let tokenAmount: number;

  if (formValues.paymentMethod === "hype") {
    try {
      // Ensure you have NEXT_PUBLIC_SITE_URL in your environment variables
      const hypePriceResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/hype-price`,
        { cache: "no-store" },
      );
      if (!hypePriceResponse.ok) {
        const errorData = await hypePriceResponse.json();
        throw new Error(errorData.error || "Failed to fetch HYPE price");
      }
      const priceData = await hypePriceResponse.json();
      if (!priceData.hypeToUsd) {
        throw new Error("Invalid price data received.");
      }
      tokenAmount = finalTotalUsd / priceData.hypeToUsd;
    } catch (error) {
      console.error("Could not fetch HYPE price:", error);
      return {
        success: false,
        error: "Could not fetch current HYPE price. Please try again later.",
      };
    }
  } else {
    // For USDHL and USDT0, assume 1:1 with USD
    tokenAmount = finalTotalUsd;
  }

  try {
    const order = await findOrCreateOrder(
      supabase,
      user.id,
      {
        user_id: user.id,
        total: finalTotalUsd,
        total_token_amount: tokenAmount,
        status: "pending" as const,
        payment_method: formValues.paymentMethod.toUpperCase(),
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        tx_hashes: [],
        wallet_address: formValues.evmAddress,
        paid_amount: 0,
        remaining_amount: tokenAmount,
        shipping_email: formValues.email,
        shipping_first_name: formValues.firstName,
        shipping_last_name: formValues.lastName,
        shipping_street: formValues.street,
        shipping_city: formValues.city,
        shipping_postal_code: formValues.zip,
        shipping_country: formValues.country,
        shipping_phone_number: formValues.phoneNumber,
      },
      cartItems,
    );
    return { success: true, orderId: order.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}
