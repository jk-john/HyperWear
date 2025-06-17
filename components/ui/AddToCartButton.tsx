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
      className="w-full bg-primary text-white hover:bg-secondary hover:text-black font-semibold h-12 rounded-full transition-all duration-300 font-body text-base"
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </Button>
  );
}
