"use client";

import { sendPasswordChangeConfirmation } from "@/app/actions/send-password-confirmation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    await sendPasswordChangeConfirmation();

    toast.success("Password updated successfully! You can now sign in.");
    router.push("/sign-in");
    setIsLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[var(--color-light)]">
          New Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your new password"
          {...form.register("password")}
          className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
        />
        {form.formState.errors.password && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-[var(--color-light)]">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          {...form.register("confirmPassword")}
          className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
        />
        {form.formState.errors.confirmPassword && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-[var(--color-mint)] text-[var(--color-dark)] hover:bg-[var(--color-secondary)]"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
