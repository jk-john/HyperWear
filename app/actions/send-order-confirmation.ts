"use server";
import OrderConfirmationEmail from "@/components/emails/OrderConfirmationEmail";
import { getServerSupabase } from "@/lib/mcp/supabase";
import { resend } from "@/lib/resend";

type OrderConfirmationEmailProps = {
  to: string;
  customerName: string;
  orderId: string;
  orderDate: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  userId: string;
};

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  orderDate,
  items,
  total,
  userId,
}: OrderConfirmationEmailProps) {
  const supabase = getServerSupabase();
  try {
    await resend.emails.send({
      from: "HyperWear <no-reply@hyperwear.io>",
      to,
      subject: "Your HyperWear Order Confirmation",
      react: OrderConfirmationEmail({
        customerName,
        orderId,
        orderDate,
        items,
        total,
      }),
    });
    await supabase.from("email_logs").insert({
      user_id: userId,
      email_type: "order_confirmation",
      to_email: to,
      status: "success",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    await supabase.from("email_logs").insert({
      user_id: userId,
      email_type: "order_confirmation",
      to_email: to,
      status: "error",
      error: errorMessage,
    });
  }
}
