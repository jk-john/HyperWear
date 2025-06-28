import { sendOrderConfirmationEmail } from "@/app/actions/send-order-confirmation";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  createPublicClient,
  defineChain,
  formatEther,
  http
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
  tx_hashes: string[];
  user_id: string;
  shipping_email: string;
  shipping_first_name: string;
  shipping_last_name: string;
};

type OrderItem = {
  order_id: string;
  // ... existing code ...
};

async function processPaymentsForOrder(
  supabase: SupabaseClient,
  order: Order,
  transactions: { tx: any }[],
) {
  const processedHashes = new Set(order.tx_hashes || []);
  const newTransactions = transactions.filter((t) => !processedHashes.has(t.tx.hash));

  if (newTransactions.length === 0) {
    return;
  }

  let currentPaidAmount = order.paid_amount;
  const hashesToAdd = [];

  for (const { tx } of newTransactions) {
    const paidAmount = parseFloat(formatEther(tx.value));
    currentPaidAmount += paidAmount;
    hashesToAdd.push(tx.hash);
    console.log(`Processing tx ${tx.hash} with amount ${paidAmount} for order ${order.id}`);
  }

  const newRemainingAmount = order.total - currentPaidAmount;
  const totalWithTolerance = order.total * 0.99;
  const newStatus = currentPaidAmount >= totalWithTolerance ? "completed" : "underpaid";

  const { error } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      paid_amount: currentPaidAmount,
      remaining_amount: newRemainingAmount > 0 ? newRemainingAmount : 0,
      tx_hashes: [...processedHashes, ...hashesToAdd],
    })
    .eq("id", order.id);

  if (error) {
    console.error(`Failed to update order ${order.id}:`, error);
  } else {
    console.log(`Order ${order.id} updated to status: ${newStatus}, Total Paid: ${currentPaidAmount}`);

    if (newStatus === "completed") {
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("*, products(*)")
        .eq("order_id", order.id);

      if (itemsError) {
        console.error("Error fetching order items for email:", itemsError);
        return;
      }

      const customerEmail = order.shipping_email;
      if (customerEmail) {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          customerName: `${order.shipping_first_name} ${order.shipping_last_name}`,
          orderId: order.id.toString(),
          orderDate: new Date(order.created_at).toLocaleDateString(),
          items: orderItems.map((item) => ({
            name: item.size
              ? `${item.products.name} (Size: ${item.size})`
              : item.products.name,
            quantity: item.quantity ?? 0,
            price: item.price_at_purchase ?? 0,
          })),
          total: order.total ?? 0,
          userId: order.user_id,
        });
      }
    }
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
    const fromBlock = latestBlock.number > 500n ? latestBlock.number - 500n : 1n;
    const toBlock = latestBlock.number;

    console.log(`Scanning from block ${fromBlock} to ${toBlock}`);

    const ordersByWallet = new Map(
      orders.map((o) => [o.wallet_address!.toLowerCase(), o as Order]),
    );
    const transactionsByUser = new Map<string, { tx: any }[]>();

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
              if (!transactionsByUser.has(fromAddress)) {
                transactionsByUser.set(fromAddress, []);
              }
              transactionsByUser.get(fromAddress)!.push({ tx });
            }
          }
        }
      }
    }

    for (const [walletAddress, order] of ordersByWallet.entries()) {
      const userTransactions = transactionsByUser.get(walletAddress);
      if (userTransactions && userTransactions.length > 0) {
        await processPaymentsForOrder(supabase, order, userTransactions);
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