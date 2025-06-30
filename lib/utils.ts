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

export const getURL = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Ensure it starts with http or https
  url = url.includes("http") ? url : `https://${url}`;

  // Ensure trailing slash
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
