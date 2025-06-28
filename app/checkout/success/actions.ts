"use server";

import { createClient } from "@/utils/supabase/server";

export async function getOrderDetails(orderId: string) {
  const supabase = createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      shipping_first_name,
      shipping_last_name,
      shipping_street,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      order_items (
        quantity,
        price_at_purchase,
        products (
          name,
          images
        )
      )
    `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order details:", error);
    return {
      error: "Order not found or you do not have permission to view it.",
    };
  }

  return { order };
}
