"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthTokenHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthTokens = async () => {
      // Only run on client side and if there are tokens in the URL
      if (typeof window === "undefined") return;
      
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      
      // Check if we have auth tokens OR errors in URL (hash or search params)
      const hasHashTokens = hash.includes("access_token") || hash.includes("token_hash") || hash.includes("error");
      const hasSearchTokens = searchParams.has("code") || searchParams.has("token_hash") || searchParams.has("error");
      
      if (!hasHashTokens && !hasSearchTokens) return;
      
      console.log("🔄 Auth tokens/errors detected on homepage, redirecting to callback...");
      
      // Redirect to callback page with all current URL parameters
      const currentUrl = window.location.href;
      const callbackUrl = currentUrl.replace(window.location.pathname, "/auth/callback");
      
      window.location.replace(callbackUrl);
    };

    handleAuthTokens();
  }, [router]);

  return null; // This component doesn't render anything
}