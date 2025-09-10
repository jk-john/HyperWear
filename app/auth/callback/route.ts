import { createClient } from "@/types/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error_description = searchParams.get("error_description");
  const error_code = searchParams.get("error");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  // Log the callback attempt for debugging
  console.log("Auth callback:", { 
    code: code ? "present" : "missing", 
    error_code, 
    error_description,
    origin 
  });

  if (code) {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Exchange code error:", error);
      const errorUrl = new URL("/auth/auth-code-error", origin);
      errorUrl.searchParams.set("error", error.message);
      return NextResponse.redirect(errorUrl);
    }
    
    if (user) {
      const userName =
        user.user_metadata.first_name ||
        user.user_metadata.name ||
        user.email;
      const welcomeMessage = `Welcome ${userName}, you are now signed in. Happy Shopping!`;

      console.log("User authenticated successfully:", user.id);
      
      // Redirect to the new callback page
      const redirectUrl = new URL("/welcome", origin);
      redirectUrl.searchParams.set("welcome_message", welcomeMessage);
      redirectUrl.searchParams.set("callbackUrl", next);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Log why we're redirecting to error page
  console.log("Redirecting to auth-code-error:", { 
    noCode: !code, 
    error_code, 
    error_description 
  });

  // return the user to an error page with instructions
  const errorUrl = new URL("/auth/auth-code-error", origin);
  if (error_description) {
    errorUrl.searchParams.set("error", error_description);
  }
  return NextResponse.redirect(errorUrl);
}
