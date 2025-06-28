/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import {
  createPublicClient,
  formatEther,
  getBlock,
  getLogs,
  Hex,
  http,
} from "viem";
import { hyperliquid } from "viem/chains";

// Constants from user request
const RECEIVING_WALLET = "0x526BE41fC4991899dAB6b41368b79686A85c0beC";
const CHAIN_RPC_URL = "https://api.hyperliquid.xyz/evm";
const USDT0_ADDRESS = "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb";
const USDHL_ADDRESS = "0xb50A96253aBDF803D85efcDce07Ad8becBc52BD5";
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
      <p>Quantity: ${item.quantity} | Price: $${(item.price * item.quantity).toFixed(2)}</p>
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

// Function to process a found payment
async function processPayment(
  supabase: SupabaseClient,
  order: Order,
  paidAmountBigInt: bigint,
  txHash: Hex,
  tokenName: "HYPE" | "USDT0" | "USDHL",
) {
  // Assuming 18 decimals for all tokens for now. This should be confirmed.
  const paidAmount = parseFloat(formatEther(paidAmountBigInt));

  // Check if payment method matches
  if (order.payment_method !== tokenName) {
    console.log(
      `Skipping payment for order ${order.id}: payment method mismatch.`,
    );
    return;
  }

  const total = order.total;
  const tolerance = total * 0.01;
  const minAmount = total - tolerance;
  const maxAmount = total + tolerance;

  let newStatus: Order["status"] = order.status;
  const newPaidAmount = order.paid_amount + paidAmount;
  const newRemainingAmount = total - newPaidAmount;

  if (newPaidAmount >= minAmount && newPaidAmount <= maxAmount) {
    newStatus = "completed";
  } else if (newPaidAmount < minAmount) {
    newStatus = "underpaid";
  } else {
    newStatus = "overpaid";
  }

  // Update order in DB
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      paid_amount: newPaidAmount,
      remaining_amount: newRemainingAmount,
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
        .select(`quantity, price, products(name)`)
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
            price: i.price,
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
               <p>Your order #${order.id} is currently underpaid. You paid ${newPaidAmount} but the total is ${total}.</p>
               <p>Please send the remaining amount of ${newRemainingAmount} to complete your order.</p>
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
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
      },
    });
  }

  // 1. Authenticate the request
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${Deno.env.get("CRON_SECRET")}`) {
    return sendResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    // 2. Log cron job start
    await supabase.from("cron_logs").insert({
      job_name: "payment-verifier",
      status: "started",
      details: "Starting payment verification cycle.",
    });

    // 4. Get last scanned block
    const { data: state } = await supabase
      .from("cron_logs")
      .select("last_processed_block")
      .eq("job_name", "payment-verifier")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const latestBlock = await getBlock(viemClient);
    const fromBlock = state?.last_processed_block
      ? BigInt(state.last_processed_block) + 1n
      : latestBlock.number - 100n; // Scan last 100 blocks on first run
    const toBlock = latestBlock.number;

    if (fromBlock > toBlock) {
      console.log("No new blocks to process.");
      return sendResponse({ message: "No new blocks to process." });
    }

    // 5. Fetch pending/underpaid orders
    const { data: orders, error: fetchError } = await supabase
      .from("orders")
      .select("*, users(email, user_metadata)")
      .in("status", ["pending", "underpaid"])
      .neq("wallet_address", null)
      .gt("expires_at", new Date().toISOString());

    if (fetchError) {
      throw new Error(`Error fetching orders: ${fetchError.message}`);
    }

    if (!orders || orders.length === 0) {
      return sendResponse({ message: "No pending orders to process." });
    }

    console.log(
      `Found ${orders.length} orders to process from block ${fromBlock} to ${toBlock}.`,
    );

    const ordersByWallet = new Map<string, Order>(
      orders.map((o: Order) => [o.wallet_address.toLowerCase(), o]),
    );

    // 6. Scan for ERC20 transfers
    const erc20Tokens = [
      { address: USDT0_ADDRESS, name: "USDT0" },
      { address: USDHL_ADDRESS, name: "USDHL" },
    ];

    for (const token of erc20Tokens) {
      const logs = await getLogs(viemClient, {
        address: token.address,
        event: erc20TransferEventAbi[0],
        args: {
          to: RECEIVING_WALLET,
        },
        fromBlock,
        toBlock,
      });

      for (const log of logs) {
        const { from, value } = log.args;
        const fromAddress = from.toLowerCase();

        if (ordersByWallet.has(fromAddress)) {
          const order = ordersByWallet.get(fromAddress)!;
          if (order.status !== "completed") {
            await processPayment(
              supabase,
              order,
              value,
              log.transactionHash,
              token.name as any,
            );
            ordersByWallet.delete(fromAddress); // Avoid processing multiple payments for same order in one run
          }
        }
      }
    }

    // 7. Scan for native HYPE transfers
    for (let blockNumber = fromBlock; blockNumber <= toBlock; blockNumber++) {
      const block = await getBlock(viemClient, {
        blockNumber,
        includeTransactions: true,
      });
      for (const tx of block.transactions) {
        if (tx.to?.toLowerCase() === RECEIVING_WALLET.toLowerCase()) {
          const fromAddress = tx.from.toLowerCase();
          if (ordersByWallet.has(fromAddress)) {
            const order = ordersByWallet.get(fromAddress)!;
            if (order.status !== "completed") {
              await processPayment(supabase, order, tx.value, tx.hash, "HYPE");
              ordersByWallet.delete(fromAddress); // Avoid processing multiple payments for same order in one run
            }
          }
        }
      }
    }

    // 8. Process payments and update orders (Combined Logic)
    // This section is now implemented within the scanning loops.

    // 9. Log cron job completion and update last processed block
    await supabase.from("cron_logs").insert({
      job_name: "payment-verifier",
      status: "completed",
      details: `Verification cycle finished. Processed ${orders.length} orders. Scanned blocks ${fromBlock}-${toBlock}.`,
      last_processed_block: toBlock.toString(),
    });

    return sendResponse({ success: true, processedOrders: orders.length });
  } catch (error) {
    await supabase.from("cron_logs").insert({
      job_name: "payment-verifier",
      status: "failed",
      details: (error as Error).message,
    });

    console.error("An error occurred:", error);
    return sendResponse({ error: (error as Error).message }, 500);
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
