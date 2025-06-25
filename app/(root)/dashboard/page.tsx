import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(
      "/sign-in?message=You must be logged in to view your dashboard.",
    );
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: defaultAddress, error: addressError } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .single();

  if (ordersError || addressError) {
    console.error(
      "Error fetching dashboard data:",
      ordersError || addressError,
    );
    // You might want to show a generic error message to the user
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <DashboardClient
      user={user}
      orders={orders ?? []}
      profile={profile}
      defaultAddress={defaultAddress}
    />
  );
}
