"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getSupabaseCallbackUrl } from "@/lib/supabase/utils";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export const TwitterLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleTwitterLogin = async () => {
    setIsLoading(true);
    try {
      const redirectTo = getSupabaseCallbackUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
        options: {
          redirectTo,
        },
      });

      if (error) {
        toast.error("Login failed", {
          description: error.message,
        });
      }
      // The user will be redirected to Twitter, so we don't need to reset loading state on success.
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again later.",
      });
    } finally {
      // Only reset loading state if there was an error and no redirect happened.
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="group/btn relative h-11 w-full border-[var(--color-emerald)] bg-[var(--color-deep)] text-[var(--color-light)] hover:bg-[var(--color-emerald)] hover:text-[var(--color-light)]"
      onClick={handleTwitterLogin}
      disabled={isLoading}
    >
      <Icons.twitter className="mr-2 h-4 w-4" />
      {isLoading ? "Redirecting..." : "Sign in with Twitter"}
    </Button>
  );
}; 