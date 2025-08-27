"use client";

import { MEDIA_URLS } from "@/lib/supabase/storage";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { VelocityScroll } from "./ui/scroll-based-velocity";

export default function Hero() {

  return (
    <section 
      className="video-hero relative h-screen w-full overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 blur-xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="/hyperwear.png"
        >
          <source src={MEDIA_URLS.VIDEO_HOMEPAGE} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Light Overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-jungle/20 via-forest/15 to-primary/25" />


      {/* Content Container */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center p-4 text-center text-primary sm:p-6 md:p-8">

        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="h-20 w-full overflow-hidden sm:h-28 md:h-36 mb-8"
        >
          <VelocityScroll
            tag="h1"
            defaultVelocity={2}
            className="font-display text-3xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl"
          >
            The Place To House All Hyperliquid Fans.
          </VelocityScroll>
        </motion.div>

                {/* Subtitle with simple text visibility */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="max-w-4xl text-center mb-12 px-4"
        >
          <motion.p
            className="text-primary font-body text-base leading-7 sm:text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.span 
              className="text-primary font-semibold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Crypto was fragmented
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              back then but{" "}
            </motion.span>
            <motion.span 
              className="text-primary font-bold text-lg sm:text-xl md:text-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              HyperLiquid
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              changed that. For the first time, wear the movement that{" "}
            </motion.span>
            <motion.span 
              className="text-primary font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              unites projects, creators, and assets
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              under one seamless ecosystem.
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4, ease: "easeOut" }}
          className="flex w-full flex-col items-center justify-center gap-6 sm:w-auto sm:flex-row"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              asChild
              className="hero-button bg-secondary text-primary hover:bg-white hover:shadow-2xl w-56 rounded-full border-2 border-secondary transition-all duration-300 hover:text-primary font-semibold text-lg py-6"
            >
              <Link href="/products">Shop Now</Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              asChild
              className="hero-button bg-transparent text-primary hover:bg-secondary hover:text-primary hover:shadow-2xl w-56 rounded-full border-2 border-primary transition-all duration-300 font-semibold text-lg py-6"
            >
              <Link href="/about-us">About Us</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="scroll-indicator flex flex-col items-center text-primary/80">
            <span className="text-sm font-medium mb-2 tracking-wider">SCROLL</span>
            <div className="w-[2px] h-8 bg-gradient-to-b from-secondary to-transparent rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="floating-element-1 absolute top-20 right-20 w-3 h-3 bg-secondary rounded-full opacity-60" />

      <div className="floating-element-2 absolute bottom-40 left-20 w-2 h-2 bg-accent rounded-full opacity-50" />

      <motion.div
        className="absolute top-1/3 left-10 w-1 h-1 bg-mint rounded-full opacity-30"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          delay: 2
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-10 w-1.5 h-1.5 bg-light rounded-full opacity-40"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          delay: 3
        }}
      />
    </section>
  );
}
