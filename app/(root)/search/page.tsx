import ProductGrid from "@/components/ProductGrid";
import SearchPage from "@/components/SearchPage";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const metadata = {
  title: "Search • HyperWear",
};

export default async function Search({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
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
      <SearchPage />
      <div className="mt-6">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          query && <p>No products found for &quot;{query}&quot;.</p>
        )}
      </div>
    </main>
  );
}
