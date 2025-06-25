"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { getPublicImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ProductImageModal } from "./ProductImageModal";
import { Button } from "./ui/Button";

interface ProductCardProps {
  product: Product;
}

const ProductImageCarousel = ({
  images,
  productName,
  onImageClick,
}: {
  images: string[];
  productName: string;
  onImageClick: (index: number) => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 2000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
                    src={getPublicImageUrl(image)}
                    alt={`${productName} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            src={getPublicImageUrl(images?.[0])}
            alt={hasImages ? `${productName} image 1` : "Placeholder image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
    </div>
  );
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ProductImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={product}
        initialSlide={initialSlide}
      />
      <CardContainer className="w-full max-w-[350px] min-w-[300px]">
        <CardBody className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-xl dark:bg-zinc-900">
          <CardItem translateZ="60" className="relative h-64 w-full">
            <ProductImageCarousel
              images={product.images}
              productName={product.name}
              onImageClick={handleImageClick}
            />
          </CardItem>

          <div className="mt-4 flex flex-1 flex-col justify-between space-y-2">
            <CardItem translateZ="20">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {product.name}
              </h3>
            </CardItem>
            <CardItem translateZ="20">
              <p className="text-base font-medium text-zinc-900 dark:text-white">
                ${product.price}
              </p>
            </CardItem>
            <CardItem translateZ="20" className="w-full">
              <Button
                className="bg-secondary hover:bg-jungle hover:shadow-mint/40 w-full text-black hover:text-white"
                onClick={() => addToCart(product)}
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
