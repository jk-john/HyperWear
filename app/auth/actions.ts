"use server";

import { createClient } from "@/types/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    // For form actions, we should redirect even if there's an error
    // The error will be logged but the user will still be redirected
  }

  redirect("/");
}
