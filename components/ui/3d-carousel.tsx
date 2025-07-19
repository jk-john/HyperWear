"use client";

import {
  animate,
  Easing,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react";

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

const duration = 0.15;
const transition = {
  duration,
  ease: [0.32, 0.72, 0, 1] as Easing,
};

const Carousel = memo(function Carousel({ cards }: { cards: string[] }) {
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)");
  const cylinderWidth = isScreenSizeSm ? 1800 : 2800;
  const faceCount = cards.length;
  const faceWidth = cylinderWidth / faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  const rotation = useMotionValue(0);

  useEffect(() => {
    const controls = animate(rotation, 360, {
      duration: 40,
      ease: "linear",
      repeat: Infinity,
    });
    return controls.stop;
  }, [rotation]);

  const transform = useTransform(
    rotation,
    (value) => `rotate3d(0, 1, 0, ${value}deg)`,
  );

  return (
    <div
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
            }}
          >
            <motion.img
              src={imgUrl}
              alt={`collection_image_${i}`}
              layoutId={`img-${imgUrl}`}
              className="pointer-events-none aspect-square w-full rounded-xl object-cover"
              initial={{ filter: "blur(4px)" }}
              layout="position"
              animate={{ filter: "blur(0px)" }}
              transition={transition}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

function ThreeDPhotoCarousel({ images }: { images: string[] }) {
  const cards = useMemo(() => images, [images]);

  return (
    <motion.div layout className="relative my-12">
      <div className="relative h-[500px] w-full overflow-hidden">
        <Carousel cards={cards} />
      </div>
    </motion.div>
  );
}

export { ThreeDPhotoCarousel };
