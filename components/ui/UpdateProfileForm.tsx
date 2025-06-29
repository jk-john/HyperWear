"use client";

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
import { Button } from "./button";

const formSchema = z.object({
  phone_number: z.string().optional(),
  birthday: z.string().optional(),
});

type UserProfile = Tables<"user_profiles">;

interface UpdateProfileFormProps {
  profile: UserProfile | null;
  onSuccess: () => void;
}

export function UpdateProfileForm({
  profile,
  onSuccess,
}: UpdateProfileFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: profile?.phone_number || "",
      birthday: profile?.birthday || "",
    },
  });

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
      .from("user_profiles")
      .upsert({
        user_id: user.id,
        phone_number: values.phone_number,
        birthday: values.birthday,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Profile updated successfully!");
    router.refresh();
    setIsLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          type="tel"
          placeholder="Enter your phone number"
          {...form.register("phone_number")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthday">Birthday</Label>
        <Input id="birthday" type="date" {...form.register("birthday")} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
