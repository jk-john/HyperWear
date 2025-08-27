"use server";

import { createClient } from "@/types/utils/supabase/server";

export async function markOrderAsFailed(orderId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "failed" })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status to failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
} 