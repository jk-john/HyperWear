import { resend } from "@/lib/resend";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "HyperWear <noreply@hyperwear.io>",
      to: "hyperwear.store@gmail.com",
      subject: `Support Request: ${subject}`,
      replyTo: email,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    await supabaseAdmin.from("email_logs").insert({
      email_type: "support_request",
      to_email: email,
      status: "success",
    });

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending email:", error);

    const { email } = await request.json();
    if (email) {
      await supabaseAdmin.from("email_logs").insert({
        email_type: "support_request",
        to_email: email,
        status: "error",
        error: errorMessage,
      });
    }

    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
} 