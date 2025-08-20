// app/auth/layout.tsx
import { AuthToast } from "@/components/ui/AuthToast";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Auth Flow | HyperWear",
  description: "Authentication page layout",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
      <Suspense>
        <AuthToast />
      </Suspense>
    </>
  );
}
