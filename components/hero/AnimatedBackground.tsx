"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main gradient background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-jungle via-forest to-primary"
        animate={{
          background: [
            "linear-gradient(135deg, #1a5f5f 0%, #2d4a4a 50%, #0f3460 100%)",
            "linear-gradient(135deg, #2d4a4a 0%, #1a5f5f 50%, #0f3460 100%)",
            "linear-gradient(135deg, #0f3460 0%, #2d4a4a 50%, #1a5f5f 100%)",
            "linear-gradient(135deg, #1a5f5f 0%, #2d4a4a 50%, #0f3460 100%)"
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated overlay patterns */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 20% 30%, rgba(151, 252, 228, 0.1) 0%, transparent 50%)"
        }}
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(151, 252, 228, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(151, 252, 228, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(151, 252, 228, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(151, 252, 228, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 70% 20%, rgba(174, 144, 227, 0.08) 0%, transparent 40%)"
        }}
        animate={{
          background: [
            "radial-gradient(circle at 70% 20%, rgba(174, 144, 227, 0.08) 0%, transparent 40%)",
            "radial-gradient(circle at 30% 80%, rgba(174, 144, 227, 0.08) 0%, transparent 40%)",
            "radial-gradient(circle at 90% 60%, rgba(174, 144, 227, 0.08) 0%, transparent 40%)",
            "radial-gradient(circle at 70% 20%, rgba(174, 144, 227, 0.08) 0%, transparent 40%)"
          ]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(151, 252, 228, 0.4) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        initial={{ top: "20%", left: "10%" }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-8"
        style={{
          background: "radial-gradient(circle, rgba(174, 144, 227, 0.3) 0%, transparent 70%)",
          filter: "blur(50px)"
        }}
        animate={{
          x: [80, -80, 80],
          y: [60, -60, 60],
          scale: [1.1, 0.9, 1.1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        initial={{ bottom: "30%", right: "15%" }}
      />

      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-6"
        style={{
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%)",
          filter: "blur(30px)"
        }}
        animate={{
          x: [-60, 60, -60],
          y: [-40, 40, -40],
          scale: [0.8, 1.3, 0.8]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }}
        initial={{ top: "60%", left: "60%" }}
      />
    </div>
  );
}