"use server";

import { Product } from "@/types";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface CartItem extends Product {
  quantity: number;
}

export async function createOrder(
  cartItems: CartItem[],
  totalPrice: number,
  shippingAddress: Tables<"orders">["shipping_address"],
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!shippingAddress) {
    throw new Error("Shipping address is missing.");
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id,
      total_price: totalPrice,
      status: "paid",
      shipping_address: shippingAddress,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    return { error };
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    console.error("Error creating order items:", orderItemsError);
    // TODO: Handle this case - maybe delete the order?
    return { error: orderItemsError };
  }

  return { order };
}
