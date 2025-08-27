import { createClient } from "@/types/utils/supabase/server";
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

      // Redirect to the new callback page
      const redirectUrl = new URL("/welcome", origin);
      redirectUrl.searchParams.set("welcome_message", welcomeMessage);
      redirectUrl.searchParams.set("callbackUrl", next);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
