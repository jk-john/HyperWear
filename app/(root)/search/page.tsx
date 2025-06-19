import SearchPage from "@/components/SearchPage";
import { PageProps } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const metadata = {
  title: "Search • HyperWear",
};

export default async function Search({ searchParams }: PageProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const query = searchParams?.q as string;

  let products = [];
  if (query) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    products = data || [];
  }

  return (
    <main className="container mx-auto py-8">
      <SearchPage products={products} query={query} />
    </main>
  );
}
