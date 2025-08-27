import { getCallbackUrl } from "@/lib/utils";
import { createClient } from "@/types/utils/supabase/server";
import { AuthApiError } from "@supabase/supabase-js";
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
      emailRedirectTo: getCallbackUrl(),
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error("Error signing up:", error);
    if (error instanceof AuthApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!user) {
    console.error("No user returned after sign-up");
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Sign-up successful! Please check your email to verify." },
    { status: 200 }
  );
} 