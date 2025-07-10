import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

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
    default: "HyperWear.io — Web3 Shop for HyperLiquid Fans",
    template: `%s | HyperWear.io`,
  },
  description:
    "Explore HyperWear, the official Web3 fashion store for HyperLiquid fans. Shop HyperLiquid products and more. Made by the HyperLiquid community, for the HyperLiquid community.",
  openGraph: {
    title: "HyperWear.io — Web3 Shop for HyperLiquid Fans",
    description:
      "Explore HyperWear, the official Web3 fashion store for HyperLiquid fans. Shop HyperLiquid products and more. Made by the HyperLiquid community, for the HyperLiquid community.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "HyperWear.io - Web3 Shop for HyperLiquid Fans",
      },
    ],
    url: "https://hyperwear.io",
    siteName: "HyperWear.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperWear.io — Web3 Shop for HyperLiquid Fans",
    description:
      "Explore HyperWear, the official Web3 fashion store for HyperLiquid fans. Shop HyperLiquid products and more. Made by the HyperLiquid community, for the HyperLiquid community.",
    images: ["/og-preview.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
        <Toaster />
        <CookieBanner />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
