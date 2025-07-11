import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HyperLiquid T-Shirts | Official HyperLiquid Merchandise | HyperWear.io",
  description: "Shop premium HyperLiquid t-shirts and tees designed by the community, for the community. Official HyperLiquid merchandise featuring exclusive designs. ✓ High-quality fabric ✓ Free shipping over $60 ✓ Perfect for crypto fans",
  keywords: [
    "HyperLiquid t-shirts",
    "HyperLiquid tees", 
    "HyperLiquid merchandise",
    "HyperLiquid clothing",
    "crypto t-shirts",
    "blockchain apparel",
    "HyperLiquid community",
    "Web3 fashion",
    "HyperLiquid official merch",
    "DeFi t-shirts"
  ].join(', '),
  alternates: {
    canonical: "/hyperliquid-tshirts",
  },
  openGraph: {
    title: "HyperLiquid T-Shirts | Official HyperLiquid Merchandise",
    description: "Shop premium HyperLiquid t-shirts designed by the community, for the community. High-quality fabric, exclusive designs, free shipping over $60.",
    images: [
      {
        url: "/products-img/tee-shirt.webp",
        width: 1200,
        height: 630,
        alt: "HyperLiquid T-Shirts Collection - Premium HyperLiquid Merchandise",
      },
    ],
    type: 'website',
    siteName: 'HyperWear.io',
    url: 'https://hyperwear.io/hyperliquid-tshirts',
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperLiquid T-Shirts | Official HyperLiquid Merchandise",
    description: "Shop premium HyperLiquid t-shirts designed by the community, for the community.",
    images: ["/products-img/tee-shirt.webp"],
  },
};

export default async function HyperLiquidTShirtsPage() {
  const supabase = createClient();
  
  // Fetch t-shirts from the database
  const { data: tshirts, error } = await supabase
    .from("products")
    .select("*")
    .ilike("category", "%shirt%")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching t-shirts:", error);
  }

  // Category page structured data
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HyperLiquid T-Shirts",
    description: "Premium HyperLiquid t-shirts and tees designed by the community, for the community. Official HyperLiquid merchandise with exclusive designs.",
    url: "https://hyperwear.io/hyperliquid-tshirts",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tshirts?.length || 0,
      itemListElement: tshirts?.map((product, index) => ({
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
          name: "HyperLiquid T-Shirts",
          item: "https://hyperwear.io/hyperliquid-tshirts"
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
        name: "What makes HyperLiquid t-shirts special?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our HyperLiquid t-shirts are designed by the community, for the community. Made with premium materials and featuring exclusive HyperLiquid designs that showcase your dedication to the ecosystem."
        }
      },
      {
        "@type": "Question", 
        name: "Are these official HyperLiquid t-shirts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! HyperWear is the official community merchandise store for HyperLiquid fans. Our t-shirts are designed with the HyperLiquid community input and approval."
        }
      },
      {
        "@type": "Question",
        name: "What sizes are available for HyperLiquid t-shirts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our HyperLiquid t-shirts are available in sizes S, M, L, XL, and XXL. Check individual product pages for specific size availability."
        }
      },
      {
        "@type": "Question",
        name: "Do you offer free shipping on HyperLiquid t-shirts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We offer free shipping on all orders over $60. Most of our t-shirt bundles qualify for free shipping."
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
            HyperLiquid T-Shirts
          </li>
        </ol>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent">
            HyperLiquid T-Shirts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Premium <strong>HyperLiquid t-shirts</strong> designed by the community, for the community. 
            Show your support for the HyperLiquid ecosystem with our exclusive collection of 
            high-quality tees featuring unique designs that celebrate the future of DeFi.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Premium Quality Fabric</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Exclusive HyperLiquid Designs</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Free Shipping Over $60</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Community Designed</span>
          </div>
        </section>

        {/* Featured Banner */}
        <section className="bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl p-8 mb-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Why Choose HyperLiquid T-Shirts?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Official Community Merch</h3>
                  <p className="text-sm text-gray-600">Designed by HyperLiquid fans, for HyperLiquid fans. Each design represents our shared passion for the ecosystem.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Premium Materials</h3>
                  <p className="text-sm text-gray-600">{`100% cotton, soft fabric that's built to last. Comfortable for daily wear and perfect for crypto events.`}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Exclusive Designs</h3>
                  <p className="text-sm text-gray-600">{`Unique HyperLiquid-themed designs you won't find anywhere else. Stand out in the crypto community.`}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop <span className="text-primary">HyperLiquid T-Shirts</span>
          </h2>
          {tshirts && tshirts.length > 0 ? (
            <ProductGrid products={tshirts as Product[]} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">New Designs Coming Soon!</h3>
              <p className="text-gray-600 mb-6">{`We're working on exclusive HyperLiquid t-shirt designs. Check back soon!`}</p>
              <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                View All Products
              </Link>
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">What makes HyperLiquid t-shirts special?</h3>
              <p className="text-gray-600">Our HyperLiquid t-shirts are designed by the community, for the community. Made with premium materials and featuring exclusive HyperLiquid designs that showcase your dedication to the ecosystem.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Are these official HyperLiquid t-shirts?</h3>
              <p className="text-gray-600">Yes! HyperWear is the official community merchandise store for HyperLiquid fans. Our t-shirts are designed with the HyperLiquid community input and approval.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">What sizes are available for HyperLiquid t-shirts?</h3>
              <p className="text-gray-600">Our HyperLiquid t-shirts are available in sizes S, M, L, XL, and XXL. Check individual product pages for specific size availability.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Do you offer free shipping on HyperLiquid t-shirts?</h3>
              <p className="text-gray-600">Yes! We offer free shipping on all orders over $60. Most of our t-shirt bundles qualify for free shipping.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Join the HyperLiquid Community</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {`Represent your favorite DeFi protocol with pride. Our HyperLiquid t-shirts are more than just clothing - 
            they're a statement of your commitment to the future of decentralized finance.`}
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