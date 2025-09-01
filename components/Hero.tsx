"use client";

import FloatingHyperLiquidElements from "@/components/FloatingHyperLiquidElements";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { VelocityScroll } from "./ui/scroll-based-velocity";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 }
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <section
      className="relative w-full min-h-[80svh] max-w-[90%] mx-auto overflow-hidden bg-[#02231e] text-white"
      aria-label="HyperWear hero"
    >
      {/* Ambient gradient + grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_20%,rgba(151,252,228,0.25)_0%,rgba(2,35,30,0.2)_40%,rgba(2,35,30,0.95)_100%)]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_90%)] opacity-20">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Floating branded bits */}
      <FloatingHyperLiquidElements />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pt-28 pb-20 text-center sm:px-6 md:px-8 lg:pt-36"
      >

        {/* Title with Velocity Scroll + accessible fallback */}
        <motion.div variants={fadeUp} className="mb-6 w-full max-w-4xl">
          <VelocityScroll
            tag="h1"
            defaultVelocity={0.7}
            className="whitespace-nowrap font-display text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            The Place To House All HyperLiquid Fans.
          </VelocityScroll>
          {/* Fallback for assistive tech / no-JS */}
          <h1 className="sr-only">
            The Place To House All HyperLiquid Fans.
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mb-10 max-w-2xl text-pretty text-white/90 text-base leading-7 sm:text-lg md:text-xl"
        >
          <span className="font-semibold">Crypto was fragmented</span> back then, but{" "}
          <span className="font-bold">HyperLiquid</span> changed that. Wear the movement that{" "}
          <span className="font-semibold">unites projects, creators, and assets</span>{" "}
          under one seamless ecosystem.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
        >
          <Button
            asChild
            className="w-56 rounded-full border-black shadow-lg bg-[#97fce4] text-[#02231e] hover:bg-primary hover:text-white transition"
          >
            <Link href="/products" aria-label="Browse HyperWear products">Shop Now</Link>
          </Button> 

          <Button
            asChild
            variant="outline"
            className="w-56 rounded-full border-white/40 shadow-lg bg-transparent text-white hover:bg-secondary hover:text-black transition"
          >
            <Link href="/about-us" aria-label="Learn more about HyperWear">About Us</Link>
          </Button>
        </motion.div>

        {/* Mini social proof / stat (optional, helps fill space on wide screens) */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex items-center gap-3 text-sm text-white/70"
        >
          <div className="flex -space-x-3">
            <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden">
              <Image
                src="/purr-logo.jpg"
                alt="Purr logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden">
              <Image
                src="/purr-logo.jpg"
                alt="Purr logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden">
              <Image
                src="/purr-logo.jpg"
                alt="Purr logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <span>Trusted by some of the HyperLiquid Community</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
