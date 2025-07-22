"use client";

import { getPublicImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";
import { Product } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ProductImageModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  initialSlide: number;
}

export const ProductImageModal = ({
  product,
  isOpen,
  onClose,
  initialSlide,
}: ProductImageModalProps) => {
  const { addToCart } = useCartStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialSlide,
  });
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const needsSizeSelection =
    product.category === "t-shirts" &&
    product.available_sizes &&
    product.available_sizes.length > 0;

  const needsColorSelection = 
    (product.category === "t-shirts" || product.category === "caps") &&
    product.colors &&
    product.colors.length > 0;

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(initialSlide, true);
    }
    // Reset selected size and color when the modal is opened or the product changes
    if (isOpen) {
      setSelectedSize(undefined);
      setSelectedColor(undefined);
    }
  }, [emblaApi, initialSlide, isOpen]);

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

  const handleAddToCart = () => {
    if (needsSizeSelection && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    if (needsColorSelection && !selectedColor) {
      toast.error("Please select a color before adding to cart.");
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white p-6 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative h-[60vh]">
            <div className="embla h-full overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex h-full">
                {(product.images || []).map((image, index) => (
                  <div key={index} className="embla__slide relative min-w-full">
                    <Image
                      src={getPublicImageUrl(image)}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 -translate-y-1/2"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-6 w-6 text-black bg-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2"
              onClick={scrollNext}
            >
              <ChevronRight className="h-6 w-6 text-black bg-white" />
            </Button>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-4 text-lg font-semibold">${product.price}</p>
              <p className="text-muted-foreground">{product.description}</p>

              <div className="mt-4 flex space-x-4">
                {product.gender && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Gender:</span>
                    <span>{product.gender}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Category:</span>
                    <span>{product.category}</span>
                  </div>
                )}
              </div>

              {needsSizeSelection && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Size *
                  </label>
                  <Select onValueChange={setSelectedSize} value={selectedSize}>
                    <SelectTrigger className="bg-white text-black">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      {product.available_sizes?.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsColorSelection && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Choose Color
                    </label>
                    {selectedColor && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: getColorStyle(selectedColor) }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {selectedColor}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {product.colors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full border-3 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-mint)] ${
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
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              getColorStyle(color) === '#FFFFFF' || ['#FFFFFF', '#EAB308', '#FBBF24'].includes(getColorStyle(color)) 
                                ? 'bg-gray-800' : 'bg-white'
                            }`}>
                              <svg 
                                className={`w-2.5 h-2.5 ${
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      Please select a color to continue
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleAddToCart}
                disabled={!!(needsSizeSelection && !selectedSize) || !!(needsColorSelection && !selectedColor)}
                className="bg-secondary hover:bg-deep flex-1 text-black hover:text-white"
              >
                {needsSizeSelection && !selectedSize ? (
                  "Select Size"
                ) : needsColorSelection && !selectedColor ? (
                  "Select Color"
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
