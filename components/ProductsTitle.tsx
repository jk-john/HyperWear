"use client";

import { type ClassValue, clsx } from "clsx";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

// cn utility function - implementation included as it's a custom utility
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface StylishTitleProps {
  title?: string;
  animatedWords?: string[];
  showSparkles?: boolean;
  sparklesCount?: number;
  sparkleColors?: {
    first: string;
    second: string;
  };
  className?: string;
  titleClassName?: string;
  animatedTextClassName?: string;
  wordInterval?: number;
}

const StylishTitle: React.FC<StylishTitleProps> = ({
  title = "Stay Liquid, Wear Hyper.",
  animatedWords = ["Community", "First", "Hyper", "Liquid | Wear"],
  showSparkles = true,
  sparklesCount = 8,
  sparkleColors = {
    first: "jungle",
    second: "mint",
  },
  className,
  titleClassName,
  animatedTextClassName,
  wordInterval = 3000,
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  // Sparkles effect
  useEffect(() => {
    if (!showSparkles) return;

    const generateStar = (): Sparkle => {
      const starX = `${Math.random() * 100}%`;
      const starY = `${Math.random() * 100}%`;
      // Use sparkleColors from props, which now default to theme variables
      const color =
        Math.random() > 0.5 ? sparkleColors.first : sparkleColors.second;
      const delay = Math.random() * 2;
      const scale = Math.random() * 1 + 0.3;
      const lifespan = Math.random() * 10 + 5;
      const id = `${starX}-${starY}-${Date.now()}`;
      return { id, x: starX, y: starY, color, delay, scale, lifespan };
    };

    const initializeStars = () => {
      const newSparkles = Array.from({ length: sparklesCount }, generateStar);
      setSparkles(newSparkles);
    };

    const updateStars = () => {
      setSparkles((currentSparkles) =>
        currentSparkles.map((star) => {
          if (star.lifespan <= 0) {
            return generateStar();
          } else {
            return { ...star, lifespan: star.lifespan - 0.1 };
          }
        }),
      );
    };

    initializeStars();
    const interval = setInterval(updateStars, 100);

    return () => clearInterval(interval);
  }, [showSparkles, sparkleColors.first, sparkleColors.second, sparklesCount]);

  // Animated text cycling
  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    // Only cycle if there are animated words
    if (animatedWords.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % animatedWords.length);
    }, wordInterval);

    return () => clearInterval(timer);
  }, [wordInterval, animatedWords.length]);

  const containerVariants: Variants = {
    hidden: {
      y: -20,
      opacity: 0,
      filter: "blur(8px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className={cn("space-y-4 text-center", className)}>
      <div className="relative">
        {showSparkles && (
          <div className="pointer-events-none absolute inset-0">
            {sparkles.map((sparkle) => (
              <Sparkle key={sparkle.id} {...sparkle} />
            ))}
          </div>
        )}

        <h1
          className={cn(
            "bg-clip-text text-4xl font-bold text-transparent md:text-6xl lg:text-7xl",
            "font-display", // Apply font-display from theme
            "from-forest via-forest/80 to-forest bg-gradient-to-r", // Updated gradient using theme colors
            titleClassName,
          )}
        >
          {title}{" "}
          {animatedWords.length > 0 && ( // Only render animated word section if words exist
            <span className="relative inline-block">
              {/* Hidden measurement div */}
              <div
                ref={measureRef}
                aria-hidden="true"
                className="pointer-events-none absolute opacity-0"
                style={{ visibility: "hidden" }}
              >
                {animatedWords.map((word, i) => (
                  <span
                    key={i}
                    className={cn(
                      "bg-clip-text font-bold text-transparent",
                      "font-display", // Apply font-display from theme
                      "from-mint via-secondary to-mint bg-gradient-to-r", // Updated gradient using theme colors
                      animatedTextClassName,
                    )}
                  >
                    {word}
                  </span>
                ))}
              </div>

              {/* Visible animated word */}
              <motion.span
                className="relative inline-block"
                animate={{
                  width,
                  transition: {
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 1.2,
                  },
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={currentIndex}
                    className={cn(
                      "inline-block bg-clip-text font-bold text-transparent",
                      "font-display", // Apply font-display from theme
                      "from-mint via-secondary to-mint bg-gradient-to-r", // Updated gradient using theme colors
                      animatedTextClassName,
                    )}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {animatedWords[currentIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </span>
          )}
        </h1>
      </div>
    </div>
  );
};

// Sparkle component implementation (maintained as is)
const Sparkle: React.FC<Sparkle> = ({ id, x, y, color, delay, scale }) => {
  return (
    <motion.svg
      key={id}
      className="pointer-events-none absolute z-20"
      initial={{ opacity: 0, left: x, top: y }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, scale, 0],
        rotate: [75, 120, 150],
      }}
      transition={{ duration: 0.8, repeat: Infinity, delay }}
      width="21"
      height="21"
      viewBox="0 0 21 21"
    >
      <path
        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
        fill={color}
      />
    </motion.svg>
  );
};

function StylishTitleDemo() {
  return (
    <div className="mb-12 flex items-center justify-center p-8">
      <StylishTitle />
    </div>
  );
}

export default StylishTitleDemo;
