import { createClient } from "@/utils/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? searchParams.get("redirect_to") ?? "/";

  const supabase = createClient();

  try {
    let user = null;
    let error = null;

    // Handle different authentication flows
    if (code) {
      // OAuth flow
      const result = await supabase.auth.exchangeCodeForSession(code);
      user = result.data.user;
      error = result.error;
    } else if (token_hash && type) {
      // Email confirmation flow
      const result = await supabase.auth.verifyOtp({
        token_hash,
        type: type as EmailOtpType,
      });
      user = result.data.user;
      error = result.error;
    } else {
      // No valid authentication parameters
      throw new Error("Missing authentication parameters");
    }

    if (error) {
      console.error("Authentication error:", error);
      throw error;
    }

    if (!user) {
      throw new Error("No user found after authentication");
    }

    // Authentication successful
    const userName =
      user.user_metadata?.first_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "there";

    const welcomeMessage = `Welcome ${userName}, you are now signed in. Happy Shopping!`;

    // Redirect to the welcome page
    const redirectUrl = new URL("/welcome", origin);
    redirectUrl.searchParams.set("welcome_message", welcomeMessage);
    redirectUrl.searchParams.set("callbackUrl", next);
    return NextResponse.redirect(redirectUrl);
    
  } catch (authError) {
    console.error("Auth callback error:", authError);
    
    // Redirect to error page with error info
    const errorUrl = new URL("/auth/auth-code-error", origin);
    errorUrl.searchParams.set("error", authError.message || "Authentication failed");
    return NextResponse.redirect(errorUrl);
  }
}
