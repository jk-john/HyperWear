import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseAuthUrl } from "@/lib/supabase/config";

export const createClient = (request: NextRequest) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    getSupabaseAuthUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  return { supabase, response };
};

// Middleware logic
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const welcomeMessage = url.searchParams.get("welcome_message");

  if (welcomeMessage) {
    // Remove the param from the URL and set cookie
    url.searchParams.delete("welcome_message");

    const response = NextResponse.redirect(url);
    response.cookies.set("welcome_message", welcomeMessage, {
      path: "/",
      maxAge: 60, // valid for 60 seconds
    });

    return response;
  }

  return NextResponse.next();
}
