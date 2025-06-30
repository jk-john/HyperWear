"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getURL } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function PasswordResetForm() {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${getURL()}auth/callback?next=/password-update`,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Password reset link sent! Please check your email.");
    setIsLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[var(--color-light)]">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...form.register("email")}
          className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
        />
        {form.formState.errors.email && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full rounded-full bg-[var(--color-mint)] text-[var(--color-dark)] hover:bg-[var(--color-secondary)]"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
