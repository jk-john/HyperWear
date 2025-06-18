import ProductGrid from "@/components/ProductGrid";
import StylishTitle from "@/components/ProductsTitle";

import { getProducts } from "@/lib/supabase";

export const metadata = {
  title: "Shop • HyperWear",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <div className="mb-1text-center">
          <StylishTitle />
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
