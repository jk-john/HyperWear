"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "./button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Button
      className="bg-primary hover:bg-secondary font-body h-12 w-full rounded-full text-base font-semibold text-white transition-all duration-300 hover:text-black"
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </Button>
  );
}
