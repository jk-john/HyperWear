import { Product } from "@/types";
import { createClient } from "@/utils/supabase/server";
import ProductGrid from "./ProductGrid";

export default async function AllProducts() {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    // You might want to render an error message here
    return <p className="text-white">Error loading products.</p>;
  }

  return (
    <section className="w-full bg-white mt-1 p-12">
      <div className="container mx-auto px-2 py-8 sm:px-6 sm:py-10 md:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-dark)] sm:text-4xl">
            All Products
          </h2>
          <p className="font-light text-xl text-gray-600 sm:text-xl mt-10 text-center">
            Discover our complete collection of HyperLiquid merchandise designed by the community. 
          </p>
        </div>
        <div className="overflow-hidden p-12">
          <ProductGrid products={products as Product[]} className="!bg-transparent !p-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8 lg:gap-10 xl:gap-12" />
        </div>
      </div>
    </section>
  );
}
