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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const needsSizeSelection =
    (product.category === "T-shirts" || product.category === "Shorts") &&
    product.available_sizes &&
    product.available_sizes.length > 0;

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(initialSlide, true);
    }
    // Reset selected size when the modal is opened or the product changes
    if (isOpen) {
      setSelectedSize(undefined);
    }
  }, [emblaApi, initialSlide, isOpen]);

  const handleAddToCart = () => {
    if (needsSizeSelection && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    addToCart(product, selectedSize);
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
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2"
              onClick={scrollNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-4 text-lg font-semibold">${product.price}</p>
              <p className="text-muted-foreground">{product.description}</p>
              {needsSizeSelection && (
                <div className="mt-4">
                  <Select onValueChange={setSelectedSize} value={selectedSize}>
                    <SelectTrigger>
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
            </div>
            <div className="mt-6 flex gap-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleAddToCart}
                disabled={!!(needsSizeSelection && !selectedSize)}
                className="bg-secondary hover:bg-deep flex-1 text-black hover:text-white"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
