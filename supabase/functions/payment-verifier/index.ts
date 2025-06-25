import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Address, createPublicClient, http, Log, parseAbiItem } from "viem";
import { hyperliquid } from "viem/chains";
import { Database } from "../../../types/supabase.ts";

// Constants
const RECEIVING_WALLET_ADDRESS = Deno.env.get("RECEIVING_WALLET_ADDRESS")!;
const HYPE_CONTRACT: Address = "0x2222222222222222222222222222222222222222";
const USDT0_CONTRACT: Address = "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb";
const USDHL_CONTRACT: Address = "0xb50A96253aBDF803D85efcDce07Ad8becBc52BD5";
const TOKEN_CONTRACTS = [HYPE_CONTRACT, USDT0_CONTRACT, USDHL_CONTRACT];

type Order = Database["public"]["Tables"]["orders"]["Row"];

// Viem public client for HyperEVM
const viemClient = createPublicClient({
  chain: hyperliquid,
  transport: http(),
});

// ABI for the ERC20 Transfer event
const transferEventAbi = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

async function verifyPayment(supabase: SupabaseClient, order: Order) {
  if (!order.wallet_address) {
    console.warn(`Order ${order.id} is missing a wallet_address. Skipping.`);
    return;
  }

  console.log(`Verifying payment for order ${order.id}...`);

  try {
    const fromBlock = BigInt(
      Math.floor(new Date(order.created_at).getTime() / 1000) - 86400,
    ); // Check from 24h before order creation

    for (const contractAddress of TOKEN_CONTRACTS) {
      const logs: Log[] = await viemClient.getLogs({
        address: contractAddress,
        event: transferEventAbi,
        args: {
          from: order.wallet_address as Address,
          to: RECEIVING_WALLET_ADDRESS as Address,
        },
        fromBlock: fromBlock,
      });

      const matchingLog = logs.find((log) => {
        const logValue = BigInt(log.args.value);
        // NOTE: This assumes the token has 18 decimals.
        // A more robust solution would fetch decimals for each token.
        const orderTotalInSmallestUnit = BigInt(
          parseFloat(order.total) * 10 ** 18,
        );
        return logValue === orderTotalInSmallestUnit;
      });

      if (matchingLog) {
        console.log(
          `Found matching transaction for order ${order.id}: ${matchingLog.transactionHash}`,
        );
        const { error: updateError } = await supabase
          .from("orders")
          .update({ status: "completed", tx_hash: matchingLog.transactionHash })
          .eq("id", order.id);

        if (updateError) {
          console.error(`Failed to update order ${order.id}:`, updateError);
        } else {
          console.log(`Order ${order.id} successfully marked as completed.`);
        }
        return; // Exit after finding the first matching transaction
      }
    }

    console.log(`No matching transaction found for order ${order.id}.`);
  } catch (error) {
    console.error(`Error verifying payment for order ${order.id}:`, error);
  }
}

serve(async (_req: Request) => {
  try {
    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    // 1. Fetch pending orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending")
      .eq("payment_method", "HYPE");

    if (ordersError) {
      throw new Error(`Error fetching orders: ${ordersError.message}`);
    }

    if (!orders || orders.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending orders to process." }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    console.log(`Found ${orders.length} pending order(s) to check.`);

    await Promise.all(orders.map((order) => verifyPayment(supabase, order)));

    return new Response(
      JSON.stringify({
        message: `Verification process completed for ${orders.length} order(s).`,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in payment verifier:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
