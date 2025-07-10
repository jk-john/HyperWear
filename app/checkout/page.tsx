import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your purchase securely at HyperWear.io. Enter your shipping and payment details to get your Web3 fashion and HyperLiquid merch.",
  alternates: {
    canonical: "/checkout",
  },
  openGraph: {
    title: "Checkout | HyperWear.io",
    description:
      "Complete your purchase securely at HyperWear.io. Enter your shipping and payment details to get your Web3 fashion and HyperLiquid merch.",
    url: "/checkout",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: defaultAddress } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .single();

  const { data: userProfile } = await supabase
    .from("users")
    .select("wallet_address")
    .eq("id", user.id)
    .single();

  return (
    <CheckoutClient
      user={user}
      defaultAddress={defaultAddress}
      walletAddress={userProfile?.wallet_address}
    />
  );
}
