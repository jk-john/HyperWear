import { cache } from 'react';
import { createClient } from "@/types/utils/supabase/server";

// Cache product queries to prevent duplicate database calls within request lifecycle
export const getCachedProducts = cache(async () => {
  const supabase = createClient();
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching cached products:", error);
    throw error;
  }
  
  return products || [];
});

export const getCachedProductCategories = cache(async () => {
  const supabase = createClient();
  
  const { data: allProducts, error } = await supabase
    .from("products")
    .select("category");
    
  if (error) {
    console.error("Error fetching cached categories:", error);
    throw error;
  }
  
  // Extract unique categories
  return allProducts
    ? [...new Set(allProducts.map((p) => p.category).filter(Boolean))]
    : [];
});

export const getCachedProductsByCategory = cache(async (category: string) => {
  const supabase = createClient();
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .ilike("category", `%${category}%`)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error(`Error fetching cached products for category ${category}:`, error);
    throw error;
  }
  
  return products || [];
});

// Cache individual product by slug
export const getCachedProductBySlug = cache(async (slug: string) => {
  const supabase = createClient();
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
    
  if (error) {
    console.error(`Error fetching cached product for slug ${slug}:`, error);
    throw error;
  }
  
  return product;
});

// Cache product count for pagination
export const getCachedProductCount = cache(async () => {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true });
    
  if (error) {
    console.error("Error fetching cached product count:", error);
    throw error;
  }
  
  return count || 0;
});