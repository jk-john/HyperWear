import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getSupabaseStorageUrl } from "@/lib/supabase/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nodeEnv = process.env.NODE_ENV;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function getPublicImageUrl(path: string, productSlug?: string): string {
  if (!path) return "/products-img/fallback.webp"; // Fallback image

  // If the path is already a full URL, return it directly
  if (path.startsWith("http")) {
    return path;
  }

  // If it's a relative path starting with '/', return it as-is (for /products-img/ fallback paths)
  if (path.startsWith("/")) {
    return path;
  }

  const supabaseStorageUrl = `${getSupabaseStorageUrl()}/storage/v1/object/public/`;

  // If the path includes a slash, it's assumed to contain the bucket name
  if (path.includes("/")) {
    return `${supabaseStorageUrl}${path}`;
  }

  // Ensure .webp extension for legacy support (though all DB URLs should now be complete)
  const filename = path.endsWith('.webp') ? path : `${path.replace(/\.(png|jpg|jpeg)$/i, '')}.webp`;
  
  // If we have a product slug, use it to construct the full path  
  if (productSlug) {
    return `${supabaseStorageUrl}products-images/${productSlug}/${filename}`;
  }

  // Default fallback - should rarely be used now that DB has complete URLs
  console.warn("getPublicImageUrl: Using default bucket path for", path);
  return `${supabaseStorageUrl}products-images/${filename}`;
}

// Simplified cart image helper - database now has complete URLs
export function getCartImageUrl(product: { images?: string[]; slug?: string; id?: string; name?: string }): string {
  // Ensure product has images array
  if (!product?.images || product.images.length === 0) {
    if (nodeEnv === "development") {
      console.warn("Product has no images:", product?.id || "unknown", product?.name || "unknown");
    }
    return "/products-img/fallback.webp";
  }

  // Get first valid image from array
  for (const image of product.images) {
    if (image && typeof image === "string") {
      // All database images should now be complete URLs or proper fallback paths
      const imageUrl = getPublicImageUrl(image, product.slug);
      
      if (nodeEnv === "development") {
        console.log("Cart image URL for product:", product.id, imageUrl);
      }
      
      return imageUrl;
    }
  }

  if (nodeEnv === "development") {
    console.warn("No valid images found for product:", product?.id || "unknown");
  }
  return "/products-img/fallback.webp";
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
  if (!siteUrl) {
    if (nodeEnv === "development") {
      return "http://localhost:3000";
    }
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. Please set it in your .env file."
    );
  }

  return siteUrl;
};

export const getCallbackUrl = () => {
  return `${getSiteUrl()}/auth/callback`;
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
    (key) => !(process.env as Record<string, string | undefined>)[key]
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
  if (nodeEnv === 'development') {
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
  
  if (nodeEnv === 'development') {
    console.log('Info:', logData);
  } else {
    console.log('PRODUCTION_INFO:', JSON.stringify(logData));
  }
}
