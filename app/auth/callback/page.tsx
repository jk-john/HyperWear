"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";

    const timer = setTimeout(() => {
      router.push(callbackUrl);
    }, 3000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-2">
      <h1 className="text-2xl font-semibold">Login successful</h1>
      <p className="text-muted-foreground">You will be redirected shortly...</p>
    </div>
  );
}
