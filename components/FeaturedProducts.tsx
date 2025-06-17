"use client";

import { products } from "@/constants";
import ProductGrid from "./ProductGrid";

const VISIBLE_PRODUCTS = 9;

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-semibold text-[var(--color-dark)]">
            Featured Products
          </h2>
        </div>
        <div className="overflow-hidden">
          <ProductGrid products={products.slice(0, VISIBLE_PRODUCTS)} />
        </div>
      </div>
    </section>
  );
}
