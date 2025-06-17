"use client";

import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AuthToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const showToast = async () => {
      const signedIn = searchParams.get("signed_in") === "true";
      const signedUp = searchParams.get("signed_up") === "true";
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (signedIn) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const userName =
            user.user_metadata?.first_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email;
          toast.success(`Signed in successfully! Welcome ${userName}`);
        } else {
          toast.success("Signed in successfully!");
        }
        newSearchParams.delete("signed_in");
      }

      if (signedUp) {
        toast.success(
          "Signed up successfully! Please check your email to verify your account."
        );
        newSearchParams.delete("signed_up");
      }

      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl, { scroll: false });
    };

    if (
      searchParams.get("signed_in") === "true" ||
      searchParams.get("signed_up") === "true"
    ) {
      showToast();
    }
  }, [searchParams, router, pathname, supabase]);

  return null;
}
