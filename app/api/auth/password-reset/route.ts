import { PasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import { resend } from "@/lib/resend";
import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/password-update`,
  });

  if (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to send password reset email. Please try again later." },
      { status: 500 }
    );
  }

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/password-update`;

  try {
    await resend.emails.send({
      from: "HyperWear <noreply@hyperwear.io>",
      to: email,
      subject: "Reset Your HyperWear Password",
      react: PasswordResetEmail({ resetLink }),
    });
  } catch (emailError) {
    console.error("Error sending password reset email:", emailError);
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