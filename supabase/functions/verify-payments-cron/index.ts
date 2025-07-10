import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
    createClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import {
    createPublicClient,
    formatUnits,
    http,
    Log,
    Transaction,
} from "https://esm.sh/viem@2.7.1";
import { defineChain } from "https://esm.sh/viem@2.7.1/utils";
import { sendOrderConfirmationEmail } from "../../../app/actions/send-order-confirmation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// --- Configuration ---
const RECEIVING_WALLET = "0x526BE41fC4991899dAB6b41368b79686A85c0beC";
const TOKEN_ADDRESSES = {
  USDT0: {
    address: "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb",
    decimals: 6,
  },
  USDHL: {
    address: "0xb50A96253aBDF803D85efcDce07Ad8becBc52BD5",
    decimals: 6,
  },
} as const;

const hyperliquid = defineChain({
  id: 999,
  name: "Hyperliquid",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid.xyz/evm"] },
  },
});

const viemClient = createPublicClient({
  chain: hyperliquid,
  transport: http(),
});

// --- Types ---
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

// --- Blockchain Interaction ---
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

// --- Payment Processing ---
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

  if (!order.total_token_amount || order.total_token_amount <= 0) {
    console.error(
      `Order ${order.id} has an invalid total_token_amount: ${order.total_token_amount}. Skipping.`,
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
  const lowerBound = order.total_token_amount * 0.98;
  const newStatus = currentPaidAmount >= lowerBound ? "completed" : "underpaid";

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
      // Send confirmation email
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

// --- Main Cron Job Logic ---
async function verifyPayments() {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

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
    return { message: "No pending orders to check." };
  }

  // --- Block Scanning with Confirmation Delay ---
  const latestBlock = await viemClient.getBlock();
  const confirmationDelay = 6n; // Wait for 6 blocks before processing
  const toBlock = latestBlock.number > confirmationDelay
    ? latestBlock.number - confirmationDelay
    : 1n;
  const scanRange = 500n; // Scan the last 500 blocks
  const fromBlock = toBlock > scanRange ? toBlock - scanRange : 1n;

  if (fromBlock > toBlock) {
    return { message: "Not enough new blocks to scan." };
  }

  console.log(`Scanning from block ${fromBlock} to ${toBlock}`);

  // --- Transaction Fetching ---
  const ordersByWallet = new Map(
    orders.map((o) => [o.wallet_address!.toLowerCase(), o as Order]),
  );
  const transactionsByUser = new Map<string, ProcessableTransaction[]>();

  // Fetch native HYPE transactions
  const hypeOrdersExist = orders.some((o) => o.payment_method === "HYPE");
  if (hypeOrdersExist) {
    const blockNumbersToScan = Array.from(
      { length: Number(toBlock - fromBlock) + 1 },
      (_, i) => fromBlock + BigInt(i),
    );

    const batchSize = 20;
    for (let i = 0; i < blockNumbersToScan.length; i += batchSize) {
      const batch = blockNumbersToScan.slice(i, i + batchSize);
      const blockPromises = batch.map((blockNumber) =>
        viemClient.getBlock({ blockNumber, includeTransactions: true })
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

  // Fetch ERC20 transfers (USDT0 and USDHL)
  const usdt0Transfers = await getErc20Transfers("USDT0", fromBlock, toBlock);
  const usdhlTransfers = await getErc20Transfers("USDHL", fromBlock, toBlock);

  [...usdt0Transfers, ...usdhlTransfers].forEach((log) => {
    const fromAddress = log.from.toLowerCase();
    if (ordersByWallet.has(fromAddress)) {
      if (!transactionsByUser.has(fromAddress)) {
        transactionsByUser.set(fromAddress, []);
      }
      transactionsByUser.get(fromAddress)!.push({ log });
    }
  });

  // --- Process and Update Orders ---
  for (const [walletAddress, order] of ordersByWallet.entries()) {
    const userTransactions = transactionsByUser.get(walletAddress.toLowerCase());
    if (userTransactions) {
      await processPaymentsForOrder(supabase, order, userTransactions);
    }
  }

  return {
    message: `Verification complete. Checked ${orders.length} orders.`,
  };
}

// --- Deno Server ---
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const result = await verifyPayments();
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
}); 