import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  // In a real scenario, you'd want more robust error handling
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

Deno.serve(async (req) => {
  // This is needed if you're calling the function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { data: expiredOrders, error } = await supabase
      .from("orders")
      .select("id")
      .in("status", ["pending", "underpaid"])
      .lt("expires_at", new Date().toISOString());

    if (error) {
      console.error("Error fetching expired orders:", error);
      throw error;
    }

    if (!expiredOrders || expiredOrders.length === 0) {
      return new Response(JSON.stringify({ message: "No expired orders to clean up." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const orderIds = expiredOrders.map((order) => order.id);

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "failed" })
      .in("id", orderIds);

    if (updateError) {
      console.error("Error updating orders to failed:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        message: `Successfully marked ${orderIds.length} orders as failed.`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
}); 