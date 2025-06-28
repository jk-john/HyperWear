import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  createPublicClient,
  defineChain,
  formatEther,
  Hex,
  http,
} from "viem";

export const hyperliquid = defineChain({
  id: 999,
  name: "Hyperliquid",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid.xyz/evm"] },
  },
});

const RECEIVING_WALLET = "0x526BE41fC4991899dAB6b41368b79686A85c0beC";

const viemClient = createPublicClient({
  chain: hyperliquid,
  transport: http(),
});

type Order = {
  id: string;
  wallet_address: string;
  total: number;
  paid_amount: number;
  remaining_amount: number;
  status: "pending" | "underpaid" | "completed" | "overpaid";
  payment_method: "HYPE" | "USDT0" | "USDHL";
  created_at: string;
  expires_at: string;
};

async function processPayment(
  supabase: SupabaseClient,
  order: Order,
  paidAmountBigInt: bigint,
  txHash: Hex,
) {
  const paidAmount = parseFloat(formatEther(paidAmountBigInt));
  console.log(`Received HYPE payment of ${paidAmount} for order ${order.id}`);

  const newPaidAmount = order.paid_amount + paidAmount;
  const newRemainingAmount = order.total - newPaidAmount;
  const remainingWithTolerance = order.remaining_amount * 0.99;
  const newStatus =
    paidAmount >= remainingWithTolerance ? "completed" : "underpaid";

  const { error } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      paid_amount: newPaidAmount,
      remaining_amount: newRemainingAmount > 0 ? newRemainingAmount : 0,
      tx_hash: txHash,
    })
    .eq("id", order.id);

  if (error) {
    console.error(`Failed to update order ${order.id}:`, error);
  } else {
    console.log(`Order ${order.id} updated to status: ${newStatus}`);
  }
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  try {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["pending", "underpaid"])
      .not("wallet_address", "is", null)
      .gt("expires_at", new Date().toISOString());

    if (ordersError) {
      throw new Error(`Failed to fetch orders: ${ordersError.message}`);
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        message: "No pending orders to check.",
      });
    }

    const latestBlock = await viemClient.getBlock();
    // Scan last 500 blocks for manual verification
    const fromBlock = latestBlock.number - 500n;
    const toBlock = latestBlock.number;

    console.log(`Scanning from block ${fromBlock} to ${toBlock}`);

    const ordersByWallet = new Map(
      orders.map((o) => [o.wallet_address!.toLowerCase(), o as Order]),
    );

    if (orders.some((o) => o.payment_method === "HYPE")) {
      const blockNumbersToScan = Array.from(
        { length: Number(toBlock - fromBlock) + 1 },
        (_, i) => fromBlock + BigInt(i),
      );

      // Process blocks in batches to avoid rate limiting
      const batchSize = 20;
      for (let i = 0; i < blockNumbersToScan.length; i += batchSize) {
        const batch = blockNumbersToScan.slice(i, i + batchSize);
        const blockPromises = batch.map((blockNumber) =>
          viemClient.getBlock({ blockNumber, includeTransactions: true }),
        );

        const blocks = await Promise.all(blockPromises);

        for (const block of blocks) {
          if (!block || ordersByWallet.size === 0) continue;

          for (const tx of block.transactions) {
            const fromAddress = tx.from.toLowerCase();
            if (
              tx.to?.toLowerCase() === RECEIVING_WALLET.toLowerCase() &&
              ordersByWallet.has(fromAddress)
            ) {
              const order = ordersByWallet.get(fromAddress)!;
              await processPayment(supabase, order, tx.value, tx.hash);
              ordersByWallet.delete(fromAddress);
            }
          }
        }
      }
    }

    return NextResponse.json({
      message: "Payment verification finished.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Unexpected error in verify-payment-manual:", message);
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: message },
      { status: 500 },
    );
  }
} 