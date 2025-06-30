"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AuthToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const welcomeMessage = searchParams.get("welcome_message");
    if (welcomeMessage) {
      toast.success(welcomeMessage);
    }
  }, [searchParams]);

  return null;
}
