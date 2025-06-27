"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/cart";
import { Product } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { ProductImageModal } from "./ProductImageModal";
import { Badge } from "./ui/badge";
import { Button } from "./ui/Button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const needsSizeSelection =
    (product.category === "T-shirts" || product.category === "Shorts") &&
    product.available_sizes &&
    product.available_sizes.length > 0;

  const handleAddToCart = () => {
    if (needsSizeSelection && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    <>
      <ProductImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={product}
        initialSlide={initialSlide}
      />
      <CardContainer className="h-full w-full max-w-[300px]">
        <CardBody className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-xl dark:bg-zinc-900">
          <CardItem
            translateZ="60"
            className="relative h-64 w-full"
            onClick={() => handleImageClick(0)}
          >
            <ProductImageCarousel
              images={product.images || []}
              productName={product.name}
              onImageClick={handleImageClick}
            />
            {product.tags?.includes("New") && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 z-10"
              >
                New
              </Badge>
            )}
          </CardItem>

          <div className="mt-4 flex flex-1 flex-col justify-between space-y-2">
            <CardItem translateZ="20">
              <h3 className="text-mint font-body text-center text-lg font-semibold dark:text-white">
                {product.name}
              </h3>
            </CardItem>
            <CardItem translateZ="20">
              <p className="bg-primary text-secondary mb-6 rounded-lg px-4 py-1 text-center font-medium dark:text-white">
                ${product.price}
              </p>
            </CardItem>
            {needsSizeSelection && (
              <CardItem translateZ="20" className="w-full">
                <Select
                  onValueChange={(value) =>
                    setSelectedSize(value === "null" ? undefined : value)
                  }
                >
                  <SelectTrigger className="text-jungle w-full bg-white">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent className="text-primary bg-white">
                    {product.available_sizes?.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardItem>
            )}
            <CardItem translateZ="20" className="w-full">
              <Button
                className="bg-secondary hover:bg-jungle hover:shadow-mint/40 w-full text-black hover:text-white"
                onClick={handleAddToCart}
                disabled={!!(needsSizeSelection && !selectedSize)}
              >
                Add to Cart
              </Button>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </>
  );
}
