"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallback() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const searchParams = Object.fromEntries(url.searchParams);
        const hashParams = window.location.hash ? Object.fromEntries(new URLSearchParams(window.location.hash.slice(1))) : {};
        
        // Debug logging
        console.log("=== AUTH CALLBACK DEBUG ===");
        console.log("Full URL:", url.href);
        console.log("Search params:", searchParams);
        console.log("Hash params:", hashParams);
        setDebugInfo(`URL: ${url.href}\nSearch: ${JSON.stringify(searchParams)}\nHash: ${JSON.stringify(hashParams)}`);

        // First, check if we already have a session (middleware might have established it)
        const { data: currentSession } = await supabase.auth.getSession();
        if (currentSession.session) {
          console.log("✓ Session already established:", currentSession.session.user.email);
          window.history.replaceState({}, "", "/");
          // Redirect to sign-in page with success message
          router.replace("/sign-in?message=Email confirmed successfully! You are now signed in.");
          return;
        }

        // Extract parameters for manual processing
        const code = url.searchParams.get("code");
        const token_hash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");
        const access_token = hashParams.access_token;
        const refresh_token = hashParams.refresh_token;
        const error_param = url.searchParams.get("error") || hashParams.error;
        const error_description = url.searchParams.get("error_description") || hashParams.error_description;
        const error_code = hashParams.error_code;

        // Handle error cases (can be in search params or hash)
        if (error_param) {
          console.error("Auth error:", error_param, error_description, "Code:", error_code);
          
          // Handle specific OTP expiration error
          if (error_param === "access_denied" && error_code === "otp_expired") {
            router.replace("/sign-up?error=expired&message=Your email confirmation link has expired. Please sign up again to receive a new confirmation email.");
            return;
          }
          
          // Handle other auth errors
          router.replace(`/auth/auth-code-error?error=${encodeURIComponent(error_description || error_param)}`);
          return;
        }

        // Try different auth flows in order of priority

        // 1) PKCE flow (OAuth, magic links)
        if (code) {
          console.log("Processing PKCE flow with code:", code);
          const { data, error } = await supabase.auth.exchangeCodeForSession({ code });
          
          if (error) {
            console.error("PKCE exchange error:", error);
            throw error;
          }
          
          console.log("✓ PKCE session established:", data.session?.user?.email);
          window.history.replaceState({}, "", "/");
          // Redirect to sign-in page with success message
          router.replace("/sign-in?message=Email confirmed successfully! You are now signed in.");
          return;
        }

        // 2) Email confirmation with token_hash (most common for signup confirmations)
        if (token_hash && type) {
          console.log("Processing email confirmation with type:", type);
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as "signup" | "email" | "recovery" | "invite" | "magiclink",
          });
          
          if (error) {
            console.error("OTP verification error:", error);
            throw error;
          }
          
          console.log("✓ Email verification successful, session:", data.session?.user?.email);
          window.history.replaceState({}, "", "/");
          // Redirect to sign-in page with success message
          router.replace("/sign-in?message=Email confirmed successfully! You are now signed in.");
          return;
        }

        // 3) Hash-based tokens (older OAuth flows)
        if (access_token && refresh_token) {
          console.log("Processing hash token flow");
          const { data, error } = await supabase.auth.setSession({ 
            access_token, 
            refresh_token 
          });
          
          if (error) {
            console.error("Session set error:", error);
            throw error;
          }
          
          console.log("✓ Hash session established:", data.session?.user?.email);
          window.history.replaceState({}, "", "/");
          // Redirect to sign-in page with success message
          router.replace("/sign-in?message=Email confirmed successfully! You are now signed in.");
          return;
        }

        // 4) Try Supabase's built-in session from URL handler
        if (window.location.hash.includes("access_token") || searchParams.token_hash) {
          console.log("Attempting Supabase getSessionFromUrl");
          const { data, error } = await supabase.auth.getSessionFromUrl();
          
          if (!error && data.session) {
            console.log("✓ Session from URL established:", data.session.user?.email);
            window.history.replaceState({}, "", "/");
            // Redirect to sign-in page with success message
            router.replace("/sign-in?message=Email confirmed successfully! You are now signed in.");
            return;
          }
          
          if (error) {
            console.error("Session from URL error:", error);
          }
        }

        // If we get here, we couldn't establish a session
        console.error("❌ No valid auth parameters found or session could not be established");
        router.replace("/auth/auth-code-error?error=Could not establish authentication session");
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Auth callback failed";
        console.error("❌ Auth callback error:", err);
        router.replace("/auth/auth-code-error?error=" + encodeURIComponent(errorMessage));
      }
    })();
  }, [router]);

  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <div>Signing you in…</div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-4 text-xs text-left bg-gray-100 p-2 rounded overflow-auto">
          {debugInfo}
        </pre>
      )}
    </div>
  );
}