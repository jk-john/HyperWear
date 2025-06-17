"use client";

import { products } from "@/constants";
import { useState } from "react";
import BtnPagination from "./BtnPagination";
import ProductGrid from "./ProductGrid";

const VISIBLE_PRODUCTS = 4;

export default function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < products.length - VISIBLE_PRODUCTS) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-semibold text-white font-display mb-20">
            Featured Products
          </h2>
          <div className="w-64">
            <BtnPagination
              onNext={handleNext}
              onPrev={handlePrev}
              isNextDisabled={
                currentIndex >= products.length - VISIBLE_PRODUCTS
              }
              isPrevDisabled={currentIndex === 0}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <ProductGrid products={products} currentIndex={currentIndex} />
        </div>
      </div>
    </section>
  );
}
