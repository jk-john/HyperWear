"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHypePrice } from "@/context/HypePriceContext";
import { logError } from '@/lib/utils';
import { useCartStore } from "@/stores/cart";
import { Product } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { ProductImageModal } from "./ProductImageModal";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const { hypePrice, isLoading: hypeLoading } = useHypePrice();

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
    try {
      if (needsSizeSelection && !selectedSize) {
        toast.error("Please select a size");
        return;
      }
      addToCart(product, selectedSize);
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), 'Add to Cart', {
        productId: product.id,
        selectedSize
      });
      toast.error("Something went wrong");
    }
  };

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : 0;

  // Calculate HYPE prices
  const usdPrice = Number(product.price);
  const usdOriginalPrice = Number(product.original_price);
  const hypeCurrentPrice = hypePrice ? (usdPrice / hypePrice) : null;
  const hypeOriginalPrice = hypePrice && hasDiscount ? (usdOriginalPrice / hypePrice) : null;

  return (
    <>
      <ProductImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={product}
        initialSlide={initialSlide}
      />
      <CardContainer className="h-full w-full max-w-[320px]">
        <CardBody className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50/50 p-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-mint)]/10 dark:from-zinc-900 dark:to-zinc-800/50">
          {/* Image Section */}
          <CardItem
            translateZ="60"
            className="relative h-72 w-full overflow-hidden rounded-t-3xl"
            onClick={() => handleImageClick(0)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ProductImageCarousel
              images={product.images || []}
              productName={product.name}
              onImageClick={handleImageClick}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {product.tags?.includes("New") && (
                <Badge className="bg-[var(--color-mint)] hover:bg-[var(--color-emerald)] text-white font-semibold px-3 py-1 text-xs rounded-full shadow-lg">
                  ✨ New
                </Badge>
              )}
              {hasDiscount && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 text-xs rounded-full shadow-lg animate-pulse">
                  -{discountPercentage}%
                </Badge>
              )}
              {hypeCurrentPrice && (
                <Badge className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-emerald)] text-[var(--color-secondary)] font-bold px-3 py-1 text-xs rounded-full shadow-lg border border-[var(--color-secondary)]/20">
                  <span>Pay with</span>
                  <Image src="/HYPE.svg" alt="HYPE" width={16} height={16} />
                </Badge>
              )}
            </div>

            {/* Quick View Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button 
                onClick={() => handleImageClick(0)}
                className="bg-white/90 hover:bg-white text-gray-900 font-semibold px-6 py-2 rounded-full shadow-xl backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              >
                Quick View
              </Button>
            </div>
          </CardItem>

          {/* Content Section */}
          <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
            {/* Product Name */}
            <CardItem translateZ="20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[var(--color-mint)] transition-colors duration-300">
                {product.name}
              </h3>
            </CardItem>

            {/* Description */}
            <CardItem translateZ="30" className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </CardItem>

            {/* Enhanced HYPE Pricing Section */}
            <CardItem translateZ="40" className="space-y-3">
              {/* HYPE Price - Elegant Design */}
              {hypeCurrentPrice && !hypeLoading ? (
                <div className="relative">
                  {/* Main HYPE Price Card */}
                  <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-emerald)] to-[var(--color-deep)] rounded-2xl p-5 shadow-lg border border-[var(--color-secondary)]/20 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 p-1 bg-[var(--color-secondary)]/10 rounded-full">
                          <Image
                            src="/HYPE.svg"
                            alt="HYPE"
                            width={24}
                            height={24}
                            className="w-full h-full object-contain filter brightness-0 invert"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[var(--color-secondary)] font-bold text-xl tracking-tight">
                            {hypeCurrentPrice.toFixed(2)}
                          </span>
                          <span className="text-[var(--color-secondary)] text-sm font-medium -mt-1">
                            HYPE
                          </span>
                        </div>
                      </div>
                      {hypeOriginalPrice && (
                        <div className="text-right">
                          <span className="text-[var(--color-accent)] line-through text-sm font-medium block">
                            {hypeOriginalPrice.toFixed(2)} HYPE
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-[var(--color-light)] text-xs font-medium flex items-center gap-1">
                        <span>Native HyperEVM payment</span>
                        <span className="text-[var(--color-secondary)] animate-pulse">⚡</span>
                      </div>
                      
                      {/* USD Price Badge */}
                      <div className="bg-[var(--color-secondary)]/90 text-[var(--color-primary)] px-3 py-1 rounded-lg text-sm font-bold">
                        ${usdPrice.toFixed(2)}
                        {hasDiscount && (
                          <span className="ml-2 text-xs line-through opacity-70">
                            ${usdOriginalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Fallback USD pricing with loading state
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-5 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${usdPrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-gray-500 line-through">
                          ${usdOriginalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {hypeLoading && (
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-[var(--color-mint)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading HYPE price...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Savings Indicator */}
              {hasDiscount && (
                <div className="flex items-center justify-center">
                  <div className="bg-[var(--color-mint)]/10 border border-[var(--color-mint)]/20 rounded-lg px-3 py-1">
                    <p className="text-sm font-semibold text-[var(--color-mint)] flex items-center gap-1">
                      <span>💰</span>
                      Save ${(usdOriginalPrice - usdPrice).toFixed(2)}!
                    </p>
                  </div>
                </div>
              )}
            </CardItem>

            {/* Size Selection */}
            {needsSizeSelection && (
              <CardItem translateZ="20" className="w-full">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Size *
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedSize(value === "null" ? undefined : value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 hover:border-[var(--color-mint)] focus:border-[var(--color-mint)] focus:ring-[var(--color-mint)]/20 transition-all duration-200">
                      <SelectValue placeholder="Choose your size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700">
                      {product.available_sizes?.map((size) => (
                        <SelectItem 
                          key={size} 
                          value={size}
                          className="hover:bg-[var(--color-light)] dark:hover:bg-[var(--color-emerald)]/20 focus:bg-[var(--color-light)] dark:focus:bg-[var(--color-emerald)]/20"
                        >
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardItem>
            )}

            {/* Compact Real Button */}
            <CardItem translateZ="20" className="w-full pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={!!(needsSizeSelection && !selectedSize)}
                className={`w-full h-10 text-sm font-medium rounded-md transition-all duration-200 ${
                  needsSizeSelection && !selectedSize
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-emerald)] text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                }`}
              >
                {needsSizeSelection && !selectedSize ? (
                  "Select a size"
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </CardItem>

            {/* Trust Indicators */}
            <CardItem translateZ="10" className="w-full">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2">
                <span className="flex items-center gap-1">
                  <span className="text-[var(--color-mint)]">✓</span>
                  Free Shipping $60+
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[var(--color-mint)]">✓</span>
                  30-Day Returns
                </span>
              </div>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </>
  );
}
