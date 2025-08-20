import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseCallbackUrl } from "@/lib/supabase/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Use environment-aware callback URL for both dev and production
    const redirectUrl = getSupabaseCallbackUrl() + "?type=signup";
    
    // Debug logging to see what redirect URL is being used
    console.log("🔍 SIGNUP DEBUG:");
    console.log("- NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);
    console.log("- Generated redirectUrl:", redirectUrl);
    console.log("- User email:", email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        emailRedirectTo: redirectUrl
      },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, userId: data.user?.id ?? null }, { status: 200 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 