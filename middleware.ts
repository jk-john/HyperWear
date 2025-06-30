import { createClient } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log({
    message: "Middleware check",
    pathname: request.nextUrl.pathname,
    user: user?.id,
    hasWelcomeMessage: request.nextUrl.searchParams.has("welcome_message"),
  });

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("Redirecting to /sign-in from middleware");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/dashboard/:path*",
  ],
};
