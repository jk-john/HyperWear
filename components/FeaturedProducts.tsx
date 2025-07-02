"use client";

import { Product } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";

const VISIBLE_PRODUCTS = 4;

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(VISIBLE_PRODUCTS);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section className="mb-8 rounded-lg bg-white px-4 pt-8 sm:mb-12 sm:px-6 sm:pt-10 md:px-8">
      <div className="container mx-auto">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-dark)] sm:text-4xl">
            Featured Products
          </h2>
          <p className="text-base font-light text-gray-600 sm:text-lg">
            Explore our carefully curated collection of exceptional products.
          </p>
        </div>
        <div className="overflow-hidden">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </section>
  );
}
