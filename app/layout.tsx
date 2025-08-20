import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { HypePriceProvider } from "@/context/HypePriceContext";
import { assertEnvVars } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Validate environment variables only on server-side
if (typeof window === "undefined") {
  assertEnvVars();
}

// Optimized font loading - only load essential weights
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Reduced from 9 to 4 weights
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"], // Reduced from 5 to 2 weights
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hyperwear.io"),
  title: {
    default: "HyperLiquid T-Shirts & Merchandise | HyperWear Community Store",
    template: `%s | HyperWear.io`,
  },
  description:
    "HyperLiquid t-shirts, mugs & merchandise designed by the community!  Premium quality Free shipping $60+ Exclusive designs Fast worldwide delivery. Shop now at HyperWear.io",
  keywords: [
    "HyperLiquid merchandise",
    "HyperLiquid t-shirts", 
    "HyperLiquid mugs",
    "HyperLiquid caps",
    "HyperLiquid apparel",
    "HyperLiquid clothing",
    "HyperLiquid community merch",
    "crypto merchandise",
    "blockchain apparel",
    "DeFi merchandise",
    "HyperLiquid community",
    "Web3 fashion",
    "HyperLiquid store",
    "HyperLiquid accessories"
  ].join(', '),
  authors: [{ name: "HyperWear Team" }],
  creator: "HyperLiquid Community",
  publisher: "HyperWear.io",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "HyperLiquid T-Shirts & Merchandise | HyperWear Community Store",
    description:
      "HyperLiquid t-shirts, mugs & merchandise designed by the community! Premium quality, free shipping $60+, exclusive designs.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "HyperWear.io - HyperLiquid Community Merchandise Store",
      },
    ],
    url: "https://hyperwear.io",
    siteName: "HyperWear.io",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@wear_hyper",
    creator: "@wear_hyper",
    title: "HyperLiquid T-Shirts & Merchandise | HyperWear Community Store",
    description:
      "HyperLiquid t-shirts, mugs & merchandise designed by the community! Premium quality, free shipping $60+, exclusive designs.",
    images: ["/og-preview.png"],
  },
  alternates: {
    canonical: "/",
  },
  category: "E-commerce",
  classification: "Business",
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
    "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/HYPE.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/HYPE.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2DD4BF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://jhxxuhisdypknlvhaklm.supabase.co" />
        <link rel="preconnect" href="https://api.hyperliquid.xyz" />
        
        {/* Critical CSS for faster render */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            body { font-family: var(--font-body), system-ui, -apple-system, sans-serif; }
            .hero-section { height: 100vh; position: relative; overflow: hidd en; }
            .hero-button { transition: all 0.3s ease; }
            .sticky { position: sticky; top: 0; z-index: 50; }
            .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
          `
        }} />
        {/* Font preload scripts removed to prevent hydration issues */}
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        {/* Full restoration complete */}
        <Header />
        <HypePriceProvider>
          {children}
        </HypePriceProvider>
        <Footer />
        <Toaster />
        <CookieBanner />
        <SpeedInsights />
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Service Worker management
                if ('serviceWorker' in navigator) {
                  const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
                  
                  if (isDev) {
                    // In development: unregister any existing service workers and clear caches
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {
                      for(let registration of registrations) {
                        registration.unregister();
                      }
                    });
                    
                    // Clear all caches in development
                    if ('caches' in window) {
                      caches.keys().then(function(names) {
                        for(let name of names) {
                          caches.delete(name);
                        }
                      });
                    }
                    
                    console.log('Development: Service workers unregistered and caches cleared');
                  } else {
                    // In production: register service worker
                    window.addEventListener('load', () => {
                      navigator.serviceWorker.register('/sw.js')
                        .then((registration) => {
                          console.log('SW registered: ', registration);
                        })
                        .catch((registrationError) => {
                          console.log('SW registration failed: ', registrationError);
                        });
                    });
                  }
                }
                
                // Web Vitals tracking only in production
                if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
                  if ('performance' in window && 'PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                      for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                          console.log('LCP:', entry.startTime);
                        }
                      }
                    });
                    observer.observe({entryTypes: ['largest-contentful-paint']});
                  }
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
