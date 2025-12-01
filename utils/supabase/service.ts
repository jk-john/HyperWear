import { createClient } from '@supabase/supabase-js';
import { getSupabaseAuthUrl, getSupabaseServiceRoleKey } from "@/lib/supabase/config";

export const createServiceClient = () => {
  return createClient(
    getSupabaseAuthUrl(),
    getSupabaseServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};