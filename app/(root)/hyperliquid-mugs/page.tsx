import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HyperLiquid Mugs | Official HyperLiquid Coffee Mugs | HyperWear.io",
  description: "Shop premium HyperLiquid mugs and coffee cups designed by the community, for the community. Official HyperLiquid merchandise featuring exclusive designs. ✓ High-quality ceramic ✓ Free shipping over $60 ✓ Perfect for crypto fans",
  keywords: [
    "HyperLiquid mugs",
    "HyperLiquid coffee mugs", 
    "HyperLiquid cups",
    "HyperLiquid merchandise",
    "crypto mugs",
    "blockchain drinkware",
    "HyperLiquid community",
    "Web3 accessories",
    "HyperLiquid official merch",
    "DeFi mugs"
  ].join(', '),
  alternates: {
    canonical: "/hyperliquid-mugs",
  },
  openGraph: {
    title: "HyperLiquid Mugs | Official HyperLiquid Coffee Mugs",
    description: "Shop premium HyperLiquid mugs designed by the community, for the community. High-quality ceramic, exclusive designs, free shipping over $60.",
    images: [
      {
        url: "/products-img/mug.webp",
        width: 1200,
        height: 630,
        alt: "HyperLiquid Mugs Collection - Premium HyperLiquid Merchandise",
      },
    ],
    type: 'website',
    siteName: 'HyperWear.io',
    url: 'https://hyperwear.io/hyperliquid-mugs',
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperLiquid Mugs | Official HyperLiquid Coffee Mugs",
    description: "Shop premium HyperLiquid mugs designed by the community, for the community.",
    images: ["/products-img/mug.webp"],
  },
};

export default async function HyperLiquidMugsPage() {
  const supabase = createClient();
  
  // Fetch mugs from the database
  const { data: mugs, error } = await supabase
    .from("products")
    .select("*")
    .or("category.ilike.%mug%,category.ilike.%cup%")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mugs:", error);
  }

  // Category page structured data
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HyperLiquid Mugs",
    description: "Premium HyperLiquid mugs and coffee cups designed by the community, for the community. Official HyperLiquid merchandise with exclusive designs.",
    url: "https://hyperwear.io/hyperliquid-mugs",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: mugs?.length || 0,
      itemListElement: mugs?.map((product, index) => ({
        "@type": "Product",
        position: index + 1,
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        }
      })) || []
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://hyperwear.io"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "HyperLiquid Mugs",
          item: "https://hyperwear.io/hyperliquid-mugs"
        }
      ]
    }
  };

  // FAQ structured data for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What makes HyperLiquid mugs special?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our HyperLiquid mugs are made from high-quality ceramic with exclusive community-designed artwork. Perfect for your morning coffee while staying connected to the HyperLiquid ecosystem."
        }
      },
      {
        "@type": "Question", 
        name: "Are these official HyperLiquid mugs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! HyperWear is the official community merchandise store for HyperLiquid fans. Our mugs feature designs approved by the HyperLiquid community."
        }
      },
      {
        "@type": "Question",
        name: "What size are the HyperLiquid mugs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our HyperLiquid mugs hold 11oz (325ml) of your favorite beverage. Perfect size for coffee, tea, or any hot beverage while you trade on HyperLiquid."
        }
      },
      {
        "@type": "Question",
        name: "Are HyperLiquid mugs dishwasher safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Our HyperLiquid mugs are made from high-quality ceramic that is both dishwasher and microwave safe for your convenience."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        key="category-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        key="faq-jsonld"
      />

      {/* Breadcrumb Navigation */}
      <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li className="before:content-['/'] before:mx-2 before:text-gray-400 text-gray-900 font-medium">
            HyperLiquid Mugs
          </li>
        </ol>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent">
            HyperLiquid Mugs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Premium <strong>HyperLiquid mugs</strong> designed by the community, for the community. 
            Start your day with your favorite beverage in exclusive HyperLiquid drinkware that celebrates 
            the future of decentralized finance. Perfect for traders, developers, and crypto enthusiasts.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ High-Quality Ceramic</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Exclusive HyperLiquid Designs</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Dishwasher & Microwave Safe</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ 11oz Perfect Size</span>
          </div>
        </section>

        {/* Featured Banner */}
        <section className="bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl p-8 mb-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Why Choose HyperLiquid Mugs?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Community Crafted</h3>
                  <p className="text-sm text-gray-600">Every design is created by and for the HyperLiquid community. Express your passion for DeFi with every sip.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Premium Quality</h3>
                  <p className="text-sm text-gray-600">High-grade ceramic construction ensures durability and perfect heat retention for your favorite beverages.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Trader Approved</h3>
                  <p className="text-sm text-gray-600">Perfect for those long trading sessions. Keep your coffee warm while you navigate the HyperLiquid ecosystem.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop <span className="text-primary">HyperLiquid Mugs</span>
          </h2>
          {mugs && mugs.length > 0 ? (
            <ProductGrid products={mugs as Product[]} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">New Designs Coming Soon!</h3>
              <p className="text-gray-600 mb-6">{`We're crafting exclusive HyperLiquid mug designs. Check back soon for the perfect addition to your trading setup!`}</p>
              <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                View All Products
              </Link>
            </div>
          )}
        </section>

        {/* Usage Ideas Section */}
        <section className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Perfect For Every HyperLiquid Fan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl mb-3">☕</div>
              <h3 className="font-semibold mb-2">Morning Trading</h3>
              <p className="text-sm text-gray-600">Start your day with coffee and check your HyperLiquid positions</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="font-semibold mb-2">Office Conversations</h3>
              <p className="text-sm text-gray-600">Spark discussions about DeFi and HyperLiquid at work</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-semibold mb-2">Perfect Gift</h3>
              <p className="text-sm text-gray-600">Ideal present for crypto enthusiasts and traders</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">💻</div>
              <h3 className="font-semibold mb-2">Coding Sessions</h3>
              <p className="text-sm text-gray-600">Fuel your DeFi development with the perfect mug</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">What makes HyperLiquid mugs special?</h3>
              <p className="text-gray-600">Our HyperLiquid mugs are made from high-quality ceramic with exclusive community-designed artwork. Perfect for your morning coffee while staying connected to the HyperLiquid ecosystem.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Are these official HyperLiquid mugs?</h3>
              <p className="text-gray-600">Yes! HyperWear is the official community merchandise store for HyperLiquid fans. Our mugs feature designs approved by the HyperLiquid community.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">What size are the HyperLiquid mugs?</h3>
              <p className="text-gray-600">Our HyperLiquid mugs hold 11oz (325ml) of your favorite beverage. Perfect size for coffee, tea, or any hot beverage while you trade on HyperLiquid.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Are HyperLiquid mugs dishwasher safe?</h3>
              <p className="text-gray-600">Yes! Our HyperLiquid mugs are made from high-quality ceramic that is both dishwasher and microwave safe for your convenience.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Fuel Your HyperLiquid Journey</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether {`you're analyzing charts, coding smart contracts, or simply enjoying your morning coffee, 
            our HyperLiquid mugs are the perfect companion for your crypto lifestyle.`}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Shop All HyperLiquid Merch
            </Link>
            <Link href="/community" className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors">
              Join Community
            </Link>
          </div>
        </section>
      </div>
    </>
  );
} 