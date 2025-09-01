export function getSupabaseCallbackUrl(next?: string) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Fallback: match user's subdomain if on client-side
  if (typeof window !== "undefined" && window.location.hostname.includes("www")) {
    baseUrl = `${window.location.protocol}//${window.location.hostname}`;
  }

  // Always remove trailing slash
  baseUrl = baseUrl.replace(/\/$/, "");

  // Construct callback URL
  const callbackUrl = `${baseUrl}/auth/callback`;

  // If "next" is provided and is a relative path (starts with /), include it
  if (next && next.startsWith("/")) {
    return `${callbackUrl}?next=${encodeURIComponent(next)}`;
  }

  // Default: just return the clean callback URL
  return callbackUrl;
}
