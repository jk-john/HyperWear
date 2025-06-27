"use server";

import { createClient } from "@/utils/supabase/server";

// interface CartItem extends Product {
//   quantity: number;
// }

// export async function createOrder(
//   cartItems: CartItem[],
//   totalPrice: number,
//   shippingAddress: Tables<"orders">["shipping_address"],
// ) {
//   const supabase = createClient();
//
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   const user = session?.user;
//
//   if (!shippingAddress) {
//     throw new Error("Shipping address is missing.");
//   }
//
//   const { data: order, error } = await supabase
//     .from("orders")
//     .insert({
//       user_id: user?.id,
//       total_price: totalPrice,
//       status: "paid",
//       shipping_address: shippingAddress,
//     })
//     .select()
//     .single();
//
//   if (error) {
//     console.error("Error creating order:", error);
//     return { error };
//   }
//
//   const orderItems = cartItems.map((item) => ({
//     order_id: order.id,
//     product_id: item.id,
//     quantity: item.quantity,
//     price: item.price,
//   }));
//
//   const { error: orderItemsError } = await supabase
//     .from("order_items")
//     .insert(orderItems);
//
//   if (orderItemsError) {
//     console.error("Error creating order items:", orderItemsError);
//     // TODO: Handle this case - maybe delete the order?
//     return { error: orderItemsError };
//   }
//
//   return { order };
// }

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
          image_url
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
