// // lib/supabase.ts
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// export const supabase = createClient(supabaseUrl, supabaseKey);

// export async function getProducts() {
//   const { data, error } = await supabase
//     .from("products")
//     .select("id, name, slug, price, image_url")
//     .eq("active", true)
//     .order("name");
//   if (error) throw error;
//   return data;
// }

// export async function getProductBySlug(slug: string) {
//     const { data, error } = await supabase
//       .from("products")
//       .select("id, name, slug, price, description, image_url")
//       .eq("slug", slug)
//       .single();
//     if (error && error.code !== "PGRST116") throw error; // ignore “no rows” code
//     return data;
//   }
