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

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "HyperWear <noreply@hyperwear.io>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// --- Configuration ---
const RECEIVING_WALLET = "0xf5AA547485Bdb2b85492c58CfaDBffAab401185b";
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
  total_usd: number;
  total_hype: number;
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

  if (!order.total_hype || order.total_hype <= 0) {
    console.error(
      `Order ${order.id} has an invalid total_hype: ${order.total_hype}. Skipping.`,
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

  const newRemainingAmount = order.total_hype - currentPaidAmount;
  const lowerBound = order.total_hype * 0.98;
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
      if (customerEmail && RESEND_API_KEY) {
        try {
          const emailSent = await sendConfirmationEmailDeno({
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
            total: order.total_usd ?? 0,
          });

          if (emailSent) {
            await supabase.from('orders').update({ email_sent_status: 'sent' }).eq('id', order.id);
          } else {
            await supabase.from('orders').update({ email_sent_status: 'failed' }).eq('id', order.id);
          }
        } catch (e) {
            await supabase.from('orders').update({ email_sent_status: 'failed' }).eq('id', order.id);
        }
      }
    }
  }
}

// --- Deno-native Email Sending ---
async function sendConfirmationEmailDeno(emailData: {
  to: string;
  customerName: string;
  orderId: string;
  orderDate: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}) {
  const { to, customerName, orderId, orderDate, items, total } = emailData;

  const subject = `Order Confirmed: #${orderId}`;
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td>${item.name} (x${item.quantity})</td>
      <td style="text-align: right;">$${(item.price * item.quantity).toFixed(
        2,
      )}</td>
    </tr>
  `,
    )
    .join("");

  const html = `
    <h1>Thanks for your order, ${customerName}!</h1>
    <p>Your order #${orderId} from ${orderDate} has been confirmed.</p>
    <table style="width: 100%;">
      ${itemsHtml}
      <tr>
        <td style="font-weight: bold;">Total</td>
        <td style="text-align: right; font-weight: bold;">$${total.toFixed(
          2,
        )}</td>
      </tr>
    </table>
    <p>We'll notify you when it ships.</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: to,
        subject: subject,
        html: html,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      console.error(
        `Failed to send confirmation email for order ${orderId}:`,
        errorBody,
      );
      return false;
    } else {
      console.log(`Confirmation email sent for order ${orderId} to ${to}`);
      return true;
    }
  } catch (error) {
    console.error("Error sending Resend API request:", error);
    return false;
  }
}


