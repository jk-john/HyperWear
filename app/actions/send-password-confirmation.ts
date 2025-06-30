"use server";
import PasswordChangeConfirmationEmail from "@/components/emails/PasswordChangeConfirmationEmail";
import { getServerSupabase, getUserFromSession } from "@/lib/mcp/supabase";
import { resend } from "@/lib/resend";

export async function sendPasswordChangeConfirmation() {
  const supabase = getServerSupabase();
  const user = await getUserFromSession();
  if (!user?.email) return;

  try {
    await resend.emails.send({
      from: "HyperWear <noreply@hyperwear.io>",
      to: user.email,
      subject: "Your HyperWear password was changed",
      react: PasswordChangeConfirmationEmail({
        customerName: user.user_metadata.full_name || user.email,
      }),
    });

    await supabase.from("email_logs").insert({
      user_id: user.id,
      email_type: "password_change",
      to_email: user.email,
      status: "success",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    await supabase.from("email_logs").insert({
      user_id: user.id,
      email_type: "password_change",
      to_email: user.email,
      status: "error",
      error: errorMessage,
    });
  }
}
