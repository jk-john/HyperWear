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
        "grid w-full grid-cols-1 justify-items-center sm:justify-items-stretch gap-6 sm:gap-x-8 sm:gap-y-10 bg-white p-4 sm:p-6 lg:p-8 md:gap-x-10 md:gap-y-12 lg:gap-x-12 lg:gap-y-14",
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
