import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingHypePriceTicker } from "@/components/HypePriceTicker";
import { Toaster } from "@/components/ui/sonner";
import { HypePriceProvider } from "@/context/HypePriceContext";
import { assertEnvVars } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Validate environment variables at startup
assertEnvVars();

// Load fonts from Google Fonts with all weights
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hyperwear.io"),
  title: {
    default: "HyperWear.io — Official HyperLiquid Merchandise | T-Shirts, Mugs & More",
    template: `%s | HyperWear.io`,
  },
  description:
    "Shop official HyperLiquid merchandise at HyperWear.io. Premium HyperLiquid t-shirts, mugs, caps, and accessories designed by the community, for the community. ✓ Free shipping over $60 ✓ High-quality materials ✓ Exclusive designs",
  keywords: [
    "HyperLiquid merchandise",
    "HyperLiquid t-shirts", 
    "HyperLiquid mugs",
    "HyperLiquid caps",
    "HyperLiquid apparel",
    "HyperLiquid clothing",
    "HyperLiquid official merch",
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
    title: "HyperWear.io — Official HyperLiquid Merchandise Store",
    description:
      "Shop premium HyperLiquid t-shirts, mugs, caps, and accessories designed by the community. Official HyperLiquid merchandise with free shipping over $60.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "HyperWear.io - Official HyperLiquid Merchandise Store",
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
    title: "HyperWear.io — Official HyperLiquid Merchandise",
    description:
      "Shop premium HyperLiquid t-shirts, mugs, caps, and accessories designed by the community. Official HyperLiquid merchandise store.",
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
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <Header />
        <HypePriceProvider>
          {children}
          <FloatingHypePriceTicker />
        </HypePriceProvider>
        <Footer />
        <Toaster />
        <CookieBanner />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
