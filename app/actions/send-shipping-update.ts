"use server";
import { ShippingUpdateEmail } from "@/components/emails/ShippingUpdateEmail";
import { getServerSupabase } from "@/lib/mcp/supabase";
import { resend } from "@/lib/resend";

type ShippingUpdateEmailProps = {
  to: string;
  trackingNumber: string;
  carrier: string;
  customerName: string;
  userId: string;
};

export async function sendShippingUpdateEmail({
  to,
  trackingNumber,
  carrier,
  customerName,
  userId,
}: ShippingUpdateEmailProps) {
  const supabase = getServerSupabase();
  try {
    await resend.emails.send({
      from: "HyperWear <no-reply@hyperwear.io>",
      to,
      subject: "Your HyperWear Order Has Shipped!",
      react: ShippingUpdateEmail({
        customerName,
        trackingNumber,
        carrier,
      }),
    });
    await supabase.from("email_logs").insert({
      user_id: userId,
      email_type: "shipping_update",
      to_email: to,
      status: "success",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    await supabase.from("email_logs").insert({
      user_id: userId,
      email_type: "shipping_update",
      to_email: to,
      status: "error",
      error: errorMessage,
    });
  }
}
