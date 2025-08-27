import { createClient } from "@/types/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const evmAddress = searchParams.get("evmAddress");

  if (!evmAddress) {
    return NextResponse.json(
      { error: "EVM address is required." },
      { status: 400 },
    );
  }

  const supabase = createClient();

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "id, status, total, paid_amount, remaining_amount, tx_hashes, expires_at",
      )
      .eq("wallet_address", evmAddress)
      .in("status", ["pending", "underpaid", "completed"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !order) {
      console.error(
        "Error fetching latest order for wallet:",
        evmAddress,
        error,
      );
      return NextResponse.json(
        { error: "No recent order found for this address." },
        { status: 404 },
      );
    }

    return NextResponse.json(order);
  } catch (e) {
    console.error("Unexpected error in verify-payment:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
