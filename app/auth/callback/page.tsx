"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const supabase = createClient();
        
        // Check for OAuth/PKCE code parameter
        const code = searchParams.get("code");
        
        if (code) {
          // Handle OAuth/PKCE flow
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            throw new Error(error.message);
          }
          
          if (!data.user) {
            throw new Error("No user found after authentication");
          }
          
          // Success - redirect to post-auth page
          const userName =
            data.user.user_metadata?.first_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "there";

          const welcomeMessage = `Welcome ${userName}, you are now signed in. Happy Shopping!`;
          
          // Clean history and redirect
          window.history.replaceState({}, document.title, "/welcome");
          router.replace(`/welcome?welcome_message=${encodeURIComponent(welcomeMessage)}`);
          return;
        }
        
        // Check for magic/email hash tokens
        const hash = window.location.hash;
        if (hash) {
          // Parse hash parameters
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          
          if (accessToken && refreshToken) {
            // Handle magic/email hash flow
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              throw new Error(error.message);
            }
            
            if (!data.user) {
              throw new Error("No user found after setting session");
            }
            
            // Success - redirect to post-auth page
            const userName =
              data.user.user_metadata?.first_name ||
              data.user.user_metadata?.name ||
              data.user.email?.split("@")[0] ||
              "there";

            const welcomeMessage = `Welcome ${userName}, you are now signed in. Happy Shopping!`;
            
            // Clean history and redirect
            window.history.replaceState({}, document.title, "/welcome");
            router.replace(`/welcome?welcome_message=${encodeURIComponent(welcomeMessage)}`);
            return;
          }
        }
        
        // No valid authentication parameters found
        throw new Error("Missing authentication parameters");
        
      } catch (authError) {
        console.error("Auth callback error:", authError);
        const errorMessage = authError instanceof Error ? authError.message : "Authentication failed";
        
        // Redirect to error page
        router.replace(`/auth/auth-code-error?error=${encodeURIComponent(errorMessage)}`);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [searchParams, router]);

  // Show loading state while processing
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/50 to-blue-900/50 p-8 text-center shadow-xl backdrop-blur-sm">
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Signing you in…</h1>
              <p className="text-blue-200">
                Please wait while we verify your authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This should not be reached as we redirect on both success and error
  return null;
}