// --- Main Cron Job Logic ---
async function verifyPayments(supabase: SupabaseClient, orderId?: string) {
  console.log(`Starting payment verification. Order ID: ${orderId || "All"}`);

  const isCronRun = !orderId;
  let ordersQuery = supabase
    .from("orders")
    .select("*")
    .in("status", ["pending", "underpaid"])
    .not("wallet_address", "is", null);

  if (orderId) {
    ordersQuery = ordersQuery.eq("id", orderId);
  } else {
    ordersQuery = ordersQuery.gt("expires_at", new Date().toISOString());
  }

  const { data: orders, error: ordersError } = await ordersQuery;

  if (ordersError) {
    throw new Error(`Failed to fetch orders: ${ordersError.message}`);
  }

  if (!orders || orders.length === 0) {
    console.log("No pending orders to check.");
    return { message: "No pending orders to check." };
  }

  console.log(`Found ${orders.length} pending order(s).`);

  // --- Block Scanning ---
  const latestBlock = await viemClient.getBlock();
  const confirmationDelay = 6n;
  const toBlock = latestBlock.number > confirmationDelay ? latestBlock.number - confirmationDelay : 0n;

  const scanWindow = isCronRun ? 2000n : 120n; // Cron: ~33 mins, On-demand: ~2 mins
  const fromBlock = toBlock > scanWindow ? toBlock - scanWindow : 0n;

  if (fromBlock >= toBlock) {
      console.log("Not enough new blocks to scan since last run.");
      return { message: "Not enough new blocks to scan." };
  }

  console.log(`Scanning from block ${fromBlock} to ${toBlock}`);

  // Group orders by the sender's wallet address for efficient lookup
  const ordersByWallet = new Map<string, Order>();
  orders.forEach(o => {
      if(o.wallet_address) {
          ordersByWallet.set(o.wallet_address.toLowerCase(), o as Order)
      }
  });

  if (ordersByWallet.size === 0) {
      console.log("No pending orders with wallet addresses found.");
      return { message: "No orders to process." };
  }

  // Map to store found transactions for each wallet address
  const transactionsByUser = new Map<string, ProcessableTransaction[]>();

  // --- Fetch ERC20 Transfers ---
  const usdt0Transfers: Erc20TransferLog[] = [];
  const usdhlTransfers: Erc20TransferLog[] = [];
  const maxBlockRange = 1000n;

  for (let currentFrom = fromBlock; currentFrom <= toBlock; currentFrom += maxBlockRange) {
      const currentTo = BigInt(Math.min(Number(currentFrom + maxBlockRange - 1n), Number(toBlock)));
      
      console.log(`Scanning ERC20 from ${currentFrom} to ${currentTo}`);

      const [usdt0Chunk, usdhlChunk] = await Promise.all([
          getErc20Transfers("USDT0", currentFrom, currentTo),
          getErc20Transfers("USDHL", currentFrom, currentTo)
      ]);
      
      usdt0Transfers.push(...usdt0Chunk);
      usdhlTransfers.push(...usdhlChunk);
  }


  console.log(`Found ${usdt0Transfers.length} USDT0 transfers and ${usdhlTransfers.length} USDHL transfers.`);

  [...usdt0Transfers, ...usdhlTransfers].forEach((log) => {
      const fromAddress = log.from.toLowerCase();
      if (ordersByWallet.has(fromAddress)) {
          if (!transactionsByUser.has(fromAddress)) {
              transactionsByUser.set(fromAddress, []);
          }
          transactionsByUser.get(fromAddress)!.push({ log });
      }
  });

  // --- Fetch Native HYPE Transactions ---
  const hasHypeOrder = orders.some(o => o.payment_method === 'HYPE');

  if (hasHypeOrder) {
    // This is less efficient as we have to check each transaction in each block
    for (let blockNum = fromBlock; blockNum <= toBlock; blockNum++) {
        const block = await viemClient.getBlock({ blockNumber: blockNum, includeTransactions: true });
        if (!block) continue;

        for (const tx of block.transactions) {
            if (tx.to?.toLowerCase() === RECEIVING_WALLET.toLowerCase()) {
                const fromAddress = tx.from.toLowerCase();
                if (ordersByWallet.has(fromAddress) && ordersByWallet.get(fromAddress)?.payment_method === 'HYPE') {
                    if (!transactionsByUser.has(fromAddress)) {
                        transactionsByUser.set(fromAddress, []);
                    }
                    transactionsByUser.get(fromAddress)!.push({ tx });
                }
            }
        }
    }
  }

  // --- Process and Update Orders ---
  console.log(`Processing transactions for ${transactionsByUser.size} users.`);
  for (const [walletAddress, order] of ordersByWallet.entries()) {
    try {
      const userTransactions = transactionsByUser.get(walletAddress.toLowerCase());
      if (userTransactions && userTransactions.length > 0) {
          console.log(`Found ${userTransactions.length} transaction(s) for order ${order.id}`);
          await processPaymentsForOrder(supabase, order, userTransactions);
      } else {
          console.log(`No new transactions found for order ${order.id}`);
      }
    } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        await supabase
          .from('orders')
          .update({ verification_error: error.message })
          .eq('id', order.id);
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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const payload = await req.json().catch(() => ({}));
    const orderId = payload.orderId;

    const result = await verifyPayments(supabase, orderId);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Caught top-level error:", error);
    await supabase.from('function_errors').insert({ error_message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
}); 