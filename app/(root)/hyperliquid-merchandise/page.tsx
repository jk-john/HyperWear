import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types";
import { createClient } from "@/types/utils/supabase/server";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HyperLiquid Merchandise | HyperLiquid Community Apparel & Accessories | HyperWear.io",
  description: "Shop the complete collection of HyperLiquid merchandise designed by the community. T-shirts, mugs, caps, and more exclusive HyperLiquid apparel. ✓ Premium quality ✓ Free shipping over $60 ✓ Community store",
  keywords: [
    "HyperLiquid merchandise",
    "HyperLiquid apparel", 
    "HyperLiquid clothing",
    "HyperLiquid community merch",
    "HyperLiquid t-shirts",
    "HyperLiquid mugs",
    "HyperLiquid caps",
    "crypto merchandise",
    "blockchain apparel",
    "HyperLiquid community",
    "Web3 fashion",
    "DeFi merchandise",
    "HyperLiquid store"
  ].join(', '),
  alternates: {
    canonical: "/hyperliquid-merchandise",
  },
  openGraph: {
    title: "HyperLiquid Merchandise | HyperLiquid Community Apparel & Accessories",
    description: "Shop the complete collection of HyperLiquid merchandise designed by the community. Premium quality apparel and accessories for HyperLiquid fans.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "HyperLiquid Merchandise Collection - HyperLiquid Community Store",
      },
    ],
    type: 'website',
    siteName: 'HyperWear.io',
    url: 'https://hyperwear.io/hyperliquid-merchandise',
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperLiquid Merchandise | HyperLiquid Community Apparel & Accessories",
    description: "Shop the complete collection of HyperLiquid merchandise designed by the community.",
    images: ["/og-preview.png"],
  },
};

export default async function HyperLiquidMerchandisePage() {
  const supabase = createClient();
  
  // Fetch all products
  const { data: allProducts, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  // Group products by category
  const productsByCategory = allProducts?.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>) || {};

  // Category page structured data
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HyperLiquid Merchandise",
    description: "Complete collection of official HyperLiquid merchandise including t-shirts, mugs, caps, and accessories designed by the community, for the community.",
    url: "https://hyperwear.io/hyperliquid-merchandise",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allProducts?.length || 0,
      itemListElement: allProducts?.map((product, index) => ({
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
          name: "HyperLiquid Merchandise",
          item: "https://hyperwear.io/hyperliquid-merchandise"
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
        name: "What is HyperLiquid merchandise?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HyperLiquid merchandise includes official apparel and accessories designed by the HyperLiquid community, including t-shirts, mugs, caps, and other items that celebrate the HyperLiquid ecosystem."
        }
      },
      {
        "@type": "Question", 
        name: "Where can I buy official HyperLiquid merchandise?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HyperWear.io is a community merchandise store for HyperLiquid fans. All products are designed with community input and approval."
        }
      },
      {
        "@type": "Question",
        name: "What types of HyperLiquid merchandise are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer a wide range of HyperLiquid merchandise including premium t-shirts, ceramic mugs, caps, phone cases, and other accessories. All feature exclusive HyperLiquid community designs."
        }
      },
      {
        "@type": "Question",
        name: "Is HyperLiquid merchandise high quality?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! All HyperLiquid merchandise is made from premium materials. Our t-shirts use 100% cotton, mugs are high-grade ceramic, and all items are built to last."
        }
      },
      {
        "@type": "Question",
        name: "Do you offer free shipping on HyperLiquid merchandise?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We offer free shipping on all orders over $60. Most merchandise bundles qualify for free shipping."
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
              HyperLiquid Merchandise
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
                HyperLiquid Merchandise
              </span>
            </h1>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-10" style={{ color: 'var(--color-light)' }}>
              The complete collection of HyperLiquid merchandise designed by the community, for the community. 
              From premium t-shirts to exclusive mugs, represent your passion for the HyperLiquid ecosystem with 
              high-quality apparel and accessories that celebrate the future of decentralized finance.
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
                ✓ Community Store
              </span>
              <span 
                className="px-4 py-2 rounded-full font-medium border"
                style={{ 
                  background: 'rgba(151, 252, 228, 0.1)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-secondary)'
                }}
              >
                ✓ Premium Quality
              </span>
              <span 
                className="px-4 py-2 rounded-full font-medium border"
                style={{ 
                  background: 'rgba(151, 252, 228, 0.1)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-secondary)'
                }}
              >
                ✓ Exclusive Designs
              </span>
              <span 
                className="px-4 py-2 rounded-full font-medium border"
                style={{ 
                  background: 'rgba(151, 252, 228, 0.1)',
                  borderColor: 'var(--color-secondary)',
                  color: 'var(--color-secondary)'
                }}
              >
                ✓ Free Shipping $60+
              </span>
            </div>
          </section>

        

         
          {/* Products by Category */}
          {Object.entries(productsByCategory).map(([category, products]) => (
            <section key={category} className="mb-20">
              <h2 className="text-4xl font-bold text-center mb-12">
                <span style={{ color: 'var(--color-light)' }}>HyperLiquid </span>
                <span style={{ color: 'var(--color-secondary)' }}>{category}</span>
              </h2>
              <ProductGrid products={products as Product[]} className="!bg-transparent !p-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8 lg:gap-10 xl:gap-12" />
              <div className="text-center mt-12">
                <Link 
                  href={`/products?category=${category.toLowerCase()}`}
                  className="inline-flex items-center px-8 py-4 rounded-xl transition-all duration-300 font-semibold border-2 hover:opacity-80 shadow-lg"
                  style={{ 
                    borderColor: 'var(--color-secondary)', 
                    backgroundColor: 'transparent',
                    color: 'var(--color-secondary)'
                  }}
                >
                  View All {category} →
                </Link>
              </div>
            </section>
          ))}

          {/* Community Section */}
          

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
                  What is HyperLiquid merchandise?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  HyperLiquid merchandise includes apparel and accessories designed by the HyperLiquid community, including t-shirts, mugs, caps, and other items that celebrate the HyperLiquid ecosystem.
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
                  Where can I buy HyperLiquid merchandise?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  HyperWear.io is a community merchandise store for HyperLiquid fans. All products are designed with community input and approval.
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
                  What types of HyperLiquid merchandise are available?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  We offer a wide range of HyperLiquid merchandise including premium t-shirts, ceramic mugs, caps, phone cases, and other accessories. All feature exclusive HyperLiquid community designs.
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
                  Is HyperLiquid merchandise high quality?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  Yes! All HyperLiquid merchandise is made from premium materials. Our t-shirts use 100% cotton, mugs are high-grade ceramic, and all items are built to last.
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
                  Do you offer free shipping on HyperLiquid merchandise?
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-accent)' }}>
                  Yes! We offer free shipping on all orders over $60. Most merchandise bundles qualify for free shipping.
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
              Represent the Future of DeFi
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl mx-auto" style={{ color: 'var(--color-accent)' }}>
              {`Join thousands of HyperLiquid community members who proudly wear and use our merchandise. 
              Every purchase supports the community and helps spread awareness of the HyperLiquid ecosystem.`}
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
                Shop All Merchandise
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