import SubscriptionConfirmationEmail from "@/components/emails/SubscriptionConfirmationEmail";
import { resend } from "@/lib/resend";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

// Handle POST requests to /api/subscribe
export async function POST(request: NextRequest) {
  // Parse JSON body
  const { email } = await request.json();

  // Guard clause: make sure email is present
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Create a Supabase client to get the current user
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Initialize Supabase admin client with service role to bypass RLS
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if the email already exists in the subscribers table
  const { data: existingSubscriber } = await supabaseAdmin
    .from("subscribers")
    .select("email")
    .eq("email", email)
    .single();

  if (existingSubscriber) {
    // Email is already subscribed; respond gracefully
    return NextResponse.json(
      { message: "Email already subscribed" },
      { status: 200 }
    );
  }

  // Fetch user's full name if logged in
  let fullName = null;
  if (user) {
    console.log(`User ${user.id} is logged in. Fetching profile...`);
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("first_name, last_name")
      .eq("id", user.id)
      .maybeSingle();

    if (userError) {
      console.error(`Error fetching user profile:`, userError);
    }

    if (userData) {
      fullName = `${userData.first_name || ""} ${
        userData.last_name || ""
      }`.trim();
      console.log(`Full name found: "${fullName}"`);
    } else {
      console.log(`No profile data found for user ${user.id}`);
    }
  } else {
    console.log("No user is logged in. Subscribing as guest.");
  }

  // Insert the new subscriber into the database
  const { error: insertError } = await supabaseAdmin
    .from("subscribers")
    .insert({ email, user_id: user?.id });

  if (insertError) {
    console.error("❌ Error inserting subscriber:", insertError);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }

  // Attempt to send a confirmation email via Resend
  try {
    await resend.emails.send({
      from: "contact@hyperwear.io", // Use your verified sender
      to: email,
      subject: "You're in! 🐾 Welcome to the HyperWear Movement",
      react: SubscriptionConfirmationEmail({ email, fullName }), // Pass email and fullName as props for personalization
    });
  } catch (error) {
    // Email send failed — log it but don't fail the subscription
    console.error(`❌ Failed to send confirmation email to ${email}:`, error);
  }

  // Return success response
  return NextResponse.json(
    { message: "Successfully subscribed!" },
    { status: 200 }
  );
}
