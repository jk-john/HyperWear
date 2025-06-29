"use server";

import { createClient } from "@/utils/supabase/server";

export async function getOrderDetails(orderId: string) {
  const supabase = createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
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

  if (order && order.order_items) {
    // @ts-ignore
    order.order_items.forEach((item) => {
      if (item.products && item.products.images) {
        item.products.images = item.products.images.map(
          (image: string) =>
            image.startsWith("/") ? image : `/products-img/${image}`,
        );
      }
    });
  }

  return { order };
}
