"use client";

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
import { Button } from "./ui/button";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
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
    product.category === "t-shirts" &&
    product.available_sizes &&
    product.available_sizes.length > 0;

  const handleAddToCart = () => {
    if (needsSizeSelection && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, selectedSize);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      <ProductImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={product}
        initialSlide={initialSlide}
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="h-[500px]">
          <ProductImageCarousel
            images={product.images || []}
            productName={product.name}
            onImageClick={handleImageClick}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold">${product.price}</p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-300">
            {product.description}
          </p>

          <div className="mt-6">
            {needsSizeSelection && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Size</label>
                <Select
                  onValueChange={(value) =>
                    setSelectedSize(value === "null" ? undefined : value)
                  }
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.available_sizes?.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              onClick={handleAddToCart}
              disabled={!!(needsSizeSelection && !selectedSize)}
              className="w-full"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
