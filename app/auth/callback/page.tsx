"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);

        // 1) PKCE flow (?code=...)
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession({ code });
          if (error) throw error;
          window.history.replaceState({}, "", "/");
          router.replace("/");
          return;
        }

        // 2) Hash token flow (#access_token=...&refresh_token=...)
        if (window.location.hash?.length) {
          const hash = new URLSearchParams(window.location.hash.slice(1));
          const access_token = hash.get("access_token");
          const refresh_token = hash.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
            window.history.replaceState({}, "", "/");
            router.replace("/");
            return;
          }
        }

        // Fallback
        router.replace("/auth/auth-code-error?error=Missing authentication parameters");
      } catch (err: any) {
        router.replace("/auth/auth-code-error?error=" + encodeURIComponent(err?.message || "Auth callback failed"));
      }
    })();
  }, [router]);

  return <div className="mx-auto max-w-md p-8 text-center">Signing you in…</div>;
}