import { sendOrderConfirmationEmail } from "@/app/actions/send-order-confirmation";
import { TOKEN_ADDRESSES } from "@/constants/wallet";
import { hyperliquid } from "@/lib/hyperliquid";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createPublicClient, formatUnits, http, Log, Transaction } from "viem";

const RECEIVING_WALLET = "0x526BE41fC4991899dAB6b41368b79686A85c0beC";

const viemClient = createPublicClient({
  chain: hyperliquid,
  transport: http(),
});

type Order = {
  id: string;
  wallet_address: string;
  total: number;
  total_token_amount: number;
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

type Erc20TransferLog = Log & {
  token: "USDT0" | "USDHL";
  amount: string;
  from: `0x${string}`;
};

type ProcessableTransaction = {
  tx?: Transaction;
  log?: Erc20TransferLog;
};

async function getErc20Transfers(
  token: "USDT0" | "USDHL",
  fromBlock: bigint,
  toBlock: bigint,
) {
  const tokenInfo = TOKEN_ADDRESSES[token];

  const logs = await viemClient.getLogs({
    address: tokenInfo.address as `0x${string}`,
    event: {
      type: "event",
      name: "Transfer",
      inputs: [
        { type: "address", name: "from", indexed: true },
        { type: "address", name: "to", indexed: true },
        { type: "uint256", name: "value", indexed: false },
      ],
    },
    args: {
      to: RECEIVING_WALLET,
    },
    fromBlock,
    toBlock,
  });

  return logs
    .map((log) => {
      if (log.args.value === undefined || log.args.from === undefined) {
        return null;
      }
      return {
        ...log,
        token: token,
        amount: formatUnits(log.args.value, tokenInfo.decimals),
        from: log.args.from,
      };
    })
    .filter(Boolean);
}

async function processPaymentsForOrder(
  supabase: SupabaseClient,
  order: Order,
  transactions: ProcessableTransaction[],
) {
  const processedHashes = new Set(order.tx_hashes || []);
  const newTransactions = transactions.filter((t) => {
    const hash = t.tx?.hash || t.log?.transactionHash;
    return hash ? !processedHashes.has(hash) : false;
  });

  if (newTransactions.length === 0) {
    return;
  }

  // Add a defensive check to ensure the token amount is valid
  if (!order.total_token_amount || order.total_token_amount <= 0) {
    console.error(
      `Order ${order.id} has an invalid total_token_amount: ${order.total_token_amount}. Skipping payment processing.`,
    );
    return;
  }

  let currentPaidAmount = order.paid_amount;
  const hashesToAdd = [];

  for (const item of newTransactions) {
    let paidAmount = 0;
    let txHash: string | undefined;

    if (item.tx) {
      paidAmount = parseFloat(formatUnits(item.tx.value, 18));
      txHash = item.tx.hash;
    } else if (item.log) {
      paidAmount = parseFloat(item.log.amount);
      txHash = item.log.transactionHash ?? undefined;
    }

    if (txHash) {
      currentPaidAmount += paidAmount;
      hashesToAdd.push(txHash);
      console.log(
        `Processing tx ${txHash} with amount ${paidAmount} for order ${order.id}`,
      );
    }
  }

  const newRemainingAmount = order.total_token_amount - currentPaidAmount;
  const newStatus =
    currentPaidAmount >= order.total_token_amount ? "completed" : "underpaid";

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
    console.log(
      `Order ${order.id} updated to status: ${newStatus}, Total Paid: ${currentPaidAmount}`,
    );

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

export async function POST() {
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
    const fromBlock =
      latestBlock.number > 500n ? latestBlock.number - 500n : 1n;
    const toBlock = latestBlock.number;

    console.log(`Scanning from block ${fromBlock} to ${toBlock}`);

    const ordersByWallet = new Map(
      orders.map((o) => [o.wallet_address!.toLowerCase(), o as Order]),
    );
    const transactionsByUser = new Map<string, ProcessableTransaction[]>();

    // Fetch native HYPE transactions
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
              ordersByWallet.has(fromAddress) &&
              ordersByWallet.get(fromAddress)?.payment_method === "HYPE"
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

    // Fetch ERC20 transfers for USDT0 and USDHL
    const erc20Tokens: ("USDT0" | "USDHL")[] = ["USDT0", "USDHL"];
    for (const token of erc20Tokens) {
      if (orders.some((o) => o.payment_method === token)) {
        const transfers = await getErc20Transfers(token, fromBlock, toBlock);
        for (const log of transfers) {
          if (!log) continue;
          const fromAddress = log.from.toLowerCase();
          if (ordersByWallet.has(fromAddress)) {
            if (!transactionsByUser.has(fromAddress)) {
              transactionsByUser.set(fromAddress, []);
            }
            transactionsByUser.get(fromAddress)!.push({ log });
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