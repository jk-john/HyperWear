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
    product.category === "t-shirts" && product.available_sizes?.length > 0;
  const needsColorSelection =
    ["t-shirts", "caps"].includes(product.category) && product.colors?.length > 0;

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
      <DialogContent className="max-w-6xl h-[90vh] bg-white dark:bg-gray-900 border-0 p-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative bg-gray-50 dark:bg-gray-800">
            <div className="embla h-full overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex h-full">
                {(product.images || []).map((image, index) => (
                  <div key={index} className="embla__slide relative min-w-full">
                    <Image
                      src={getPublicImageUrl(image)}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className="object-contain p-8"
                      priority={index === initialSlide}
                    />
                  </div>
                ))}
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <>
                <Button onClick={scrollPrev} className="absolute top-1/2 left-4 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg dark:bg-gray-900/90 dark:hover:bg-gray-900">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button onClick={scrollNext} className="absolute top-1/2 right-4 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg dark:bg-gray-900/90 dark:hover:bg-gray-900">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-col h-full">
            <div className="p-8 pb-6 border-b border-gray-100 dark:border-gray-800">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.original_price}
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                {product.category && <div className="flex items-center gap-2"><span className="font-medium">Category:</span><span className="capitalize">{product.category}</span></div>}
                {product.gender && <div className="flex items-center gap-2"><span className="font-medium">Gender:</span><span className="capitalize">{product.gender}</span></div>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-8">
                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {needsSizeSelection && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">Size</label>
                    <Select onValueChange={setSelectedSize} value={selectedSize}>
                      <SelectTrigger className="w-full h-12 text-base bg-white text-black">
                        <SelectValue placeholder="Choose your size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.available_sizes?.map((size) => (
                          <SelectItem key={size} value={size} className="text-base py-3 bg-white text-black">{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {needsColorSelection && (
                  <div>
                    <label className="text-lg font-semibold text-gray-900 dark:text-white mb-4 block">Color</label>
                    <div className="flex gap-3">
                      {product.colors?.map((color) => {
                        const isSelected = selectedColor === color;
                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`relative w-10 h-10 rounded-full border-2 transition ring-offset-2 focus:outline-none focus:ring-2 ring-gray-900 dark:ring-gray-300 ${
                              isSelected ? 'ring-4 ring-offset-2 scale-105 shadow-lg' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: getColorStyle(color) }}
                            title={color}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-4 h-4 rounded-full ${['#ffffff', '#fefefe'].includes(getColorStyle(color).toLowerCase()) ? 'bg-gray-800' : 'bg-white'}`}>
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {!selectedColor && <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Please select a color to continue</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 p-8">
              <div className="flex gap-4">
                <Button variant="outline" onClick={onClose} className="flex-1 h-12 text-base font-medium">
                  Continue Shopping
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={(needsSizeSelection && !selectedSize) || (needsColorSelection && !selectedColor)}
                  className="flex-2 h-12 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50"
                >
                  {needsSizeSelection && !selectedSize ? "Please Select Size" : needsColorSelection && !selectedColor ? "Please Select Color" : "Add to Cart"}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mt-6">
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