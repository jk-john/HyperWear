"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

interface LoginButtonGroupProps {
  callbackUrl?: string;
}

export function LoginButtonGroup({ callbackUrl }: LoginButtonGroupProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const supabase = createClient();

  const handleOAuthSignIn = async (provider: "google" | "twitter") => {
    setIsLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `https://auth.hyperwear.io/auth/callback${callbackUrl ? `?next=${encodeURIComponent(callbackUrl)}` : ""}`,
        },
      });

      if (error) {
        toast.error(`Failed to sign in with ${provider === "google" ? "Google" : "X"}: ${error.message}`);
      }
    } catch {
      toast.error(`An unexpected error occurred while signing in with ${provider === "google" ? "Google" : "X"}`);
    } finally {
      setIsLoading(null);
    }
  };

  const handleMagicLinkSignIn = async () => {
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      return;
    }

    setIsLoading("email");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailValidation.data,
        options: {
          emailRedirectTo: `https://auth.hyperwear.io/auth/callback${callbackUrl ? `?next=${encodeURIComponent(callbackUrl)}` : ""}`,
        },
      });

      if (error) {
        toast.error(`Failed to send magic link: ${error.message}`);
      } else {
        toast.success("Magic link sent! Check your email to sign in.");
        setIsDialogOpen(false);
        setEmail("");
      }
    } catch {
      toast.error("An unexpected error occurred while sending magic link");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid gap-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Button
          variant="outline"
          className="group/btn relative h-11 w-full border-[var(--color-emerald)] bg-[var(--color-deep)] text-[var(--color-light)] hover:bg-[var(--color-emerald)] hover:text-[var(--color-light)]"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading !== null}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          {isLoading === "google" ? "Signing in..." : "Sign in with Google"}
        </Button>
        
        <Button
          variant="outline"
          className="group/btn relative h-11 w-full border-[var(--color-emerald)] bg-[var(--color-deep)] text-[var(--color-light)] hover:bg-[var(--color-emerald)] hover:text-[var(--color-light)]"
          onClick={() => handleOAuthSignIn("twitter")}
          disabled={isLoading !== null}
        >
          <Icons.twitter className="mr-2 h-4 w-4" />
          {isLoading === "twitter" ? "Signing in..." : "Sign in with X"}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="group/btn relative h-11 w-full border-[var(--color-emerald)] bg-[var(--color-deep)] text-[var(--color-light)] hover:bg-[var(--color-emerald)] hover:text-[var(--color-light)]"
            disabled={isLoading !== null}
          >
            <Mail className="mr-2 h-4 w-4" />
            Sign in with Email
          </Button>
        </DialogTrigger>
        <DialogContent className="border-[var(--color-emerald)] bg-[var(--color-deep)] text-[var(--color-light)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--color-light)]">Sign in with Email</DialogTitle>
            <DialogDescription className="text-[var(--color-accent)]">
              Enter your email address and we&apos;ll send you a magic link to sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--color-light)]">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleMagicLinkSignIn();
                  }
                }}
              />
            </div>
            <Button
              className="w-full bg-[var(--color-emerald)] text-[var(--color-light)] hover:bg-[var(--color-mint)]"
              onClick={handleMagicLinkSignIn}
              disabled={isLoading === "email"}
            >
              {isLoading === "email" ? "Sending..." : "Send Magic Link"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 