/// <reference types="https://deno.land/x/deno/cli/types/v1.d.ts" />
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  Address,
  createPublicClient,
  defineChain,
  formatUnits,
  http,
  parseAbiItem,
  parseUnits,
} from "viem";
import { Database } from "../../../types/supabase.ts";
// @deno-types="npm:@types/react@18.2.0"
import React from "https://esm.sh/react@18.2.0";
import { Resend } from "resend";

import { OrderConfirmationEmail } from "../../../components/emails/OrderConfirmationEmail.tsx";

// Define hyperliquid chain
const hyperliquidChain = defineChain({
  id: 999,
  name: "HyperEVM",
  network: "hyperevm",
  nativeCurrency: {
    decimals: 18,
    name: "HYPE",
    symbol: "HYPE",
  },
  rpcUrls: {
    default: {
      http: ["https://api.hyperliquid.xyz/evm"],
    },
    public: {
      http: ["https://api.hyperliquid.xyz/evm"],
    },
  },
  blockExplorers: {
    default: {
      name: "HyperEVM Explorer",
      url: "https://explorer.hyperliquid.xyz",
    },
  },
});

// Constants
const RECEIVING_WALLET_ADDRESS: Address =
  "0x526BE41fC4991899dAB6b41368b79686A85c0beC";

const TOKEN_CONTRACTS: Record<string, Address> = {
  usdhl: "0xb50A96253aBDF803D85efcDce07Ad8becBc52BD5",
  usdt0: "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb",
};

const ORDER_EXPIRATION_MINUTES = 15;

type Order = Database["public"]["Tables"]["orders"]["Row"];

// Viem public client for HyperEVM
const viemClient = createPublicClient({
  chain: hyperliquidChain,
  transport: http(),
});

// ABI for the ERC20 Transfer event
const transferEventAbi = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

async function sendUnderpaymentNoticeEmail(
  _email: string,
  _paidAmount: number,
  _remainingAmount: number,
) {
  // TODO: Implement email sending logic, e.g., via Resend
  console.log(
    `Placeholder: Sent underpayment notice to ${_email} for ${_paidAmount} paid, ${_remainingAmount} remaining.`,
  );
  return Promise.resolve();
}

