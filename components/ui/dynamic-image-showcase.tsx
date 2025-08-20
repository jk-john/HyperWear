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
  
  // Calculate the width needed for smooth scrolling
  const imageWidth = 200; // Width of each image
  const imageSpacing = 16; // Space between images (space-x-4 = 1rem = 16px)
  const totalImageWidth = imageWidth + imageSpacing;
  const singleSetWidth = images.length * totalImageWidth;

  useEffect(() => {
    setMounted(true);
    // Shuffle the original images after mounting
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, [images]);

  // Use original images array for SSR consistency
  const displayImages = mounted ? shuffledImages : images;
  
  // Create enough duplicates for seamless infinite scroll
  const duplicatedImages = [...displayImages, ...displayImages, ...displayImages];

  return (
    <div className="w-full overflow-hidden py-6">
      <motion.div
        className="flex space-x-4 will-change-transform"
        animate={{
          x: [0, -singleSetWidth],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25, // Fixed duration for consistent speed
            ease: "linear",
          },
        }}
        style={{
          width: `${singleSetWidth * 3}px`, // Ensure container is wide enough for all duplicates
        }}
      >
        {duplicatedImages.map((image, index) => (
          <motion.div
            key={`${image}-${index}`}
            className="relative group cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ duration: 0.3 }}
            style={{ width: `${imageWidth}px` }}
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src={image}
                alt={`Community showcase ${index}`}
                width={200}
                height={250}
                className="object-cover w-[200px] h-[250px] transition-transform duration-700 group-hover:scale-110"
                priority={index < 6} // Prioritize first few images for better loading
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 