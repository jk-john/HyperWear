"use client";

// Removed 3D card imports for cleaner hover effects
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
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
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

  const needsColorSelection = 
    (product.category === "t-shirts" || product.category === "caps") &&
    product.colors &&
    product.colors.length > 0;

  const handleAddToCart = () => {
    try {
      if (needsSizeSelection && !selectedSize) {
        toast.error("Please select a size");
        return;
      }
      if (needsColorSelection && !selectedColor) {
        toast.error("Please select a color");
        return;
      }
      addToCart(product, selectedSize, selectedColor);
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), 'Add to Cart', {
        productId: product.id,
        selectedSize,
        selectedColor
      });
      toast.error("Something went wrong");
    }
  };

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : 0;

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'white': '#FFFFFF',
      'black': '#000000',
      'red': '#DC2626',
      'blue': '#2563EB',
      'green': '#16A34A',
      'yellow': '#EAB308',
      'purple': '#9333EA',
      'pink': '#EC4899',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'navy': '#1E3A8A',
      'brown': '#A3A3A3',
    };
    
    return colorMap[color.toLowerCase()] || color;
  };

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
      <div className="h-full w-full max-w-[320px]">
        <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50/50 p-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-mint)]/10 dark:from-zinc-900 dark:to-zinc-800/50">
          {/* Image Section */}
          <div
            className="relative h-60 w-full overflow-hidden rounded-t-3xl cursor-pointer"
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
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
            {/* Product Name */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[var(--color-mint)] transition-colors duration-300">
                {product.name}
              </h3>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Enhanced HYPE Pricing Section */}
            <div className="space-y-2">
              {/* HYPE Price - Elegant Design */}
              {hypeCurrentPrice && !hypeLoading ? (
                <div className="relative">
                  {/* Main HYPE Price Card */}
                  <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-emerald)] to-[var(--color-deep)] rounded-lg p-2 shadow-md border border-[var(--color-secondary)]/20 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5 p-0.5 bg-[var(--color-secondary)]/10 rounded-full">
                          <Image
                            src="/HYPE.svg"
                            alt="HYPE"
                            width={16}
                            height={16}
                            className="w-full h-full object-contain filter brightness-0 invert"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[var(--color-secondary)] font-bold text-base tracking-tight">
                            {hypeCurrentPrice.toFixed(2)} HYPE
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
                      {/* USD Price Badge */}
                      <div className="bg-[var(--color-secondary)]/90 text-[var(--color-primary)] px-2 py-0.5 rounded text-xs font-medium">
                        ${usdPrice.toFixed(2)}
                        {hasDiscount && (
                          <span className="ml-1 text-xs line-through opacity-70">
                            ${usdOriginalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Fallback USD pricing with loading state
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${usdPrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${usdOriginalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {hypeLoading && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <div className="w-2 h-2 border-2 border-[var(--color-mint)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Savings Indicator */}
              {hasDiscount && (
                <div className="text-center">
                  <span className="text-xs font-medium text-[var(--color-mint)] bg-[var(--color-mint)]/10 px-2 py-0.5 rounded-md">
                    Save ${(usdOriginalPrice - usdPrice).toFixed(2)}!
                  </span>
                </div>
              )}
            </div>

            {/* Size Selection */}
            {needsSizeSelection && (
              <div className="w-full">
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
              </div>
            )}

            {/* Color Selection */}
            {needsColorSelection && (
              <div className="w-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Choose Color
                    </label>
                    {selectedColor && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: getColorStyle(selectedColor) }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {selectedColor}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {product.colors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-10 h-10 rounded-full border-3 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-mint)] ${
                          selectedColor === color
                            ? "border-[var(--color-mint)] shadow-lg ring-2 ring-[var(--color-mint)]/30 scale-110"
                            : "border-white dark:border-gray-600 shadow-md hover:shadow-lg"
                        }`}
                        style={{ backgroundColor: getColorStyle(color) }}
                        title={color}
                        aria-label={`Select ${color} color`}
                      >
                        {/* Inner ring for white colors */}
                        {getColorStyle(color) === '#FFFFFF' && (
                          <div className="absolute inset-1 rounded-full border border-gray-200"></div>
                        )}
                        
                        {/* Selection indicator */}
                        {selectedColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                              getColorStyle(color) === '#FFFFFF' || ['#FFFFFF', '#EAB308', '#FBBF24'].includes(getColorStyle(color)) 
                                ? 'bg-gray-800' : 'bg-white'
                            }`}>
                              <svg 
                                className={`w-2 h-2 ${
                                  getColorStyle(color) === '#FFFFFF' || ['#FFFFFF', '#EAB308', '#FBBF24'].includes(getColorStyle(color)) 
                                    ? 'text-white' : 'text-gray-800'
                                }`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Hover effect */}
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
                      </button>
                    ))}
                  </div>
                  
                  {!selectedColor && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Please select a color to continue
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="w-full pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={!!(needsSizeSelection && !selectedSize) || !!(needsColorSelection && !selectedColor)}
                className={`w-full h-10 text-sm font-medium rounded-md transition-all duration-200 ${
                  (needsSizeSelection && !selectedSize) || (needsColorSelection && !selectedColor)
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-emerald)] text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                }`}
              >
                {needsSizeSelection && !selectedSize ? (
                  "Select a size"
                ) : needsColorSelection && !selectedColor ? (
                  "Select a color"
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="w-full">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
