"use client";

import { motion } from "framer-motion";

interface GlassmorphicContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassmorphicContainer({ 
  children, 
  className = "",
  delay = 0 
}: GlassmorphicContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: delay + 1.5,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={`
        relative backdrop-blur-md bg-white/5 border border-white/10
        rounded-2xl p-6 shadow-2xl
        before:absolute before:inset-0 before:rounded-2xl
        before:bg-gradient-to-br before:from-white/5 before:to-transparent
        before:pointer-events-none
        ${className}
      `}
      style={{
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.05)
        `,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-50"
        animate={{
          background: [
            "linear-gradient(45deg, transparent, rgba(151, 252, 228, 0.1), transparent)",
            "linear-gradient(135deg, transparent, rgba(176, 197, 193, 0.1), transparent)",
            "linear-gradient(225deg, transparent, rgba(51, 153, 140, 0.1), transparent)",
            "linear-gradient(315deg, transparent, rgba(219, 251, 246, 0.1), transparent)",
            "linear-gradient(45deg, transparent, rgba(151, 252, 228, 0.1), transparent)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}