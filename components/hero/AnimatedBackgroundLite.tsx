"use client";

import { motion } from "framer-motion";

export default function AnimatedBackgroundLite() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Simplified gradient animation - fewer layers, less GPU intensive */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(26, 95, 95, 0.3) 0%, rgba(45, 74, 74, 0.3) 50%, rgba(15, 52, 96, 0.3) 100%)"
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Single optimized overlay pattern */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 30% 40%, rgba(151, 252, 228, 0.05) 0%, transparent 60%)"
        }}
        animate={{
          background: [
            "radial-gradient(circle at 30% 40%, rgba(151, 252, 228, 0.05) 0%, transparent 60%)",
            "radial-gradient(circle at 70% 60%, rgba(151, 252, 228, 0.05) 0%, transparent 60%)",
            "radial-gradient(circle at 30% 40%, rgba(151, 252, 228, 0.05) 0%, transparent 60%)"
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Reduced floating orbs - only 2 instead of 3+ */}
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, rgba(151, 252, 228, 0.2) 0%, transparent 70%)",
          filter: "blur(30px)", // Reduced blur radius for better performance
          top: "15%",
          left: "10%"
        }}
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute w-60 h-60 rounded-full opacity-4"
        style={{
          background: "radial-gradient(circle, rgba(174, 144, 227, 0.15) 0%, transparent 70%)",
          filter: "blur(25px)",
          bottom: "20%",
          right: "15%"
        }}
        animate={{
          x: [40, -40, 40],
          y: [20, -20, 20],
          scale: [0.9, 1.2, 0.9]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
    </div>
  );
}