"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Product } from "@/types";
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
    <section className="bg-white pt-10">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-semibold text-[var(--color-dark)]">
            Featured Products
          </h2>
          <p>Discover our handpicked selection of premium products.</p>
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
