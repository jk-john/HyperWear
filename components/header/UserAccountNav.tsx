"use client";

import { Button } from "@/components/ui/button";
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
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-11 w-11 rounded-full text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white md:flex"
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>
      ) : (
        <Link href="/sign-in">
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-11 w-11 rounded-full text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white md:flex"
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>
      )}
    </>
  );
};
