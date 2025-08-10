"use client";

import { Product } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";

const VISIBLE_PRODUCTS = 6;

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .contains("tags", ["Featured"])
          .limit(VISIBLE_PRODUCTS);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Prevent hydration mismatch by showing consistent loading state until mounted
  if (!mounted) {
    return (
      <section className="w-full bg-white mt-1 p-12">
        <div className="container mx-auto px-2 pt-8 sm:px-6 sm:pt-10 md:px-8">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-dark)] sm:text-4xl">
              Featured Products
            </h2>
            <p className="text-base font-light text-gray-600 sm:text-lg">
              Explore our carefully curated collection of exceptional products.
            </p>
          </div>
          <div className="overflow-hidden p-12">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white mt-1 p-12">
      <div className="container mx-auto px-2 pt-8 sm:px-6 sm:pt-10 md:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-dark)] sm:text-4xl">
            Featured Products
          </h2>
          <p className="text-base font-light text-gray-600 sm:text-lg">
            Explore our carefully curated collection of exceptional products.
          </p>
        </div>
        <div className="overflow-hidden p-12">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <ProductGrid products={products} className="!bg-transparent !p-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8 lg:gap-10 xl:gap-12" />
          )}
        </div>
      </div>
    </section>
  );
}
