import { AuthToast } from "@/components/ui/AuthToast";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
      {children}
      <Toaster />
      <Suspense>
        <AuthToast />
      </Suspense>
    </div>
  );
}
