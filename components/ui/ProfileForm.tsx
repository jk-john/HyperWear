"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./button";

const formSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email(),
});

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user.user_metadata.full_name || "",
      email: user.email || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const { error } = await supabase
      .from("user_profiles")
      .update({
        full_name: values.full_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Profile updated successfully!");
    router.refresh();
    setIsLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[var(--color-light)]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          className="border-[var(--color-mint)] bg-gray-700 text-gray-400"
          disabled
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-[var(--color-light)]">
          Full Name
        </Label>
        <Input
          id="full_name"
          type="text"
          placeholder="Enter your full name"
          {...form.register("full_name")}
          className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
        />
        {form.formState.errors.full_name && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.full_name.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[var(--color-mint)] text-[var(--color-dark)] hover:bg-[var(--color-secondary)]"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
