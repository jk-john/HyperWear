import { getPublicImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";
import { Product } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const needsSizeSelection =
    product.category === "t-shirts" && product.available_sizes && product.available_sizes.length > 0;
  const needsColorSelection =
    product.category && ["t-shirts", "caps"].includes(product.category) && product.colors && product.colors.length > 0;

  useEffect(() => {
    emblaApi?.reInit();
    emblaApi?.scrollTo(initialSlide, true);
    if (isOpen) {
      setSelectedSize(undefined);
      setSelectedColor(undefined);
    }
  }, [emblaApi, initialSlide, isOpen]);

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      white: "#FFFFFF",
      black: "#000000",
      red: "#DC2626",
      blue: "#2563EB",
      green: "#16A34A",
      yellow: "#EAB308",
      purple: "#9333EA",
      pink: "#EC4899",
      gray: "#6B7280",
      grey: "#6B7280",
      navy: "#1E3A8A",
      brown: "#A3A3A3",
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

  const hasDiscount = product.original_price && product.original_price > product.price;
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl h-auto max-h-[calc(100vh-32px)] bg-white dark:bg-gray-900 border-0 p-0 overflow-hidden [&>button.absolute.top-4.right-4]:hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <div className="flex flex-col lg:grid lg:grid-cols-2 h-full max-h-[calc(100vh-32px)]">
          {/* Image Section */}
          <div className="relative bg-gray-50 dark:bg-gray-800 h-64 sm:h-80 lg:h-full">
            <div className="embla h-full overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex h-full">
                {(product.images || []).map((image, index) => (
                  <div key={index} className="embla__slide relative min-w-full">
                    <Image
                      src={getPublicImageUrl(image)}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className="object-contain p-4 sm:p-6 lg:p-8"
                      priority={index === initialSlide}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <Button 
                  onClick={scrollPrev} 
                  className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 hover:bg-white shadow-lg dark:bg-gray-900/90 dark:hover:bg-gray-900 touch-manipulation"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button 
                  onClick={scrollNext} 
                  className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 hover:bg-white shadow-lg dark:bg-gray-900/90 dark:hover:bg-gray-900 touch-manipulation"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 sm:p-6 pb-4 sm:pb-6 border-b border-gray-100 dark:border-gray-800">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                {product.name}
              </h1>
              
              {/* Pricing */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                {hasDiscount && product.original_price && (
                  <>
                    <span className="text-base sm:text-lg text-gray-500 line-through">
                      ${product.original_price}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {product.category && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Category:</span>
                    <span className="capitalize">{product.category}</span>
                  </div>
                )}
                {product.gender && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Gender:</span>
                    <span className="capitalize">{product.gender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      Description
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Size Selection */}
                {needsSizeSelection && (
                  <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      Size
                    </label>
                    <Select onValueChange={setSelectedSize} value={selectedSize}>
                      <SelectTrigger className="w-full h-12 sm:h-14 text-sm sm:text-base bg-white text-black touch-manipulation">
                        <SelectValue placeholder="Choose your size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.available_sizes?.map((size) => (
                          <SelectItem key={size} value={size} className="text-sm sm:text-base py-3 bg-white text-black touch-manipulation">
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Color Selection */}
                {needsColorSelection && (
                  <div>
                    <label className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 block">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {product.colors?.map((color) => {
                        const isSelected = selectedColor === color;
                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 transition-all duration-200 ring-offset-2 focus:outline-none focus:ring-2 ring-gray-900 dark:ring-gray-300 touch-manipulation ${
                              isSelected ? 'ring-4 ring-offset-2 scale-105 shadow-lg' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: getColorStyle(color) }}
                            title={color}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${['#ffffff', '#fefefe'].includes(getColorStyle(color).toLowerCase()) ? 'bg-gray-800' : 'bg-white'}`}>
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {!selectedColor && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-3">
                        Please select a color to continue
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="w-full sm:flex-1 h-12 sm:h-14 text-sm sm:text-base font-medium touch-manipulation"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={Boolean((needsSizeSelection && !selectedSize) || (needsColorSelection && !selectedColor))}
                  className="w-full sm:flex-2 h-12 sm:h-14 text-sm sm:text-base font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 touch-manipulation"
                >
                  {needsSizeSelection && !selectedSize ? "Please Select Size" : needsColorSelection && !selectedColor ? "Please Select Color" : "Add to Cart"}
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4 sm:mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free shipping on orders $60+</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};