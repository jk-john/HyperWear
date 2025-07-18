export const getURL = (path: string = "") => {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL || // Set this to your site URL in production
    process.env.NEXT_PUBLIC_VERCEL_URL || // Vercel-specific env var
    "http://localhost:3000"; // Fallback to localhost in development

  // Ensure the URL is absolute
  const absoluteUrl = url.startsWith("http") ? url : `https://${url}`;
  
  // Append the path, ensuring no double slashes
  return `${absoluteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const getSupabaseCallbackUrl = (callbackUrl?: string) => {
  let url = getURL("/auth/callback");

  if (callbackUrl) {
    url += `?next=${encodeURIComponent(callbackUrl)}`;
  }
  
  return url;
} 