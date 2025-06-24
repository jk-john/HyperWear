"use client";

import { useCartStore } from "@/stores/cart";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  return (
    <Card className="flex h-full w-full flex-col justify-between rounded-2xl bg-[var(--color-deep)]">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            fill
            className="rounded-t-2xl object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="mt-1 text-lg font-semibold text-[var(--color-cream)] hover:text-[var(--color-primary)]">
            {product.name}
          </CardTitle>
        </Link>
        <p className="mt-2 text-2xl font-bold text-[var(--color-cream)]">
          ${product.price}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-[var(--color-light)] text-black hover:bg-[var(--color-primary)] hover:text-white"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
