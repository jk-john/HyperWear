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
    <section className="w-full bg-white">
      <div className="container mx-auto px-2 py-8 sm:px-6 sm:py-10 md:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-dark)] sm:text-4xl">
            All Products
          </h2>
          <p className="text-base font-light text-gray-600 sm:text-lg">
            These are the products coming from the database. This is a
            placeholder for the actual products.
          </p>
        </div>
        <div className="overflow-hidden">
          <ProductGrid products={products as Product[]} />
        </div>
      </div>
    </section>
  );
}
