import { createServerClient } from "@supabase/ssr";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseAuthUrl } from "@/lib/supabase/config";

export const createClient = () => {
  const cookieStore = (cookies() as unknown as UnsafeUnwrappedCookies);

  return createServerClient(
    getSupabaseAuthUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const resolvedCookieStore = await cookieStore;
            cookiesToSet.forEach(({ name, value, options }) =>
              resolvedCookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
