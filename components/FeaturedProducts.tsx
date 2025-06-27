"use client";

import { products } from "@/constants";
import ProductGrid from "./ProductGrid";

const VISIBLE_PRODUCTS = 4;

export default function FeaturedProducts() {
  return (
    <section className="bg-white pt-10">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-semibold text-[var(--color-dark)]">
            Featured Products
          </h2>
          <p>
            These are the products coming from /constants folder. This is a
            placeholder for the actual products.
          </p>
        </div>
        <div className="overflow-hidden">
          <ProductGrid products={products.slice(0, VISIBLE_PRODUCTS)} />
        </div>
      </div>
    </section>
  );
}
