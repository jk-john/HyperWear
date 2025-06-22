import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProducts(filters?: {
  gender?: string;
  category?: string;
  sortBy?: string;
  order?: string;
}) {
  let query = supabase.from("products").select("*");

  const sortBy = filters?.sortBy || "name";
  const ascending = filters?.order !== "desc";

  query = query.order(sortBy, { ascending });

  if (filters?.gender) {
    query = query.eq("gender", filters.gender);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name");
  if (error) throw error;
  return data || [];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error && error.code !== "PGRST116") throw error; // ignore "no rows" code
  return data;
}
