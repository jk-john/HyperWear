"use client";

import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AuthToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const welcomeMessage = searchParams.get("welcome_message");
    const genericMessage = searchParams.get("message");

    if (welcomeMessage) {
      toast.success(welcomeMessage);
      if (pathname !== "/welcome") {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("welcome_message");
        router.replace(`${pathname}?${newParams.toString()}`, {
          scroll: false,
        });
      }
    } else if (genericMessage) {
      toast.error(genericMessage);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("message");
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }

    if (typeof window !== 'undefined') {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get("type") === "email_change") {
        toast.success("Your email has been successfully verified!");
        router.replace(pathname, { scroll: false });
      }
    }
  }, [searchParams, router, pathname]);

  // 🍪 Cookie fallback: if ad scripts stripped the welcome_message param
  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/welcome_message=([^;]+)/);
      if (match) {
        const message = decodeURIComponent(match[1]);
        toast.success(message);

        // Remove the cookie
        document.cookie =
          "welcome_message=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_IN" &&
        typeof window !== 'undefined' &&
        window.location.hash.includes("access_token")
      ) {
        const hasShownToast = typeof sessionStorage !== 'undefined' 
          ? sessionStorage.getItem("signupWelcomeToast")
          : null;
        if (!hasShownToast && session?.user) {
          const userName =
            session.user.user_metadata.name ||
            session.user.user_metadata.first_name ||
            session.user.email;
          toast.success(
            `Welcome ${userName}, you are now signed in. Happy Shopping!`,
          );
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem("signupWelcomeToast", "true");
          }
          if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + window.location.search,
            );
          }
        }
      } else if (event === "SIGNED_OUT" && typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem("signupWelcomeToast");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return null;
}