async function verifyPayment(
  supabase: SupabaseClient,
  order: Order,
  processedTxHashes: Set<string>,
): Promise<{ status: string; orderId: string; detail: string }> {
  // 1. Check if order is expired
  if (order.expires_at) {
    const expiresAt = new Date(order.expires_at);
    if (expiresAt < new Date()) {
      // To-do: Maybe update the status to 'expired'
      const msg = `Order ${order.id} has expired. Skipping.`;
      console.log(msg);
      return { status: "skipped", orderId: order.id, detail: msg };
    }
  }

  if (!order.wallet_address) {
    const msg = `Order ${order.id} is missing a wallet_address. Skipping.`;
    console.warn(msg);
    return { status: "skipped", orderId: order.id, detail: msg };
  }

  console.log(
    `Verifying payment for order ${order.id} with method ${order.payment_method}...`,
  );

  try {
    const currentBlockNumber = await viemClient.getBlockNumber();
    const fromBlock = currentBlockNumber - 2000n; // Scan last 2000 blocks (~33 mins)

    // Always compare against the total amount of the order.
    const totalExpectedAmountSmallestUnit = parseUnits(
      order.total!.toString(),
      18,
    );
    // Allow for a small margin of error in payment amount.
    const lowerBound = (totalExpectedAmountSmallestUnit * 99n) / 100n; // 99%
    const upperBound = (totalExpectedAmountSmallestUnit * 101n) / 100n; // 101%

    const alreadyPaidAmount = parseUnits(
      (order.paid_amount || 0).toString(),
      18,
    );

    let totalValueThisRun = 0n;
    const hashesThisRun = new Set<string>();

    // Handle native $HYPE payment
    if (order.payment_method === "hype") {
      // This is inefficient but necessary for now on HyperEVM
      for (let i = 0n; i < currentBlockNumber - fromBlock; i++) {
        const blockNumber = currentBlockNumber - i;
        const block = await viemClient.getBlock({
          blockNumber: blockNumber,
          includeTransactions: true,
        });

        for (const tx of block.transactions) {
          if (
            tx.to?.toLowerCase() === RECEIVING_WALLET_ADDRESS.toLowerCase() &&
            tx.from.toLowerCase() === order.wallet_address.toLowerCase() &&
            !processedTxHashes.has(tx.hash) &&
            !order.tx_hash?.includes(tx.hash)
          ) {
            totalValueThisRun += tx.value;
            hashesThisRun.add(tx.hash);
          }
        }
      }
    }
    // Handle ERC20 token payments (USDHL/USDT0)
    else if (order.payment_method && TOKEN_CONTRACTS[order.payment_method]) {
      const contractAddress = TOKEN_CONTRACTS[order.payment_method];
      const logs = await viemClient.getLogs({
        address: contractAddress,
        event: transferEventAbi,
        args: {
          from: order.wallet_address as Address,
          to: RECEIVING_WALLET_ADDRESS as Address,
        },
        fromBlock,
      });

      const newLogs = logs.filter(
        (log) =>
          log.transactionHash &&
          !processedTxHashes.has(log.transactionHash) &&
          !order.tx_hash?.includes(log.transactionHash),
      );

      for (const log of newLogs) {
        const logArgs = log.args as { value?: bigint };
        if (!logArgs || typeof logArgs.value === "undefined") continue;

        totalValueThisRun += logArgs.value;
        hashesThisRun.add(log.transactionHash!);
      }
    }

    if (totalValueThisRun > 0n) {
      const totalPaidSoFar = alreadyPaidAmount + totalValueThisRun;
      const totalPaidSoFarFloat = parseFloat(formatUnits(totalPaidSoFar, 18));
      const remainingAmount = Math.max(0, order.total! - totalPaidSoFarFloat);
      const allTxHashes = Array.from(hashesThisRun).join(",");
      const updatedTxHash = order.tx_hash
        ? `${order.tx_hash},${allTxHashes}`
        : allTxHashes;

      // If total paid is sufficient, mark as completed.
      if (totalPaidSoFar >= lowerBound && totalPaidSoFar <= upperBound) {
        return await updateOrderStatus(
          supabase,
          order,
          "completed",
          updatedTxHash,
          totalPaidSoFarFloat,
          0,
        );
      } else if (totalPaidSoFar < lowerBound) {
        // Otherwise, it's still underpaid.
        return await updateOrderStatus(
          supabase,
          order,
          "underpaid",
          updatedTxHash,
          totalPaidSoFarFloat,
          remainingAmount,
        );
      } else {
        // It's overpaid.
        return await updateOrderStatus(
          supabase,
          order,
          "overpaid",
          updatedTxHash,
          totalPaidSoFarFloat,
          0,
        );
      }
    }

    const noMatchMsg = `No new valid transaction found for order ${order.id}.`;
    console.log(noMatchMsg);
    return { status: "no_match", orderId: order.id, detail: noMatchMsg };
  } catch (error) {
    const errorMsg = `Error verifying payment for order ${order.id}:`;
    console.error(errorMsg, error);
    return {
      status: "error",
      orderId: order.id,
      detail: `${errorMsg} ${(error as Error).message}`,
    };
  }
}

