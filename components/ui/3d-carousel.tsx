"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  const handleChange = () => {
    setMatches(getMatches(query));
  };

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();

    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

// Hook for intersection observer to control animation
function useIntersectionObserver(
  elementRef: React.RefObject<HTMLDivElement | null>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
}

// Optimized image component with lazy loading
const CarouselImage = memo(function CarouselImage({ 
  src, 
  alt, 
  isVisible,
  priority = false 
}: { 
  src: string; 
  alt: string; 
  isVisible: boolean;
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-200">
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-xl" />
      )}
      
      {/* Optimized image with Next.js */}
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 300px, 400px"
          className={`object-cover rounded-xl transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          priority={priority}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+cddKvPzjz2jN3Z"
        />
      )}
    </div>
  );
});

const Carousel = memo(function Carousel({ cards }: { cards: string[] }) {
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)");
  const cylinderWidth = isScreenSizeSm ? 1800 : 2800;
  const faceCount = cards.length;
  const faceWidth = cylinderWidth / faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  const rotation = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 });
  
  // More aggressive loading strategy for production
  const [visibleImages, setVisibleImages] = useState<Set<number>>(() => {
    // Start with more images for better UX - load first half immediately
    const initialCount = Math.min(Math.ceil(faceCount / 2), 7);
    return new Set(Array.from({ length: initialCount }, (_, i) => i));
  });

  // Aggressive progressive loading - load remaining images quickly
  useEffect(() => {
    // Load remaining images in batches after initial load
    const loadRemainingImages = () => {
      const totalImages = cards.length;
      const currentlyLoaded = visibleImages.size;
      
      if (currentlyLoaded < totalImages) {
        // Load next batch of images (3-4 at a time)
        const batchSize = 4;
        const nextBatch = new Set(visibleImages);
        
        for (let i = currentlyLoaded; i < Math.min(currentlyLoaded + batchSize, totalImages); i++) {
          nextBatch.add(i);
        }
        
        setVisibleImages(nextBatch);
        
        // Continue loading if there are more images
        if (nextBatch.size < totalImages) {
          setTimeout(loadRemainingImages, 500); // Load next batch after 500ms
        }
      }
    };

    // Start loading remaining images after a short delay
    const timeoutId = setTimeout(loadRemainingImages, 1000);
    return () => clearTimeout(timeoutId);
  }, [cards.length, visibleImages.size]);

  // Fallback: ensure all images are loaded within 4 seconds maximum
  useEffect(() => {
    const forceLoadAll = setTimeout(() => {
      const allImages = new Set(Array.from({ length: cards.length }, (_, i) => i));
      setVisibleImages(allImages);
    }, 4000); // Force load all after 4 seconds

    return () => clearTimeout(forceLoadAll);
  }, [cards.length]);

  // Enhanced rotation-based loading for immediate neighbors
  useEffect(() => {
    const unsubscribe = rotation.on("change", (latest) => {
      const normalizedRotation = ((latest % 360) + 360) % 360;
      const currentIndex = Math.floor((normalizedRotation / 360) * faceCount);
      
      // Always ensure current view and immediate neighbors are loaded
      const immediateNeighbors = new Set(visibleImages);
      for (let i = -3; i <= 3; i++) {
        const index = (currentIndex + i + faceCount) % faceCount;
        immediateNeighbors.add(index);
      }
      
      setVisibleImages(immediateNeighbors);
    });

    return unsubscribe;
  }, [rotation, faceCount, visibleImages]);

  // Control animation based on visibility
  useEffect(() => {
    if (isVisible) {
      const controls = animate(rotation, 360, {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
      });
      return controls.stop;
    }
  }, [isVisible, rotation]);

  const transform = useTransform(
    rotation,
    (value) => `rotate3d(0, 1, 0, ${value}deg)`,
  );

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center justify-center"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <motion.div
        className="relative flex h-full origin-center justify-center"
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {cards.map((imgUrl, i) => (
          <motion.div
            key={`key-${imgUrl}-${i}`}
            className="absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${
                i * (360 / faceCount)
              }deg) translateZ(${radius}px)`,
              willChange: "transform",
            }}
          >
            <CarouselImage
              src={imgUrl}
              alt={`Collection image ${i + 1}`}
              isVisible={visibleImages.has(i)}
              priority={i < 4} // Higher priority for first 4 images
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

function ThreeDPhotoCarousel({ images }: { images: string[] }) {
  const cards = useMemo(() => images, [images]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Slight delay to ensure component is mounted
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <motion.div layout className="relative my-12">
        <div className="relative h-[500px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 font-medium">Loading Collection Images...</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="relative my-12">
      <div className="relative h-[500px] w-full overflow-hidden">
        <Carousel cards={cards} />
      </div>
    </motion.div>
  );
}

export { ThreeDPhotoCarousel };
