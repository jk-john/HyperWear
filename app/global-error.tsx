"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // TODO: Replace with a production-ready logging service like Sentry,
    // LogRocket, or Datadog. This will give you much better visibility into
    // errors that occur in your application.
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <html lang="en" className="bg-gray-900 text-white">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-8 text-center">
          <Image
            src="/purr-lying-happy.png"
            alt="Error illustration"
            width={200}
            height={200}
            className="rounded-full"
          />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Oops! Something went wrong.
            </h1>
            <p className="text-lg text-gray-400">
              We've been notified of the issue and are working to fix it. Please
              try again later.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={reset}
              className="transform rounded-md bg-indigo-500 px-6 py-3 text-lg font-medium text-white transition-transform hover:scale-105"
            >
              Try Again
            </Button>
            <Link href="/support">
              <Button
                variant="outline"
                className="transform rounded-md border-indigo-500 px-6 py-3 text-lg font-medium text-indigo-400 transition-transform hover:scale-105 hover:bg-indigo-500/10"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
