"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform
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
  
  // State to track which images should be loaded
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set([0, 1, 2])); // Start with first 3 images

  // Progressive loading of images based on rotation
  useEffect(() => {
    const unsubscribe = rotation.on("change", (latest) => {
      const normalizedRotation = ((latest % 360) + 360) % 360;
      const currentIndex = Math.floor((normalizedRotation / 360) * faceCount);
      
      // Load current image and 2 neighbors
      const newVisibleImages = new Set<number>();
      for (let i = -2; i <= 2; i++) {
        const index = (currentIndex + i + faceCount) % faceCount;
        newVisibleImages.add(index);
      }
      
      setVisibleImages(prev => {
        // Only update if there are new images to load
        const hasNewImages = Array.from(newVisibleImages).some(index => !prev.has(index));
        if (hasNewImages) {
          return new Set([...prev, ...newVisibleImages]);
        }
        return prev;
      });
    });

    return unsubscribe;
  }, [rotation, faceCount]);

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
              priority={i < 3} // Prioritize first 3 images
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
