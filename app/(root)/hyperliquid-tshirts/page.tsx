import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types";
import { createClient } from "@/types/utils/supabase/server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HyperLiquid T-Shirts | HyperLiquid Community Merchandise | HyperWear.io",
  description: "Shop premium HyperLiquid t-shirts and tees designed by the community, for the community. HyperLiquid merchandise featuring exclusive designs. ✓ High-quality fabric ✓ Free shipping over $60 ✓ Perfect for crypto fans",
  keywords: [
    "HyperLiquid t-shirts",
    "HyperLiquid tees", 
    "HyperLiquid merchandise",
    "HyperLiquid clothing",
    "crypto t-shirts",
    "blockchain apparel",
    "HyperLiquid community",
    "Web3 fashion",
    "HyperLiquid community merch",
    "DeFi t-shirts"
  ].join(', '),
  alternates: {
    canonical: "/hyperliquid-tshirts",
  },
  openGraph: {
    title: "HyperLiquid T-Shirts | HyperLiquid Community Merchandise",
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
    title: "HyperLiquid T-Shirts | HyperLiquid Community Merchandise",
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
          text: "HyperWear is a community merchandise store for HyperLiquid fans. Our t-shirts are designed with the HyperLiquid community input and approval."
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
      <nav className="px-4 py-4" style={{ background: 'linear-gradient(135deg, var(--color-dark), var(--color-forest))' }}>
        <div className="container mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="hover:opacity-80 transition-opacity font-medium" style={{ color: 'var(--color-secondary)' }}>
                Home
              </Link>
            </li>
            <li className="before:content-['/'] before:mx-2 font-medium" style={{ color: 'var(--color-light)' }}>
              HyperLiquid T-Shirts
            </li>
          </ol>
        </div>
      </nav>

      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--color-dark) 0%, var(--color-forest) 50%, var(--color-deep) 100%)' }}>
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span 
                className="bg-clip-text text-transparent"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                HyperLiquid T-Shirts
              </span>
            </h1>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-10" style={{ color: 'var(--color-light)' }}>
              Premium <strong>HyperLiquid t-shirts</strong> designed by the community, for the community. 
              Show your support for the HyperLiquid ecosystem with our exclusive collection of 
              high-quality tees featuring unique designs that celebrate the future of DeFi.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span 
                className="px-4 py-2 rounded-full font-medium border"
                style={{ 
                  background: 'rgba(151, 252, 228, 0.1)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-secondary)'
                }}
              >
                ✓ Premium Quality Fabric
              </span>
              <span 
                className="px-4 py-2 rounded-full font-medium border"
                style={{ 
                  background: 'rgba(151, 252, 228, 0.1)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-secondary)'
                }}
              >
                ✓ Exclusive HyperLiquid Designs
              </span>
              <span 
                className="px-4 py-2 rounded-full font-medium border"
                style={{ 
                  background: 'rgba(151, 252, 228, 0.1)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-secondary)'
                }}
              >
                ✓ Free Shipping Over $60
              </span>
              <span 
                className="px-4 py-2 rounded-full font-medium border"
                style={{ 
                  background: 'rgba(151, 252, 228, 0.1)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-secondary)'
                }}
              >
                ✓ Community Designed
              </span>
            </div>
          </section>



          {/* Products Grid */}
          <section>
            <h2 className="text-4xl font-bold text-center mb-12">
              <span style={{ color: 'var(--color-light)' }}>Shop </span>
              <span style={{ color: 'var(--color-secondary)' }}>HyperLiquid T-Shirts</span>
            </h2>
            {tshirts && tshirts.length > 0 ? (
              <ProductGrid products={tshirts as Product[]} />
            ) : (
              <div className="text-center py-16">
                <div className="mb-8 flex justify-center">
                  <div 
                    className="p-6 rounded-2xl border backdrop-blur-sm"
                    style={{ 
                      background: 'rgba(15, 57, 51, 0.6)', 
                      borderColor: 'rgba(151, 252, 228, 0.3)' 
                    }}
                  >
                    <Image
                      src="/products-img/tee-shirt.webp"
                      alt="Coming Soon T-Shirts"
                      width={120}
                      height={120}
                      className="rounded-lg opacity-80"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-light)' }}>
                  New Designs Coming Soon!
                </h3>
                <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-accent)' }}>
                  {`We're working on exclusive HyperLiquid t-shirt designs. Check back soon!`}
                </p>
                <Link 
                  href="/products" 
                  className="px-8 py-4 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--color-secondary), var(--color-mint))',
                    color: 'var(--color-dark)'
                  }}
                >
                  View All Products
                </Link>
              </div>
            )}
          </section>

          {/* FAQ Section */}
          <section className="mt-20 max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--color-light)' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div 
                className="rounded-2xl p-8 border backdrop-blur-sm"
                style={{ 
                  background: 'rgba(15, 57, 51, 0.6)', 
                  borderColor: 'rgba(151, 252, 228, 0.3)' 
                }}
              >
                <h3 className="font-bold mb-4 text-lg" style={{ color: 'var(--color-light)' }}>
                  What makes HyperLiquid t-shirts special?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  Our HyperLiquid t-shirts are designed by the community, for the community. Made with premium materials and featuring exclusive HyperLiquid designs that showcase your dedication to the ecosystem.
                </p>
              </div>
              <div 
                className="rounded-2xl p-8 border backdrop-blur-sm"
                style={{ 
                  background: 'rgba(15, 57, 51, 0.6)', 
                  borderColor: 'rgba(151, 252, 228, 0.3)' 
                }}
              >
                <h3 className="font-bold mb-4 text-lg" style={{ color: 'var(--color-light)' }}>
                  Are these HyperLiquid t-shirts?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  HyperWear is a community merchandise store for HyperLiquid fans. Our t-shirts are designed with the HyperLiquid community input and approval.
                </p>
              </div>
              <div 
                className="rounded-2xl p-8 border backdrop-blur-sm"
                style={{ 
                  background: 'rgba(15, 57, 51, 0.6)', 
                  borderColor: 'rgba(151, 252, 228, 0.3)' 
                }}
              >
                <h3 className="font-bold mb-4 text-lg" style={{ color: 'var(--color-light)' }}>
                  What sizes are available for HyperLiquid t-shirts?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  Our HyperLiquid t-shirts are available in sizes S, M, L, XL, and XXL. Check individual product pages for specific size availability.
                </p>
              </div>
              <div 
                className="rounded-2xl p-8 border backdrop-blur-sm"
                style={{ 
                  background: 'rgba(15, 57, 51, 0.6)', 
                  borderColor: 'rgba(151, 252, 228, 0.3)' 
                }}
              >
                <h3 className="font-bold mb-4 text-lg" style={{ color: 'var(--color-light)' }}>
                  Do you offer free shipping on HyperLiquid t-shirts?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  Yes! We offer free shipping on all orders over $60. Most of our t-shirt bundles qualify for free shipping.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section 
            className="text-center mt-20 rounded-3xl p-12 border backdrop-blur-md"
            style={{ 
              background: 'linear-gradient(135deg, rgba(151, 252, 228, 0.1), rgba(15, 57, 51, 0.8))',
              borderColor: 'rgba(151, 252, 228, 0.3)'
            }}
          >
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-light)' }}>
              Join the HyperLiquid Community
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl mx-auto" style={{ color: 'var(--color-accent)' }}>
              {`Represent your favorite DeFi protocol with pride. Our HyperLiquid t-shirts are more than just clothing - 
              they're a statement of your commitment to the future of decentralized finance.`}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/products" 
                className="px-10 py-4 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-secondary), var(--color-mint))',
                  color: 'var(--color-dark)'
                }}
              >
                Shop All HyperLiquid Merch
              </Link>
              <Link 
                href="/community" 
                className="px-10 py-4 rounded-xl transition-all duration-300 border-2 font-bold hover:opacity-80 shadow-lg"
                style={{ 
                  borderColor: 'var(--color-secondary)', 
                  color: 'var(--color-secondary)',
                  background: 'rgba(151, 252, 228, 0.1)'
                }}
              >
                Join Community
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
} 