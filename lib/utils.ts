import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPublicImageUrl(path: string): string {
  if (!path) return "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/tee-shirt.webp"; // Fallback image

  // If the path is already a full URL, return it directly
  if (path.startsWith("http")) {
    return path;
  }

  // If the path starts with a slash, it's a local public path
  if (path.startsWith("/")) {
    return path;
  }

  // Get Supabase URL with fallback
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://auth.hyperwear.io";
  const storageUrl = `${supabaseUrl}/storage/v1/object/public/`;

  // If the path includes a slash, it's assumed to contain the bucket name
  if (path.includes("/")) {
    return `${storageUrl}${path}`;
  }

  // Otherwise, use the default 'product-images' bucket
  return `${storageUrl}product-images/${path}`;
}

// Utility to clear potentially broken cart data from localStorage
export function clearBrokenCartData() {
  if (typeof window !== "undefined") {
    try {
      // Clear the cart storage
      localStorage.removeItem("cart-storage-v2");
      console.log("Cart data cleared successfully");
      return true;
    } catch (error) {
      console.error("Failed to clear cart data:", error);
      return false;
    }
  }
  return false;
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

  return siteUrl;
};

export const getCallbackUrl = () => {
  return `${getSiteUrl()}auth/callback`;
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
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
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

// Free error logging utility for production
export function logError(error: Error, context?: string, metadata?: Record<string, unknown>) {
  const errorData = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
    metadata,
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
  };
  
  // In development, just console.error
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', errorData);
    return;
  }
  
  // In production, log to console AND your database
  console.error('PRODUCTION_ERROR:', JSON.stringify(errorData));
  
  // Send to your own database for tracking (completely free!)
  try {
    fetch('/api/log-error', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData) 
    }).catch(err => console.error('Failed to log error to database:', err));
  } catch (err) {
    console.error('Error logging to database:', err);
  }
}

export function logInfo(message: string, metadata?: Record<string, unknown>) {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'info',
    message,
    metadata,
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Info:', logData);
  } else {
    console.log('PRODUCTION_INFO:', JSON.stringify(logData));
  }
}
