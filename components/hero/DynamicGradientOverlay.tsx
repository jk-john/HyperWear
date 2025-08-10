"use client";

import { motion } from "framer-motion";

export default function DynamicGradientOverlay() {
  return (
    <>
      {/* Primary gradient overlay */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(15, 57, 51, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(7, 39, 35, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, rgba(15, 57, 51, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, rgba(15, 57, 51, 0.6), rgba(7, 39, 35, 0.3))
          `,
        }}
      />
      
      {/* Animated secondary overlay */}
      <motion.div
        className="absolute inset-0 z-10"
        animate={{
          background: [
            `radial-gradient(circle at 30% 40%, rgba(151, 252, 228, 0.2) 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 60%, rgba(151, 252, 228, 0.2) 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 40%, rgba(151, 252, 228, 0.2) 0%, transparent 60%)`,
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)`,
        }}
      />
    </>
  );
}