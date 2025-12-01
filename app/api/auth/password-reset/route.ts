import PasswordResetEmail from "@/components/emails/PasswordResetEmail";
import { getSupabaseAuthUrl, getSupabaseServiceRoleKey } from "@/lib/supabase/config";
import { resend } from "@/lib/resend";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabaseAdmin = createAdminClient(
    getSupabaseAuthUrl(),
    getSupabaseServiceRoleKey()
  );
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${request.nextUrl.origin}/password-update`,
  });

  if (error) {
    console.error("Error initiating password reset:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate password reset. Please try again later.",
      },
      { status: 500 }
    );
  }

  const resetLink = `${request.nextUrl.origin}/password-update`;

  try {
    await resend.emails.send({
      from: "HyperWear <noreply@hyperwear.io>",
      to: email,
      subject: "Reset Your HyperWear Password",
      react: PasswordResetEmail({
        customerName: email, // Assuming name is not available here
        resetLink,
      }),
    });
    await supabaseAdmin.from("email_logs").insert({
      email_type: "password_reset",
      to_email: email,
      status: "success",
    });
  } catch (emailError) {
    const errorMessage =
      emailError instanceof Error ? emailError.message : "Unknown error";
    console.error("Error sending password reset email:", emailError);
    await supabaseAdmin.from("email_logs").insert({
      email_type: "password_reset",
      to_email: email,
      status: "error",
      error: errorMessage,
    });
    return NextResponse.json(
      { error: "Failed to send password reset email. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Password reset email sent successfully" },
    { status: 200 }
  );
} 