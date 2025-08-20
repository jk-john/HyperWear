export function getSupabaseCallbackUrl(next?: string) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  
  // In production, ensure we use the www subdomain to match user access
  if (baseUrl === "https://hyperwear.io") {
    baseUrl = "https://www.hyperwear.io";
  }
  
  // Alternative: Try to detect from current window location if available (client-side)
  if (typeof window !== "undefined" && window.location.hostname.includes("www")) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    baseUrl = `${protocol}//${hostname}`;
    console.log("🔍 Using detected window location:", baseUrl);
  }
  
  const callbackPath = "/auth/callback";

  const url = new URL(callbackPath, baseUrl);
  if (next) url.searchParams.set("next", next);

  // Debug logging
  console.log("🔍 getSupabaseCallbackUrl DEBUG:");
  console.log("- Original SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);
  console.log("- Final baseUrl:", baseUrl);
  console.log("- Generated callback URL:", url.toString());

  return url.toString();
} 