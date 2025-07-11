"use client";

import { useHypePrice } from "@/context/HypePriceContext";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function HypePriceTicker() {
  const { hypePrice, isLoading, lastUpdated } = useHypePrice();
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    if (hypePrice && previousPrice !== null) {
      if (hypePrice > previousPrice) {
        setPriceDirection('up');
      } else if (hypePrice < previousPrice) {
        setPriceDirection('down');
      } else {
        setPriceDirection('neutral');
      }
    }
    if (hypePrice) {
      setPreviousPrice(hypePrice);
    }
  }, [hypePrice]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-emerald)] text-white px-5 py-3 rounded-2xl shadow-lg border border-[var(--color-secondary)]/20 backdrop-blur-sm">
        <div className="w-6 h-6 p-1 bg-[var(--color-secondary)]/10 rounded-full">
          <Image src="/HYPE.svg" alt="HYPE" width={16} height={16} className="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-[var(--color-secondary)]">Loading price...</span>
        </div>
      </div>
    );
  }

  if (!hypePrice) {
    return null;
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getPriceChangeIcon = () => {
    switch (priceDirection) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-[var(--color-secondary)]" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-300" />;
      default:
        return <BarChart3 className="w-4 h-4 text-[var(--color-accent)]" />;
    }
  };

  const getPriceTextColor = () => {
    switch (priceDirection) {
      case 'up':
        return 'text-[var(--color-secondary)]';
      case 'down':
        return 'text-red-200';
      default:
        return 'text-[var(--color-secondary)]';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 p-1 bg-[var(--color-secondary)]/10 rounded-full">
        <Image 
          src="/HYPE.svg" 
          alt="HYPE" 
          width={16} 
          height={16} 
          className="w-full h-full object-contain filter brightness-0 invert" 
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className={`font-bold text-sm ${getPriceTextColor()} transition-colors duration-300`}>
            ${hypePrice.toFixed(4)}
          </span>
          <span className="text-[var(--color-light)] text-xs -mt-1">HYPE</span>
        </div>
        {getPriceChangeIcon()}
      </div>
      {lastUpdated && (
        <span className="text-xs text-[var(--color-accent)] hidden sm:block">
          {formatTime(lastUpdated)}
        </span>
      )}
    </div>
  );
}

// Floating ticker version for prominent display
export function FloatingHypePriceTicker() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
    }`}>
      <div className="relative bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-emerald)] to-[var(--color-deep)] text-white px-5 py-3 rounded-2xl shadow-lg border border-[var(--color-secondary)]/20 backdrop-blur-sm">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-primary)] hover:bg-[var(--color-deep)] text-[var(--color-secondary)] rounded-full flex items-center justify-center text-xs transition-colors duration-200 border border-[var(--color-secondary)]/20"
        >
          ×
        </button>
        
        <div className="flex items-center gap-4">
          <HypePriceTicker />
          
          <div className="border-l border-[var(--color-secondary)]/20 pl-4">
            <a
              href="https://app.hyperliquid.xyz/join/HW"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--color-secondary)] hover:bg-[var(--color-light)] text-[var(--color-primary)] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>Trade on HyperLiquid</span>
              <svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 