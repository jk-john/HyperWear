import SubscriptionConfirmationEmail from "@/components/emails/SubscriptionConfirmationEmail";
import { resend } from "@/lib/resend";
import { getSiteUrl } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: existingSubscriber, error: checkError } = await supabase
      .from("subscribers")
      .select("id, unsubscribed")
      .eq("email", email.toLowerCase())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Failed to handle subscription" },
        { status: 500 }
      );
    }

    if (existingSubscriber) {
      if (existingSubscriber.unsubscribed) {
        const { error: resubscribeError } = await supabase
          .from("subscribers")
          .update({ unsubscribed: false })
          .eq("id", existingSubscriber.id);

        if (resubscribeError) {
          return NextResponse.json(
            { error: "Failed to resubscribe" },
            { status: 500 }
          );
        }

        // Send welcome back email for resubscribers
        try {
          await resend.emails.send({
            from: "HyperWear <noreply@hyperwear.io>",
            to: email.toLowerCase(),
            subject: "Welcome back! 🐾 You're back in the HyperWear family",
            react: SubscriptionConfirmationEmail({ email: email.toLowerCase(), fullName: null }),
            text: `Welcome back to HyperWear! You're once again part of the HyperWear movement. Wear the culture. Follow the mission. Unsubscribe: ${getSiteUrl()}unsubscribe?email=${encodeURIComponent(email.toLowerCase())}`,
          });
        } catch (emailError) {
          // Email failed but resubscribe succeeded
        }

        return NextResponse.json({
          message: "Successfully resubscribed!",
          isResubscribe: true,
        });
      } else {
        return NextResponse.json(
          { error: "You're already subscribed to our newsletter!" },
          { status: 409 }
        );
      }
    }

    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({
        email: email.toLowerCase(),
        user_id: null,
        unsubscribed: false,
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    // Send confirmation email
    try {
      const { error: emailError } = await resend.emails.send({
        from: "HyperWear <noreply@hyperwear.io>",
        to: email.toLowerCase(),
        subject: "You're in! 🐾 Welcome to HyperWear + Your Special Gift",
        react: SubscriptionConfirmationEmail({ email: email.toLowerCase(), fullName: null }),
        text: `Welcome to HyperWear! Thanks for subscribing. You're now part of the HyperWear movement and we have a special gift waiting for your first purchase! Wear the culture. Follow the mission. Unsubscribe: ${getSiteUrl()}unsubscribe?email=${encodeURIComponent(email.toLowerCase())}`,
      });

      if (emailError) {
        // Email failed but subscription succeeded - log it but don't fail the request
        return NextResponse.json({
          message: "Successfully subscribed, but failed to send confirmation email.",
          isResubscribe: false,
        }, { status: 207 }); // 207 Multi-Status
      }
    } catch (emailError) {
      // Email send failed but subscription succeeded
      return NextResponse.json({
        message: "Successfully subscribed, but failed to send confirmation email.",
        isResubscribe: false,
      }, { status: 207 });
    }

    return NextResponse.json({
      message: "Successfully subscribed!",
      isResubscribe: false,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}