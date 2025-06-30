import { SignUpConfirmationEmail } from "@/components/emails/SignUpConfirmationEmail";
import { resend } from "@/lib/resend";
import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json();

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error("Error signing up:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!user) {
    console.error("No user returned after sign-up");
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }

  try {
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "HyperWear <noreply@hyperwear.io>",
      to: email,
      subject: "Welcome to HyperWear! Confirm Your Email",
      react: SignUpConfirmationEmail({
        fullName: `${firstName} ${lastName}`,
        confirmationLink: (user as any).email_confirm_url,
      }),
    });
    if (emailError) {
      console.error("Error sending confirmation email:", emailError);
      return NextResponse.json(
        {
          message:
            "User signed up, but failed to send confirmation email. Please try logging in.",
        },
        { status: 207 }
      );
    }
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return NextResponse.json(
      {
        message:
          "User signed up, but failed to send confirmation email. Please try logging in.",
      },
      { status: 207 }
    );
  }

  return NextResponse.json(
    { message: "Sign-up successful! Please check your email to verify." },
    { status: 200 }
  );
} 