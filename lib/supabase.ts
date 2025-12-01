import { createClient } from "@/types/utils/supabase/server";

export async function searchProducts(query: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name");
  if (error) throw error;
  return data || [];
}

export async function getProductBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error && error.code !== "PGRST116") throw error; // ignore "no rows" code
  return data;
}
