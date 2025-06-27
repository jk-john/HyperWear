"use client";

import { Button } from "@/components/ui/Button";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "lucide-react";
import Link from "next/link";

interface UserAccountNavProps {
  user: SupabaseUser | null;
}

export const UserAccountNav = ({ user }: UserAccountNavProps) => {
  return (
    <>
      {user ? (
        <Link href="/dashboard" legacyBehavior>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary/80 hover:text-primary hidden h-11 w-11 cursor-pointer rounded-full transition-all duration-300 hover:bg-gray-100 md:flex"
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>
      ) : (
        <Link href="/sign-in" legacyBehavior>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary/80 hover:text-primary hidden h-11 w-11 rounded-full transition-all duration-300 hover:bg-gray-100 md:flex"
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>
      )}
    </>
  );
};
