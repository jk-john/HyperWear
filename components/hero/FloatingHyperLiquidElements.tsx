"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FloatingHyperLiquidElements() {
  const floatingVariants = {
    initial: { y: 0, rotate: 0, opacity: 0.3 },
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.2 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
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
        style={{ animationDelay: '0s' }}
      >
        <Image
          src="/HYPE.svg"
          alt="HYPE"
          width={400}
          height={400}
          className="opacity-5 rotate-12"
          priority
        />
      </motion.div>

      {/* Floating HYPE logos - smaller versions */}
      <motion.div
        className="absolute top-20 left-16"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '0s' }}
      >
        <Image
          src="/HYPE.svg"
          alt="HYPE"
          width={60}
          height={60}
          className="opacity-30 rotate-12"
        />
      </motion.div>

      <motion.div
        className="absolute top-32 right-20"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '1.5s' }}
      >
        <Image
          src="/HYPE.svg"
          alt="HYPE"
          width={80}
          height={80}
          className="opacity-25 -rotate-6"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-12"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '3s' }}
      >
        <Image
          src="/HYPE.svg"
          alt="HYPE"
          width={70}
          height={70}
          className="opacity-20 rotate-45"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-16"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '2s' }}
      >
        <Image
          src="/HYPE.svg"
          alt="HYPE"
          width={50}
          height={50}
          className="opacity-35 -rotate-12"
        />
      </motion.div>

      {/* HyperWear logo floating elements */}
      <motion.div
        className="absolute top-1/3 left-8"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '1s' }}
      >
        <Image
          src="/hyperwear.png"
          alt="HyperWear"
          width={40}
          height={40}
          className="opacity-20 rounded-full rotate-12"
        />
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-8"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '2.5s' }}
      >
        <Image
          src="/hyperwear.png"
          alt="HyperWear"
          width={35}
          height={35}
          className="opacity-15 rounded-full -rotate-6"
        />
      </motion.div>

      {/* Animated geometric shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-12 h-12 border-2 border-secondary rounded-full" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/4"
        animate={{
          rotate: [0, -360],
          y: [-5, 5, -5],
          opacity: [0.15, 0.4, 0.15]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-mint to-secondary rounded-lg rotate-45" />
      </motion.div>

      <motion.div
        className="absolute top-3/4 right-1/3"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-6 h-6 border-2 border-accent rounded-sm rotate-12" />
      </motion.div>

      {/* Particle-like dots */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-br from-secondary to-mint rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
        />
      ))}
    </div>
  );
}