"use client";

import { useCartStore } from "@/stores/cart";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  return (
    <CardContainer containerClassName="py-0 h-full">
      <CardBody className="font-body flex h-[450px] w-[350px] flex-col justify-between gap-4 rounded-2xl bg-[var(--color-deep)] p-4">
        <CardItem translateZ="50" className="h-[60%] w-full">
          <div className="group relative h-full">
            <Image
              src={product.image_url || "/placeholder.png"}
              alt={product.name}
              width={350}
              height={350}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </CardItem>

        <CardItem
          translateZ="20"
          className="flex h-[40%] flex-col justify-between"
        >
          <div className="flex flex-col">
            <div>
              <Link href={`/products/${product.id}`}>
                <h3 className="mt-1 text-lg font-semibold text-[var(--color-cream)]">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-bold text-[var(--color-cream)]">
                ${product.price}
              </p>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <Button
              className="w-full bg-[var(--color-light)] text-black hover:bg-[var(--color-primary)] hover:text-white"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
