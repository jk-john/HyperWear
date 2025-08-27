"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("An unexpected error occurred while signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/40"
    >
      <LogOut className="h-5 w-5" />
      <span className="font-semibold">Sign Out</span>
    </button>
  );
}
