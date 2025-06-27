"use server";

import OrderConfirmationEmail from "@/components/emails/OrderConfirmationEmail";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import Stripe from "stripe";

// TODO: Add your Stripe secret key to your environment variables.
// You can find your secret key in the Stripe dashboard.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const ORDER_LIMIT = 100;

const resend = new Resend(process.env.RESEND_API_KEY!);

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
  phone_number: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  paymentMethod: "stripe" | "nowpayments" | "hype" | "usdhl";
  evmAddress?: string;
};

export async function createCheckoutSession(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress,
  email: string,
) {
  const supabase = createClient();

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
  txHash: string,
  formValues: FormValues,
) {
  const supabase = createClient();

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

  // 1. Insert into orders table
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total: cartTotalUsd,
      status: "pending", // You might want to update this based on payment verification
      payment_method: "hype",
      tx_hash: txHash,
      wallet_address: formValues.evmAddress,
      // Shipping details
      shipping_email: formValues.email,
      shipping_first_name: formValues.firstName,
      shipping_last_name: formValues.lastName,
      shipping_street: formValues.street,
      shipping_city: formValues.city,
      shipping_postal_code: formValues.postal_code,
      shipping_country: formValues.country,
      shipping_phone_number: formValues.phone_number,
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
    // You might want to handle this case, e.g., by deleting the created order
    return { success: false, error: "Failed to save order items." };
  }

  // Clear the cart after successful order
  // This should be done on the client-side, but this is an example
  // useCartStore.getState().clearCart();

  // Optionally: Trigger a confirmation email here
  const customerEmail = formValues.email;
  if (customerEmail) {
    const items = cartItems.map((item) => ({
      name: item.size ? `${item.name} (Size: ${item.size})` : item.name,
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
    }));

    await resend.emails.send({
      from: "Hyperwear <noreply@hyperwear.com>",
      to: customerEmail,
      subject: "Your Hyperwear Order Confirmation",
      react: OrderConfirmationEmail({
        customerName: `${formValues.firstName} ${formValues.lastName}`,
        orderId: order.id.toString(),
        orderDate: new Date(order.created_at).toLocaleDateString(),
        items,
        total: order.total ?? 0,
      }),
    });
  }

  return { success: true, orderId: order.id };
}
