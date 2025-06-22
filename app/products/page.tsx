import { ProductFilters } from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import StylishTitle from "@/components/ProductsTitle";
import { getProducts } from "@/lib/supabase";

type ProductsPageProps = {
  searchParams: {
    gender?: string;
    category?: string;
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
        <div className="mb-1text-center">
          <StylishTitle />
        </div>
        <ProductFilters categories={categories} />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
