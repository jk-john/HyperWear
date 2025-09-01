"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FloatingHyperLiquidElements() {

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.2 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.5, 0.2],
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Large HYPE logo - center background */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ animationDelay: '0s' }}
      >
        <Image
          src="/HYPE.svg"
          alt="HYPE"
          width={400}
          height={400}
          className="opacity-3 "
          priority
        />
      </motion.div>
      
    </div>
  );
}