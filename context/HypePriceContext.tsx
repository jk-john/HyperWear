"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface HypePriceContextType {
  hypePrice: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const HypePriceContext = createContext<HypePriceContextType | undefined>(undefined);

export function HypePriceProvider({ children }: { children: ReactNode }) {
  const [hypePrice, setHypePrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchHypePrice = async () => {
    try {
      setError(null);
      const response = await fetch('/api/hype-price', { 
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.hypeToUsd && typeof data.hypeToUsd === 'number') {
        setHypePrice(data.hypeToUsd);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid price data received');
      }
    } catch (err) {
      console.error('Failed to fetch HYPE price:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Initial fetch
    fetchHypePrice();
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchHypePrice, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!isMounted) {
    return (
      <HypePriceContext.Provider value={{ hypePrice: null, isLoading: true, error: null, lastUpdated: null }}>
        {children}
      </HypePriceContext.Provider>
    );
  }

  return (
    <HypePriceContext.Provider value={{ hypePrice, isLoading, error, lastUpdated }}>
      {children}
    </HypePriceContext.Provider>
  );
}

export function useHypePrice() {
  const context = useContext(HypePriceContext);
  if (context === undefined) {
    throw new Error('useHypePrice must be used within a HypePriceProvider');
  }
  return context;
} 