"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DynamicImageShowcaseProps {
  images: string[];
}

export function DynamicImageShowcase({ images }: DynamicImageShowcaseProps) {
  const [shuffledImages, setShuffledImages] = useState<string[]>(images);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Shuffle the original images after mounting
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, [images]);

  // Use original images array for SSR consistency
  const displayImages = mounted ? shuffledImages : images;

  return (
    <div className="w-full overflow-hidden py-6">
      {/* Single Row - Moving Left */}
      <div className="flex space-x-4">
        <motion.div
          initial={false}
          className="flex space-x-4 shrink-0"
          animate={{
            x: [0, -2000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 60,
              ease: "linear",
            },
          }}
        >
          {/* Create seamless loop by duplicating the display array */}
          {displayImages.concat(displayImages).concat(displayImages).map((image, index) => (
            <motion.div
              key={`${image}-${index}`}
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05, zIndex: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={image}
                  alt={`Community showcase ${index}`}
                  width={200}
                  height={250}
                  className="object-cover w-[200px] h-[250px] transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 