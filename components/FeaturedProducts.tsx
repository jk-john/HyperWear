"use client";

import { products } from "@/constants";
import ProductGrid from "./ProductGrid";

const VISIBLE_PRODUCTS = 9;

export default function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-white font-display">
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
