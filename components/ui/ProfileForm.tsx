"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email(),
});

type Profile = Tables<"profiles">;

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile.username || "",
      email: "", // Will be fetched
    },
  });

  // Fetch user's email
  React.useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        form.setValue("email", user.email || "");
      }
    };
    fetchUserEmail();
  }, [form, supabase.auth]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username: values.username,
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
        <Label htmlFor="username" className="text-[var(--color-light)]">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          {...form.register("username")}
          className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
        />
        {form.formState.errors.username && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.username.message}
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
