"use client";

import { motion } from "framer-motion";
import { VelocityScroll } from "../ui/scroll-based-velocity";

export default function MotionEnhancements() {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {/* Animated title overlay - enhances the static title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          marginTop: "-120px", // Adjust to align with static title
          width: "100%",
          textAlign: "center"
        }}
      >
        <div className="h-20 w-full overflow-hidden sm:h-28 md:h-36">
          <VelocityScroll
            tag="h1"
            defaultVelocity={1} // Reduced velocity for smoother performance
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl opacity-80"
          >
            The Place To House All Hyperliquid Fans.
          </VelocityScroll>
        </div>
      </motion.div>

      {/* Animated subtitle enhancements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ marginTop: "20px", width: "100%", maxWidth: "64rem", padding: "0 1rem" }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.span 
            className="text-white font-semibold opacity-90"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Crypto was fragmented
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="opacity-90"
          >
            back then but{" "}
          </motion.span>
          <motion.span 
            className="text-white font-bold text-lg sm:text-xl md:text-2xl opacity-95"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            HyperLiquid
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="opacity-90"
          >
            changed that. For the first time, wear the movement that{" "}
          </motion.span>
          <motion.span 
            className="text-white font-semibold opacity-95"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            unites projects, creators, and assets
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2 }}
            className="opacity-90"
          >
            under one seamless ecosystem.
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Button hover enhancements */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        style={{ marginTop: "160px" }}
      >
        <div className="flex w-full flex-col items-center justify-center gap-6 sm:w-auto sm:flex-row">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="opacity-0" // Hidden since buttons are already visible in skeleton
          >
            {/* Placeholder for enhanced button interactions */}
          </motion.div>
        </div>
      </motion.div>

      {/* Additional floating animation elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-1 h-1 bg-mint rounded-full"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-10 w-1.5 h-1.5 bg-light rounded-full"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          delay: 1.5
        }}
      />

      {/* Subtle parallax floating dots */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-secondary rounded-full opacity-40"
        animate={{
          x: [0, 10, 0],
          y: [0, -15, 0],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: 2
        }}
      />
    </div>
  );
}