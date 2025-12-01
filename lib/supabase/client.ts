import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseAuthUrl } from "./config";

let supabaseInstance: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('createClient from lib/supabase/client can only be used in the browser. Use the server client for SSR.');
  }

  if (!supabaseInstance) {
    const supabaseUrl = getSupabaseAuthUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    supabaseInstance = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: "pkce",
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
      }
    );
  }

  return supabaseInstance;
} 