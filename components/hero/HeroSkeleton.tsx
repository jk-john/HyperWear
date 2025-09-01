import { Button } from "../ui/button";
import Link from "next/link";

export default function HeroSkeleton() {
  return (
    <section className="hero relative h-screen w-full overflow-hidden">
      {/* Static CSS gradient background - renders instantly */}
      <div className="absolute inset-0 bg-gradient-to-br from-jungle via-forest to-primary" />
      
      {/* Light overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* Static content - no animations, immediate visibility */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center p-4 text-center text-white sm:p-6 md:p-8">
        
        {/* Title - static, no VelocityScroll */}
        <div className="h-20 w-full sm:h-28 md:h-36 mb-8 flex items-center justify-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            The Place To House All Hyperliquid Fans.
          </h1>
        </div>

        {/* Subtitle - static text */}
        <div className="max-w-4xl text-center mb-12 px-4">
          <p className="text-white font-body text-base leading-7 sm:text-lg md:text-xl">
            <span className="text-white font-semibold">Crypto was fragmented</span>{" "}
            back then but{" "}
            <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">HyperLiquid</span>{" "}
            changed that. For the first time, wear the movement that{" "}
            <span className="text-white font-semibold">unites projects, creators, and assets</span>{" "}
            under one seamless ecosystem.
          </p>
        </div>

        {/* Call-to-Action Buttons - functional immediately */}
        <div className="flex w-full flex-col items-center justify-center gap-6 sm:w-auto sm:flex-row">
          <Button
            asChild
            className="hero-button bg-secondary text-primary hover:bg-white hover:shadow-2xl w-56 rounded-full border-2 border-secondary transition-all duration-300 hover:text-primary font-semibold text-lg py-6"
          >
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button
            asChild
            className="hero-button bg-transparent text-white hover:bg-secondary hover:text-primary hover:shadow-2xl w-56 rounded-full border-2 border-white transition-all duration-300 font-semibold text-lg py-6"
          >
            <Link href="/about-us">About Us</Link>
          </Button>
        </div>

        {/* Scroll Indicator - static */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="scroll-indicator flex flex-col items-center text-white/80">
            <span className="text-sm font-medium mb-2 tracking-wider text-white">SCROLL</span>
            <div className="w-[2px] h-8 bg-gradient-to-b from-secondary to-transparent rounded-full" />
          </div>
        </div>
      </div>

      {/* Simple floating elements - CSS only */}
      <div className="absolute top-20 right-20 w-3 h-3 bg-secondary rounded-full opacity-60" />
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-accent rounded-full opacity-50" />
      <div className="absolute top-1/3 left-10 w-1 h-1 bg-mint rounded-full opacity-30" />
      <div className="absolute bottom-1/3 right-10 w-1.5 h-1.5 bg-light rounded-full opacity-40" />
    </section>
  );
}