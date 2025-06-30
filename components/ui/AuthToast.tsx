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
    const welcomeMessage = searchParams.get("welcome_message");
    if (welcomeMessage) {
      toast.success(welcomeMessage);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("welcome_message");
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "email_change") {
      toast.success("Your email has been successfully verified!");
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_IN" &&
        window.location.hash.includes("access_token")
      ) {
        const hasShownToast = sessionStorage.getItem("signupWelcomeToast");
        if (!hasShownToast && session?.user) {
          const userName =
            session.user.user_metadata.name ||
            session.user.user_metadata.first_name ||
            session.user.email;
          toast.success(
            `Welcome ${userName}, you are now signed in. Happy Shopping!`,
          );
          sessionStorage.setItem("signupWelcomeToast", "true");
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname + window.location.search,
          );
        }
      } else if (event === "SIGNED_OUT") {
        sessionStorage.removeItem("signupWelcomeToast");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return null;
}
