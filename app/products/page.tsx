import ProductGrid from "@/components/ProductGrid";
import ProductSidebar from "@/components/ProductSidebar";
import StylishTitle from "@/components/ProductsTitle";
import { createClient } from "@/utils/supabase/server";

type ProductsPageProps = {
  searchParams: {
    gender?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  };
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const supabase = createClient();
  const { gender, category, sortBy, order } = searchParams;

  let query = supabase.from("products").select("*");

  if (gender) {
    query = query.eq("gender", gender);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (sortBy) {
    query = query.order(sortBy, { ascending: order !== "desc" });
  }

  const { data: products, error } = await query;

  if (error) {
    // Handle error appropriately
    console.error(error);
    return <div>Error loading products.</div>;
  }

  const categories = ["T-shirts", "Cups", "Caps", "Phone Cases", "Plushes"];
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <StylishTitle />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <ProductSidebar categories={categories} />
          <main className="md:col-span-3">
            <ProductGrid
              products={products}
              className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
            />
          </main>
        </div>
      </div>
    </section>
  );
}