async function updateOrderStatus(
  supabase: SupabaseClient,
  order: Order,
  status: "completed" | "underpaid" | "overpaid",
  tx_hash: string,
  paid_amount: number | null,
  remaining_amount: number | null,
) {
  const detail = `Found transaction for order ${order.id}: ${tx_hash}. Setting status to ${status}.`;
  console.log(detail);

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status,
      tx_hash,
      paid_amount,
      remaining_amount,
    })
    .eq("id", order.id);

  if (updateError) {
    const errorMsg = `Failed to update order ${order.id} to ${status}:`;
    console.error(errorMsg, updateError);
    return {
      status: "error",
      orderId: order.id,
      detail: `${errorMsg} ${updateError.message}`,
    };
  }

  if (status === "underpaid" && order.user_id && remaining_amount) {
    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("id", order.user_id)
      .single();
    if (user?.email) {
      await sendUnderpaymentNoticeEmail(
        user.email,
        paid_amount || 0,
        remaining_amount,
      );
    }
  }

  if (status === "completed" && order.user_id) {
    const { data: user } = await supabase
      .from("users")
      .select("email, user_metadata")
      .eq("id", order.user_id)
      .single();

    if (user && user.email) {
      const customerName =
        (user.user_metadata?.firstName as string) || "Valued Customer";

      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("*, products(name)")
        .eq("order_id", order.id);

      if (itemsError) {
        console.error(
          `Error fetching order items for ${order.id}:`,
          itemsError,
        );
      } else {
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (!RESEND_API_KEY) {
          console.error("RESEND_API_KEY is not set.");
          return {
            status: "error",
            orderId: order.id,
            detail: "RESEND_API_KEY is not set",
          };
        }
        const resend = new Resend(RESEND_API_KEY);

        try {
          await resend.emails.send({
            from: "HyperWear <noreply@hyperwear.io>",
            to: user.email,
            subject: "Your HyperWear Order Confirmation",
            react: React.createElement(OrderConfirmationEmail, {
              customerName,
              orderId: order.id,
              orderDate: new Date(order.created_at).toLocaleDateString(),
              items:
                orderItems?.map((item) => ({
                  name: item.products!.name,
                  quantity: item.quantity ?? 1,
                  price: item.price ?? 0,
                })) || [],
              total: order.total ?? 0,
            }),
          });
          console.log(`Confirmation email sent to ${user.email}`);
        } catch (emailError) {
          console.error(
            `Failed to send confirmation email for order ${order.id}:`,
            emailError,
          );
        }
      }
    }
  }

  console.log(`Order ${order.id} successfully marked as ${status}.`);
  return { status, orderId: order.id, detail };
}

async function logToSupabase(
  supabase: SupabaseClient,
  log: {
    status: "success" | "error";
    message: string;
    details: object;
  },
) {
  const { error } = await supabase.from("cron_logs").insert([log]);
  if (error) {
    console.error("Failed to log to Supabase:", error);
  }
}

// Supabase client for admin operations
const supabaseAdmin = createClient<Database>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

serve(async (req: Request) => {
  const authHeader = req.headers.get("Authorization")!;
  if (authHeader !== `Bearer ${Deno.env.get("CRON_SECRET")}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Fetch all 'pending' or 'underpaid' orders that haven't expired.
    const now = new Date();
    const fifteenMinutesAgo = new Date(
      now.getTime() - ORDER_EXPIRATION_MINUTES * 60 * 1000,
    );

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .in("status", ["pending", "underpaid"])
      .gt("created_at", fifteenMinutesAgo.toISOString());

    if (error) {
      console.error("Error fetching orders:", error);
      await logToSupabase(supabaseAdmin, {
        status: "error",
        message: "Failed to fetch orders.",
        details: { error: error.message },
      });
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    if (!orders || orders.length === 0) {
      const msg = "No pending or underpaid orders to process.";
      console.log(msg);
      await logToSupabase(supabaseAdmin, {
        status: "success",
        message: msg,
        details: {},
      });
      return new Response(JSON.stringify({ message: msg }), { status: 200 });
    }

    console.log(`Found ${orders.length} orders to process.`);
    const processedTxHashes = new Set<string>();

    // 2. Process each order
    const processingPromises = orders.map((order) =>
      verifyPayment(supabaseAdmin, order, processedTxHashes),
    );
    const results = await Promise.all(processingPromises);

    const summary = {
      totalOrders: orders.length,
      processed: results.filter((r) => r.status !== "skipped").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      completed: results.filter((r) => r.status === "completed").length,
      underpaid: results.filter((r) => r.status === "underpaid").length,
      overpaid: results.filter((r) => r.status === "overpaid").length,
      noMatch: results.filter((r) => r.status === "no_match").length,
      errors: results.filter((r) => r.status === "error").length,
    };

    console.log("Verification process finished. Summary:", summary);

    // 3. Log the outcome
    await logToSupabase(supabaseAdmin, {
      status: "success",
      message: "Cron job executed successfully.",
      details: { summary, results },
    });

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    console.error("An unexpected error occurred:", e);
    const error = e as Error;
    await logToSupabase(supabaseAdmin, {
      status: "error",
      message: "Cron job failed unexpectedly.",
      details: { error: error.message },
    });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
