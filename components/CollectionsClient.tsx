"use client";

import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Local utility function to handle image URLs
function getPublicImageUrl(path: string): string {
  if (!path) return "https://jhxxuhisdypknlvhaklm.supabase.co/storage/v1/object/public/hyperwear-images/tee-shirt.webp";

  // If the path is already a full URL, return it directly
  if (path.startsWith("http")) {
    return path;
  }

  // If the path starts with a slash, it's a local public path
  if (path.startsWith("/")) {
    return path;
  }

  // Get Supabase URL with fallback - avoid process.env in function to prevent HMR issues
  const supabaseUrl = "https://jhxxuhisdypknlvhaklm.supabase.co"; // Using fallback to avoid HMR issues
  const storageUrl = `${supabaseUrl}/storage/v1/object/public/`;

  // If the path includes a slash, it's assumed to contain the bucket name
  if (path.includes("/")) {
    return `${storageUrl}${path}`;
  }

  // Otherwise, use the default 'product-images' bucket
  return `${storageUrl}product-images/${path}`;
}

interface Collection {
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  comingSoon?: boolean;
}

interface CollectionsClientProps {
  images: string[];
  collections: Collection[];
}

// Optimized collection card component with fixed dimensions
const CollectionCard = ({ collection, priority }: { collection: Collection; priority: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative transform overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
      {collection.comingSoon && (
        <Badge
          variant="secondary"
          className="bg-secondary text-primary absolute top-2 right-2 z-10"
        >
          Coming Soon
        </Badge>
      )}
      <div className="relative aspect-square w-full overflow-hidden rounded-md max-w-xs mx-auto p-4 mt-6">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-xl" />
        )}
        
        {/* Optimized image with fixed dimensions and circular shape */}
        <Image
          src={getPublicImageUrl(collection.image)}
          alt={collection.title}
          width={300}
          height={300}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className={`w-full h-full object-cover rounded-xl transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={priority ? 90 : 75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+cddKvPzjz2jN3Z"
        />
      </div>
      <div className="p-4 sm:p-6">
        <h2 className="font-display text-lg sm:text-xl font-bold text-gray-900 leading-tight">
          {collection.title}
        </h2>
        <p className="font-body mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
          {collection.description}
        </p>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
          {collection.comingSoon ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto cursor-not-allowed rounded-full font-semibold opacity-60 text-xs sm:text-sm touch-manipulation"
                disabled
              >
                View Collection
              </Button>
              <Button
                size="sm"
                className="w-full sm:w-auto bg-primary hover:bg-secondary cursor-not-allowed rounded-full font-semibold text-white opacity-60 hover:text-black text-xs sm:text-sm touch-manipulation"
                disabled
              >
                Shop Now
              </Button>
            </>
          ) : (
            <>
              <Link href={collection.category ? `/products?category=${collection.category}` : collection.link}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto rounded-full font-semibold text-xs sm:text-sm touch-manipulation hover:bg-gray-50 transition-colors"
                >
                  View Collection
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-primary hover:bg-secondary rounded-full font-semibold text-white hover:text-black text-xs sm:text-sm touch-manipulation transition-colors"
                >
                  Shop Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CollectionsClient = ({ images, collections }: CollectionsClientProps) => {
  const carouselImages = useMemo(() => images, [images]);
  const [shuffledImages, setShuffledImages] = useState<string[]>(images);
  const [isLoading, setIsLoading] = useState(true);

  // Optimized shuffle and load for mobile performance
  useEffect(() => {
    const shuffled = [...carouselImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    
    // Minimal loading delay for better mobile performance
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Further reduced to 100ms for mobile
    
    return () => clearTimeout(timer);
  }, [carouselImages]);

  if (isLoading || shuffledImages.length === 0) {
    return (
      <>
        {/* Faster loading skeleton */}
        <div className="relative my-12">
          <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 font-medium">Loading Collections...</div>
            </div>
          </div>
        </div>
        
        {/* Optimized loading skeleton with fixed aspect ratio */}
        <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl bg-white shadow-lg"
            >
              <div className="aspect-square w-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-xl max-w-xs mx-auto" />
              <div className="p-4 sm:p-6 space-y-3">
                <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="flex items-center justify-between pt-2 sm:pt-3">
                  <div className="h-8 sm:h-10 w-24 sm:w-32 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-full animate-pulse" />
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
      
      <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
        {collections.map((collection, index) => (
          <CollectionCard 
            key={collection.title} 
            collection={collection} 
            priority={index < 2} 
          />
        ))}
      </div>
    </>
  );
};

export default CollectionsClient; 