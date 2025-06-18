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
          <StylishTitle
            title="All Products"
            animatedWords={["Products"]}
            subtitle="All Products"
            titleClassName="text-4xl md:text-6xl lg:text-7xl"
            subtitleClassName="text-xl md:text-xl"
            animatedTextClassName="text-2xl md:text-3xl lg:text-4xl"
            wordInterval={3000}
          />
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
