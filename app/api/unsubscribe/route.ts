import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

// Handle POST requests to /api/unsubscribe
export async function POST(request: NextRequest) {
  // Parse JSON body
  const { email } = await request.json();

  // Guard clause: make sure email is present
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Initialize Supabase client with service role to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Update the subscriber in the database
  const { error } = await supabase
    .from("subscribers")
    .update({ unsubscribed: true })
    .eq("email", email);

  if (error) {
    console.error("❌ Error updating subscriber:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again later." },
      { status: 500 }
    );
  }

  // Return success response
  return NextResponse.json(
    { message: "Successfully unsubscribed!" },
    { status: 200 }
  );
} 