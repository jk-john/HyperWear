import { AuthToast } from "@/components/ui/AuthToast";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">{children}</main>
      <Toaster />
      <Suspense>
        <AuthToast />
      </Suspense>
    </div>
  );
}
