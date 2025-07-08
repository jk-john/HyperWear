"use client";

import { cn } from "@/lib/utils";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export default function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-8 bg-white p-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 md:grid-cols-3 md:gap-x-12 md:gap-y-12 xl:grid-cols-3",
        className,
      )}
    >
      {products.map((product) => (
        <div key={product.id} className="flex">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
