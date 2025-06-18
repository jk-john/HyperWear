import { Product } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ProductGrid from "./ProductGrid";

export default async function AllProducts() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    // You might want to render an error message here
    return <p>Error loading products.</p>;
  }

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-semibold text-[var(--color-dark)]">
            All Products
          </h2>
        </div>
        <div className="overflow-hidden">
          <ProductGrid products={products as Product[]} />
        </div>
      </div>
    </section>
  );
}
