import ProductGrid from "@/components/ProductGrid";
import ProductSidebar from "@/components/ProductSidebar";
import StylishTitle from "@/components/ProductsTitle";
import { getProducts } from "@/lib/supabase";

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
  const products = await getProducts(searchParams);

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
            <ProductGrid products={products} />
          </main>
        </div>
      </div>
    </section>
  );
}
