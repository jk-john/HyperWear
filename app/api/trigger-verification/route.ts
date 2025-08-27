import { createClient } from "@/types/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await request.json();

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  // You can add an extra layer of security here by verifying
  // that the user making the request is the owner of the order.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
  }

  // Invoke the Edge Function
  const { error: invokeError } = await supabase.functions.invoke(
    "verify-payments-cron",
    {
      body: { orderId },
    },
  );

  if (invokeError) {
    console.error("Error invoking verify-payments-cron function:", invokeError);
    return NextResponse.json(
      { error: "Failed to trigger payment verification." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
} 