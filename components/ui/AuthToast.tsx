"use client";

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
    }

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "email_change") {
      toast.success("Your email has been successfully verified!");
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null;
}
