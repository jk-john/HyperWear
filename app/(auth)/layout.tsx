import { AuthToast } from "@/components/ui/AuthToast";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      {children}
      <Toaster />
      <Suspense>
        <AuthToast />
      </Suspense>
    </div>
  );
}
