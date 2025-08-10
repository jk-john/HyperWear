"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HolographicTextProps {
  children: React.ReactNode;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export default function HolographicText({ 
  children, 
  className = "", 
  tag = "h1" 
}: HolographicTextProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    const Tag = tag;
    return <Tag className={className}>{children}</Tag>;
  }

  // Use h1 as default and cast appropriately
  const MotionTag = tag === "h1" ? motion.h1 : tag === "h2" ? motion.h2 : tag === "h3" ? motion.h3 : motion.h1;

  return (
    <div className="relative">
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 blur-3xl opacity-50"
        animate={{
          background: [
            "linear-gradient(45deg, #2DD4BF, #8B5CF6)",
            "linear-gradient(45deg, #8B5CF6, #3B82F6)",
            "linear-gradient(45deg, #3B82F6, #10B981)",
            "linear-gradient(45deg, #10B981, #2DD4BF)",
            "linear-gradient(45deg, #2DD4BF, #8B5CF6)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Main holographic text */}
      <MotionTag
        className={`relative ${className}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ 
          opacity: { duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
          backgroundPosition: {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{
          background: `
            linear-gradient(
              90deg,
              #2DD4BF 0%,
              #8B5CF6 25%,
              #3B82F6 50%,
              #10B981 75%,
              #2DD4BF 100%
            )
          `,
          backgroundSize: "400% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 20px rgba(45, 212, 191, 0.5)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.3))",
        }}
      >
        {children}
      </MotionTag>
      
      {/* Secondary layer for extra depth */}
      <MotionTag
        className={`absolute inset-0 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2, delay: 1 }}
        style={{
          background: `
            linear-gradient(
              45deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            )
          `,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transform: "translateX(2px) translateY(2px)",
        }}
      >
        {children}
      </MotionTag>
    </div>
  );
}