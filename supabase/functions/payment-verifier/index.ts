/// <reference types="npm:@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createPublicClient, defineChain, formatEther, Hex, http } from "viem";
import { hyperliquid } from "viem/chains";

// Define the Hyperliquid chain
export const hyperliquid = defineChain({
  id: 999,
  name: "Hyperliquid",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid.xyz/evm"] },
  },
  blockExplorers: {
    default: {
      name: "Hyperliquid Scan",
      url: "https://explorer.hyperliquid.xyz",
    },
  },
});

// Constants from user request
const RECEIVING_WALLET = "0x526BE41fC4991899dAB6b41368b79686A85c0beC";
const CHAIN_RPC_URL = "https://rpc.hyperliquid.xyz/evm";
const USDT0_ADDRESS = "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb";
const USDHL_ADDRESS = "0xb50A96253aBDF803D85efcDce07Ad8becBc52BD5";
const HYPE_ADDRESS = "0x8a15b2028a35366c91c3a6164e8155e8e4a9e5c4";
const RESEND_FROM_EMAIL = "HyperWear <noreply@hyperwear.io>";

// Initialize viem client
const viemClient = createPublicClient({
  chain: hyperliquid,
  transport: http(CHAIN_RPC_URL),
});

// Initialize Resend
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

// ERC20 Transfer Event ABI
const erc20TransferEventAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
] as const;

// Type definition for our orders
type Order = {
  id: string;
  wallet_address: string;
  total: number;
  paid_amount: number;
  remaining_amount: number;
  status: "pending" | "underpaid" | "completed" | "overpaid";
  tx_hash: string | null;
  payment_method: "HYPE" | "USDT0" | "USDHL";
  created_at: string;
  expires_at: string;
  user_id: string;
  users: {
    email: string;
    user_metadata: {
      firstName?: string;
    };
  } | null;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Simplified HTML email templates
const completionEmailHtml = (
  customerName: string,
  orderId: string,
  orderDate: string,
  items: { name: string; quantity: number; price: number }[],
  total: number,
) => `
  <h1>Thanks for your order!</h1>
  <p>Hi ${customerName}, we're getting your order #${orderId} ready to be shipped.</p>
  <p><strong>Order Date:</strong> ${orderDate}</p>
  <hr />
  ${items
    .map(
      (item) => `
    <div>
      <p><strong>${item.name}</strong></p>
      <p>Quantity: ${item.quantity} | Price: $${(
        item.price * item.quantity
      ).toFixed(2)}</p>
    </div>
  `,
    )
    .join("")}
  <hr />
  <h2>Total: $${total.toFixed(2)}</h2>
`;

// Helper function to send a response
const sendResponse = (data: unknown, status = 200) => {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
    },
    status,
  });
};

