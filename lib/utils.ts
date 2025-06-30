import { clsx, type ClassValue } from "clsx";
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
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction ? "https://hyperwear.io" : "http://localhost:3000";
};
