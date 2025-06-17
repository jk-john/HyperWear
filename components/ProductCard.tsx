"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    description?: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.image_url) {
      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
      };
      addToCart(productToAdd);
    }
  };

  return (
    <CardContainer containerClassName="py-0 h-full">
      <CardBody className="font-body flex h-[450px] w-[350px] flex-col justify-between gap-4 rounded-2xl bg-white/5 p-4">
        <CardItem translateZ="50" className="h-[60%] w-full">
          <div className="group relative h-full">
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
              <Badge variant="secondary">New</Badge>
            </div>
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
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-bold text-white">${product.price}</p>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <Button
              className="w-full bg-[#dbfbf6] text-black hover:bg-[#0f3933] hover:text-white"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
