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
    slug: string;
    price: number;
    image_url: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
    };
    addToCart(productToAdd);
  };

  return (
    <CardContainer containerClassName="py-0 h-full">
      <CardBody className="bg-white/5 p-4 rounded-2xl flex flex-col justify-between gap-4 w-[350px] h-[450px] font-body">
        <CardItem translateZ="50" className="w-full h-[60%]">
          <div className="relative group h-full">
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
              <Badge variant="secondary">New</Badge>
            </div>
            <Image
              src={product.image_url}
              alt={product.name}
              width={350}
              height={350}
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
        </CardItem>

        <CardItem
          translateZ="20"
          className="flex flex-col h-[40%] justify-between"
        >
          <div className="flex flex-col">
            <div>
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-white text-lg font-semibold mt-1">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-white text-2xl font-bold">${product.price}</p>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <Button
              className="w-full bg-[#dbfbf6] hover:bg-[#0f3933] hover:text-white text-black"
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
