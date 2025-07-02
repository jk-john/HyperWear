"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { VelocityScroll } from "./ui/scroll-based-velocity";

export default function Hero() {
  return (
    <section className="relative h-[65vh] w-full overflow-hidden sm:h-[85vh]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
        // poster="/path-to-your-poster-image.jpg" // Optional: show an image while the video loads
      >
        {/* <source src="/your-video.mp4" type="video/mp4" /> */}
        {/* Add your video source here */}
      </video>
      <div className="bg-jungle/50 absolute inset-0" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center text-white sm:p-6 md:p-8">
        <div className="h-20 w-full overflow-hidden sm:h-28 md:h-36">
          <VelocityScroll
            defaultVelocity={2}
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            The Place To House All Hyperliquid Fans.
          </VelocityScroll>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          className="text-cream font-body mt-6 max-w-2xl text-center text-base leading-8 sm:text-lg"
        >
          <span className="text-secondary font-body font-semibold">
            Crypto was fragmented
          </span>{" "}
          back then but{" "}
          <span className="text-secondary font-body font-bold">
            HyperLiquid
          </span>{" "}
          changed that. For the first time, wear the movement that{" "}
          <span className="text-secondary decoration-secondary font-body decoration-2 underline-offset-4">
            unites projects, creators, and assets
          </span>{" "}
          under one seamless ecosystem.{" "}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            className="bg-secondary text-primary hover:bg-primary rounded-full border border-white transition-all hover:text-white"
          >
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button
            asChild
            className="bg-secondary text-primary hover:bg-primary rounded-full border border-white transition-all hover:text-white"
          >
            <Link href="/about-us">About Us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
