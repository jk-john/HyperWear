import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPublicImageUrl(path: string): string {
  if (!path) return "/products-img/tee-shirt.webp"; // Fallback image

  // If the path is already a full URL, return it directly
  if (path.startsWith("http")) {
    return path;
  }

  const supabaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;

  // If the path includes a slash, it's assumed to contain the bucket name
  if (path.includes("/")) {
    return `${supabaseUrl}${path}`;
  }

  // Otherwise, use the default 'product-images' bucket
  return `${supabaseUrl}product-images/${path}`;
}

export const getSiteUrl = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. Please set it in your .env file."
    );
  }

  const url = siteUrl.includes("http") ? siteUrl : `https://${siteUrl}`;
  return url.endsWith("/") ? url : `${url}/`;
};

export const getCallbackUrl = () => {
  if (typeof window === "undefined") {
    // On the server, we can't use window.location.origin
    // We must rely on the environment variable.
    return `${getSiteUrl()}auth/callback`;
  }
  return `${window.location.origin}/auth/callback`;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export function assertEnvVars() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (key) => !process.env[key]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(
        ", "
      )}. Please check your .env file.`
    );
  }
}
