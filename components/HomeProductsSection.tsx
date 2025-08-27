import { createClient } from "@/types/utils/supabase/server";
import Link from "next/link";
import ProductGrid from "./ProductGrid";
import { Button } from "./ui/button";

export default async function HomeProductsSection() {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return <p className="text-white">Error loading products.</p>;
  }

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore Our Collection
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our complete collection of HyperLiquid merchandise designed by the community, for the community.
          </p>
        </div>
        
        {products && products.length > 0 ? (
          <ProductGrid
            products={products.slice(0, 6)} 
            className="!bg-transparent !p-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products available at the moment.</p>
          </div>
        )}

        {products && products.length > 6 && (
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-lg transition-transform transform hover:scale-105">
              <Link href="/products">
                View All Products
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}