async function getHypeToUsdRate() {
  try {
    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "spotMetaAndAssetCtxs" }),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch from Hyperliquid API: ${response.statusText}`,
      );
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length < 2) {
      throw new Error("Unexpected data format from Hyperliquid API");
    }
    const [meta, spotAssetCtxs] = data;

    // Find HYPE token
    const hypeToken = meta.tokens.find(
      (t: { name: string; index: number }) =>
        t.name?.trim().toUpperCase() === "HYPE",
    );
    if (!hypeToken) {
      throw new Error("HYPE token not found in metadata");
    }

    // Find USDC token
    const usdcToken = meta.tokens.find(
      (t: { name: string; index: number }) =>
        t.name?.trim().toUpperCase() === "USDC",
    );
    if (!usdcToken) {
      throw new Error("USDC token not found in metadata");
    }

    // Find the universe pair that contains both HYPE and USDC
    const hypeUsdcUniverse = meta.universe.find(
      (u: { tokens: number[]; index: number }) => {
        return (
          u.tokens?.includes(hypeToken.index) &&
          u.tokens?.includes(usdcToken.index)
        );
      },
    );

    if (!hypeUsdcUniverse) {
      throw new Error("HYPE/USDC trading pair not found in universe");
    }

    // Get the asset context using the universe index
    const hypeAssetCtx = spotAssetCtxs[hypeUsdcUniverse.index];

    if (!hypeAssetCtx || !hypeAssetCtx.midPx) {
      throw new Error("HYPE/USDC midPx is missing");
    }

    const hypeToUsd = parseFloat(hypeAssetCtx.midPx);

    if (isNaN(hypeToUsd) || hypeToUsd <= 0) {
      throw new Error("Parsed HYPE price is not a valid positive number");
    }

    return hypeToUsd;
  } catch (error) {
    console.error("Error fetching HYPE price:", getErrorMessage(error));
    return null; // Return null if price fetching fails
  }
}

// Function to process a found payment
async function processPayment(
  supabase: SupabaseClient,
  order: Order,
  paidAmountBigInt: bigint,
  txHash: Hex,
  tokenName: "HYPE" | "USDT0" | "USDHL",
  hypeToUsdRate?: number,
) {
  // Assuming 18 decimals for all tokens for now. This should be confirmed.
  const paidAmount = parseFloat(formatEther(paidAmountBigInt));
  let paidAmountInOrderCurrency = paidAmount;

  // Check if payment method matches
  if (order.payment_method !== tokenName) {
    console.log(
      `Skipping payment for order ${order.id}: payment method mismatch.`,
    );
    return;
  }

  // Convert HYPE payment to USD value for comparison if necessary
  if (tokenName === "HYPE") {
    if (!hypeToUsdRate) {
      console.error(
        `Cannot process HYPE payment for order ${order.id} without HYPE/USD rate.`,
      );
      return;
    }
    paidAmountInOrderCurrency = paidAmount * hypeToUsdRate;
  }

  const amountToPay =
    order.status === "underpaid" ? order.remaining_amount : order.total;
  const tolerance = amountToPay * 0.01;
  const minAmount = amountToPay - tolerance;

  let newStatus: Order["status"] = order.status;
  const newPaidAmount = order.paid_amount + paidAmountInOrderCurrency;
  const newRemainingAmount = order.total - newPaidAmount;

  if (paidAmountInOrderCurrency >= minAmount) {
    newStatus = "completed";
  } else {
    newStatus = "underpaid";
  }

  // Update order in DB
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      paid_amount: newPaidAmount,
      remaining_amount: newRemainingAmount > 0 ? newRemainingAmount : 0,
      tx_hash: txHash,
    })
    .eq("id", order.id);

  if (updateError) {
    console.error(`Failed to update order ${order.id}:`, updateError);
    return;
  }

  console.log(`Order ${order.id} updated to status: ${newStatus}`);

  // Send email notifications
  if (order.users?.email) {
    if (newStatus === "completed") {
      // Fetch order items for email
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(`quantity, price_at_purchase, products(name)`)
        .eq("order_id", order.id);

      if (itemsError) {
        console.error(
          `Failed to fetch items for order ${order.id}:`,
          itemsError,
        );
        return; // Or handle error differently
      }

      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: order.users.email,
        subject: "Your HyperWear Order is Confirmed!",
        html: completionEmailHtml(
          order.users.user_metadata?.firstName || "Valued Customer",
          order.id,
          new Date(order.created_at).toLocaleDateString(),
          items?.map((i) => ({
            name: i.products?.name ?? "Unknown Product",
            quantity: i.quantity,
            price: i.price_at_purchase,
          })) || [],
          order.total,
        ),
      });
      console.log(`Sent completion email for order ${order.id}`);
    } else if (newStatus === "underpaid") {
      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: order.users.email,
        subject: "Action Required: Your HyperWear Order is Underpaid",
        html: `<p>Hi ${order.users.user_metadata?.firstName || ""},</p>
               <p>Your order #${order.id} is currently underpaid. You paid ${newPaidAmount.toFixed(
                 5,
               )} but the total is ${order.total.toFixed(5)} ${
                 order.payment_method
               }.</p>
               <p>Please send the remaining amount of ${newRemainingAmount.toFixed(
                 5,
               )} ${order.payment_method} to complete your order.</p>
               <p>Thanks,<br/>The HyperWear Team</p>`,
      });
      console.log(`Sent underpayment notification for order ${order.id}`);
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    // 1. Authenticate the request
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${Deno.env.get("CRON_SECRET")}`) {
      return sendResponse({ error: "Unauthorized" }, 401);
    }

    // 2. Log cron job start
    await supabase.from("cron_logs").insert({
      job_name: "payment-verifier",
      status: "started",
      details: "Starting payment verification cycle.",
    });

    // 3. Get pending and underpaid orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        id, wallet_address, total, paid_amount, remaining_amount, status, tx_hash,
        payment_method, created_at, expires_at, user_id,
        users ( email, user_metadata )
      `,
      )
      .in("status", ["pending", "underpaid"])
      .not("wallet_address", "is", null)
      .gt("expires_at", new Date().toISOString());

    if (ordersError) {
      throw new Error(`Failed to fetch orders: ${ordersError.message}`);
    }

    if (!orders || orders.length === 0) {
      console.log("No pending orders to check.");
      await supabase.from("cron_logs").insert({
        job_name: "payment-verifier",
        status: "completed",
        details: "No pending orders to check.",
      });
      return sendResponse({ ok: true, message: "No orders to process" });
    }

    // 4. Get last scanned block
    const { data: state } = await supabase
      .from("cron_logs")
      .select("last_processed_block")
      .eq("job_name", "payment-verifier")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const latestBlock = await viemClient.getBlock();
    const fromBlock = state?.last_processed_block
      ? BigInt(state.last_processed_block) + 1n
      : latestBlock.number - 100n; // Scan last 100 blocks on first run
    const toBlock = latestBlock.number;

    if (fromBlock > toBlock) {
      console.log(
        `fromBlock (${fromBlock}) is greater than toBlock (${toBlock}). Skipping run.`,
      );
      await supabase.from("cron_logs").insert({
        job_name: "payment-verifier",
        status: "completed",
        details: `Already up to date. Last processed block: ${
          state?.last_processed_block
        }`,
        last_processed_block: toBlock.toString(),
      });
      return sendResponse({
        ok: true,
        message: "Already up to date.",
      });
    }

    console.log(`Scanning from block ${fromBlock} to ${toBlock}`);

    const ordersByWallet = new Map<string, Order>(
      orders
        .filter((o) => o.wallet_address)
        .map((o) => [o.wallet_address!.toLowerCase(), o as Order]),
    );

    // 5. Scan for ERC20 transfers (USDT0, USDHL)
    const erc20Tokens = [
      { name: "USDT0" as const, address: USDT0_ADDRESS },
      { name: "USDHL" as const, address: USDHL_ADDRESS },
    ];

    for (const token of erc20Tokens) {
      if (!orders.some((o) => o.payment_method === token.name)) continue;

      const logs = await viemClient.getLogs({
        address: token.address as Hex,
        event: erc20TransferEventAbi[0],
        args: { to: RECEIVING_WALLET },
        fromBlock,
        toBlock,
      });

      console.log(
        `Found ${logs.length} ${token.name} transaction(s) to the receiving wallet.`,
      );

      for (const log of logs) {
        const { from, value } = log.args;
        if (!from || !value) continue;
        const fromAddress = from.toLowerCase();
        const order = ordersByWallet.get(fromAddress);
        if (order && order.payment_method === token.name) {
          await processPayment(
            supabase,
            order,
            value,
            log.transactionHash,
            token.name,
          );
          ordersByWallet.delete(fromAddress);
        }
      }
    }

    // 6. Scan for native HYPE transfers
    if (orders.some((o) => o.payment_method === "HYPE")) {
      const hypeToUsdRate = await getHypeToUsdRate();
      if (hypeToUsdRate) {
        for (
          let blockNumber = fromBlock;
          blockNumber <= toBlock;
          blockNumber++
        ) {
          if (ordersByWallet.size === 0) break;
          const block = await viemClient.getBlock({
            blockNumber,
            includeTransactions: true,
          });
          for (const tx of block.transactions) {
            if (tx.to?.toLowerCase() === RECEIVING_WALLET.toLowerCase()) {
              const fromAddress = tx.from.toLowerCase();
              const order = ordersByWallet.get(fromAddress);
              if (order && order.payment_method === "HYPE") {
                await processPayment(
                  supabase,
                  order,
                  tx.value,
                  tx.hash,
                  "HYPE",
                  hypeToUsdRate,
                );
                ordersByWallet.delete(fromAddress);
              }
            }
          }
        }
      } else {
        console.log("Skipping HYPE payments as rate is unavailable.");
      }
    }

    // 7. Log cron job completion
    await supabase.from("cron_logs").insert({
      job_name: "payment-verifier",
      status: "completed",
      details: `Processed blocks from ${fromBlock} to ${toBlock}.`,
      last_processed_block: toBlock.toString(),
    });

    return sendResponse({ ok: true });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("An error occurred:", errorMessage);
    await supabase.from("cron_logs").insert({
      job_name: "payment-verifier",
      status: "failed",
      details: errorMessage,
    });
    return sendResponse({ error: errorMessage }, 500);
  }
});

/*
Deployment steps:
1. Create Vault secret: Go to the Supabase Dashboard -> Project Settings -> Vault, and create a new secret named 'PAYMENT_VERIFIER_BEARER' with your secure bearer token.
2. Set CRON_SECRET in function's environment: Go to the Edge Function's settings and add an environment variable 'CRON_SECRET' with the same value as the Vault secret.
3. Deploy the function:
   npx supabase functions deploy payment-verifier --no-verify-jwt --import-map supabase/import_map.json
4. Apply migrations:
   npx supabase db push
*/
