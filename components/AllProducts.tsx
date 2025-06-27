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
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-semibold text-[var(--color-dark)]">
            All Products
          </h2>
          <p>
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
