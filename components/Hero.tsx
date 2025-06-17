"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        // poster="/path-to-your-poster-image.jpg" // Optional: show an image while the video loads
      >
        {/* <source src="/your-video.mp4" type="video/mp4" /> */}
        {/* Add your video source here */}
      </video>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={cn(
            "font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          )}
        >
          The Place To House All HyperLiquid Fans
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          className="mt-6 max-w-2xl text-lg leading-8 text-cream text-center font-body"
        >
          Crypto is fragmented today, but your community doesn&apos;t have to
          be. For the first time, wear the movement that unites projects,
          creators, and assets on one hyper-performant chain.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Button
            asChild
            className="rounded-full bg-secondary text-primary shadow-lg transition-all hover:bg-secondary/90 hover:shadow-secondary/40"
          >
            <Link href="/products">Shop Collection</Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-white/50 text-white transition-all hover:border-white hover:bg-white/10"
          >
            About us
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
