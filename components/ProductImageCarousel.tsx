"use client";

import { getPublicImageUrl } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  onImageClick: (index: number) => void;
}

export const ProductImageCarousel = ({
  images,
  productName,
  onImageClick,
}: ProductImageCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 2000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleImageError = useCallback((index: number, src: string) => {
    console.warn(`Image failed to load at index ${index}:`, src);
    setBrokenImages(prev => new Set(prev.add(index)));
  }, []);

  const hasImages = images && images.length > 0;
  const showCarousel = hasImages && images.length > 1;

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-xl">
      {showCarousel ? (
        <>
          <div
            className="embla h-full w-full cursor-pointer"
            ref={emblaRef}
            onClick={() => onImageClick(selectedIndex)}
          >
            <div className="embla__container flex h-full">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="embla__slide relative h-full w-full flex-[0_0_100%]"
                >
                  <Image
                    src={brokenImages.has(index) ? "/products-img/fallback.webp" : getPublicImageUrl(image)}
                    alt={`${productName} - Web3 clothing by HyperWear`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => handleImageError(index, getPublicImageUrl(image))}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* In-Card Navigation */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            className="absolute top-1/2 left-2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/20 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/20 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform items-center justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 w-2 rounded-full ${
                  index === selectedIndex ? "bg-white" : "bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div
          className="relative h-full w-full cursor-pointer"
          onClick={() => onImageClick(0)}
        >
          <Image
            src={brokenImages.has(0) ? "/products-img/fallback.webp" : getPublicImageUrl(images?.[0])}
            alt={
              hasImages
                ? `${productName} - Web3 clothing by HyperWear`
                : "Placeholder image for HyperWear product"
            }
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => handleImageError(0, getPublicImageUrl(images?.[0]))}
          />
        </div>
      )}
    </div>
  );
};
