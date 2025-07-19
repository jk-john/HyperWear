"use client";

import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface Collection {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface CollectionsClientProps {
  images: string[];
  collections: Collection[];
}

// Optimized collection card component
const CollectionCard = ({ collection, priority }: { collection: Collection; priority: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative transform overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <Badge
        variant="secondary"
        className="bg-secondary text-primary absolute top-2 right-2 z-10"
      >
        Coming Soon
      </Badge>
      <div className="relative h-60 w-full overflow-hidden">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        
        {/* Optimized image */}
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          priority={priority}
          quality={85}
        />
      </div>
      <div className="p-6">
        <h2 className="font-display text-xl font-bold text-gray-900">
          {collection.title}
        </h2>
        <p className="font-body mt-2 text-gray-600">
          {collection.description}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            className="cursor-not-allowed rounded-full font-semibold opacity-60"
            disabled
          >
            View Collection
          </Button>
          <Button
            className="bg-primary hover:bg-secondary cursor-not-allowed rounded-full font-semibold text-white opacity-60 hover:text-black"
            disabled
          >
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const CollectionsClient = ({ images, collections }: CollectionsClientProps) => {
  const carouselImages = useMemo(() => images, [images]);
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Shuffle images only once on mount
  useEffect(() => {
    const shuffled = [...carouselImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    setIsLoading(false);
  }, [carouselImages]);

  if (isLoading || shuffledImages.length === 0) {
    return (
      <>
        {/* Loading skeleton for carousel */}
        <div className="relative my-12">
          <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 font-medium">Loading Collections...</div>
            </div>
          </div>
        </div>
        {/* Loading skeleton for grid */}
        <div className="grid gap-16 lg:grid-cols-3 lg:gap-x-12">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl bg-white shadow-lg"
            >
              <div className="h-60 w-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="flex items-center justify-between">
                  <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <ThreeDPhotoCarousel images={shuffledImages} />
      
      <div className="grid gap-16 lg:grid-cols-3 lg:gap-x-12">
        {collections.map((collection, index) => (
          <CollectionCard key={collection.title} collection={collection} priority={index < 3} />
        ))}
      </div>
    </>
  );
};

export default CollectionsClient; 