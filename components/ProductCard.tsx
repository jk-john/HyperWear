"use client";

import { useCart } from "@/context/CartContext";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    colors?: string[];
    image: string;
    tags: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <CardContainer containerClassName="py-0">
      <CardBody className="bg-white/5 p-4 rounded-2xl grid grid-rows-[1fr_auto] gap-4 w-full h-[450px] font-body">
        <CardItem translateZ="50" className="w-full">
          <div className="relative group h-full">
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="absolute top-2 right-2 z-10">
              <Button size="icon" variant="secondary" className="rounded-full">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            <Image
              src={product.image}
              alt={product.name}
              width={350}
              height={350}
              className="w-full h-full rounded-xl object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center"></div>
          </div>
        </CardItem>

        <CardItem translateZ="20" className="flex flex-col">
          <div className="flex flex-col h-full">
            <div>
              <p className="text-teal-400 text-sm font-medium">
                {product.category}
              </p>
              <Link href={`/products/${product.id}`}>
                <h3 className="text-white text-lg font-semibold mt-1">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-white text-2xl font-bold">
                  ${product.price}
                </p>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <p className="text-gray-400 line-through text-lg">
                      ${product.originalPrice}
                    </p>
                  )}
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Button
                className="w-full bg-teal-800 hover:bg-teal-700 text-white"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
