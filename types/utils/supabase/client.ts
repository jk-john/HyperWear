import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";

let supabaseInstance: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('Browser client can only be used in the browser. Use server client for SSR.');
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: "pkce",
          storage: window.localStorage,
        },
      }
    );
  }

  return supabaseInstance;
}
