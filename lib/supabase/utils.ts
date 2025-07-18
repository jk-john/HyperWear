export function getSupabaseCallbackUrl(next?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const callbackPath = "/auth/callback";

  const url = new URL(callbackPath, baseUrl);
  if (next) url.searchParams.set("next", next);

  return url.toString();
} 