"use client";

import { getPublicImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";
import { Product } from "@/types";
import { createClient } from "@/utils/supabase/client";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/Button";
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
  const [variants, setVariants] = useState<{ size: string }[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const showSizeSelector =
    product.category && ["t-shirt", "shorts"].includes(product.category);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(initialSlide, true);
    }

    const fetchVariants = async () => {
      if (showSizeSelector) {
        // Reset state when modal opens or product changes
        setSelectedSize(undefined);
        setVariants([]);

        const supabase = createClient();
        const { data, error } = await supabase
          .from("variants")
          .select("size")
          .eq("product_id", product.id);

        if (error) {
          console.error("Error fetching variants:", error);
        } else if (data) {
          setVariants(data);
        }
      }
    };

    if (isOpen) {
      fetchVariants();
    }
  }, [emblaApi, initialSlide, isOpen, product.id, showSizeSelector]);

  const handleAddToCart = () => {
    if (showSizeSelector && !selectedSize) {
      return; // Don't add to cart if size is required but not selected
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
          <div className="relative">
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="embla__slide relative h-[60vh] min-w-full"
                  >
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
              {showSizeSelector && (
                <div className="mt-4">
                  <Select onValueChange={setSelectedSize} value={selectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {variants.map((variant) => (
                        <SelectItem key={variant.size} value={variant.size}>
                          {variant.size}
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
                disabled={Boolean(showSizeSelector && !selectedSize)}
                className="flex-1"
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
