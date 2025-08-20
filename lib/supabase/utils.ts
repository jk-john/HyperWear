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
  
  // Ensure baseUrl ends with no trailing slash for proper URL construction
  baseUrl = baseUrl.replace(/\/$/, "");
  
  // Construct the full callback URL
  const callbackUrl = `${baseUrl}/auth/callback`;
  
  // Add next parameter if provided
  if (next) {
    const url = new URL(callbackUrl);
    url.searchParams.set("next", next);
    const finalUrl = url.toString();
    
    // Debug logging
    console.log("🔍 getSupabaseCallbackUrl DEBUG (with next):");
    console.log("- Original SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);
    console.log("- Final baseUrl:", baseUrl);
    console.log("- Callback URL:", callbackUrl);
    console.log("- Final URL with params:", finalUrl);
    
    return finalUrl;
  }

  // Debug logging
  console.log("🔍 getSupabaseCallbackUrl DEBUG:");
  console.log("- Original SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);
  console.log("- Final baseUrl:", baseUrl);
  console.log("- Generated callback URL:", callbackUrl);

  return callbackUrl;
} 