import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user) {
      const userName =
        user.user_metadata.first_name ||
        user.user_metadata.name ||
        user.email;
      const welcomeMessage = `Welcome ${userName}, you are now signed in. Happy Shopping!`;

      if (next) {
        const redirectUrl = new URL(next, origin);
        redirectUrl.searchParams.set("welcome_message", welcomeMessage);
        return NextResponse.redirect(redirectUrl);
      }

      const redirectUrl = new URL("/", origin);
      redirectUrl.searchParams.set("welcome_message", welcomeMessage);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
