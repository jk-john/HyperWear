"use client";

import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "lucide-react";
import Link from "next/link";

interface UserAccountNavProps {
  user: SupabaseUser | null;
  displayMode?: "icon" | "button";
}

export const UserAccountNav = ({
  user,
  displayMode = "icon",
}: UserAccountNavProps) => {
  const destination = user ? "/dashboard" : "/sign-in";
  const buttonText = user ? "Account" : "Sign In";

  if (displayMode === "button") {
    return (
      <Link href={destination} className="w-full">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 p-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          <User className="h-5 w-5" />
          <span>{buttonText}</span>
        </Button>
      </Link>
    );
  }

  // Icon display mode (original)
  return (
    <Link href={destination}>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary/80 hover:text-primary relative h-11 w-11 cursor-pointer rounded-full hover:bg-gray-100"
      >
        <User className="h-5 w-5" />
      </Button>
    </Link>
  );
};
