import { CartProvider } from "@/components/CartProvider";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";

import { Toaster } from "@/components/ui/sonner";
import { HypePriceProvider } from "@/context/HypePriceContext";
import { assertEnvVars } from "@/lib/utils";
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Analytics } from "@vercel/analytics/next";
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
      <title>HyperWear.io</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/HYPE.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/HYPE.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2DD4BF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://jhxxuhisdypknlvhaklm.supabase.co" />
        <link rel="preconnect" href="https://auth.hyperwear.io" />
        <link rel="preconnect" href="https://api.hyperliquid.xyz" />

      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <CartProvider>
          <Header />
          <HypePriceProvider>
            {children}
          </HypePriceProvider>
          <Footer />
        </CartProvider>
        <Toaster /> 
        <CookieBanner />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
