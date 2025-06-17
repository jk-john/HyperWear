"use client";

import { signOut } from "@/app/auth/actions";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/40"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-semibold">Sign Out</span>
      </button>
    </form>
  );
}
