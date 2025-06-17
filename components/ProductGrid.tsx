"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  colors: string[];
  image: string;
  tags: string[];
}

interface ProductGridProps {
  products: Product[];
  currentIndex: number;
}

export default function ProductGrid({
  products,
  currentIndex,
}: ProductGridProps) {
  return (
    <motion.div
      className="flex gap-8"
      animate={{
        x: `-${currentIndex * (100 / 4)}%`, // Assuming 4 items are visible
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {products.map((product) => (
        <div key={product.id} className="flex-shrink-0 w-1/4">
          <ProductCard product={product} />
        </div>
      ))}
    </motion.div>
  );
}
