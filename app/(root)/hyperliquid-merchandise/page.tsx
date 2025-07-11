import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HyperLiquid Merchandise | Official HyperLiquid Apparel & Accessories | HyperWear.io",
  description: "Shop the complete collection of official HyperLiquid merchandise designed by the community. T-shirts, mugs, caps, and more exclusive HyperLiquid apparel. ✓ Premium quality ✓ Free shipping over $60 ✓ Official community store",
  keywords: [
    "HyperLiquid merchandise",
    "HyperLiquid apparel", 
    "HyperLiquid clothing",
    "HyperLiquid official merch",
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
    title: "HyperLiquid Merchandise | Official HyperLiquid Apparel & Accessories",
    description: "Shop the complete collection of official HyperLiquid merchandise designed by the community. Premium quality apparel and accessories for HyperLiquid fans.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "HyperLiquid Merchandise Collection - Official HyperLiquid Store",
      },
    ],
    type: 'website',
    siteName: 'HyperWear.io',
    url: 'https://hyperwear.io/hyperliquid-merchandise',
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperLiquid Merchandise | Official HyperLiquid Apparel & Accessories",
    description: "Shop the complete collection of official HyperLiquid merchandise designed by the community.",
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
          text: "HyperWear.io is the official community merchandise store for HyperLiquid fans. All products are designed with community input and approval."
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
      <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li className="before:content-['/'] before:mx-2 before:text-gray-400 text-gray-900 font-medium">
            HyperLiquid Merchandise
          </li>
        </ol>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent">
            HyperLiquid Merchandise
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            The complete collection of official <strong>HyperLiquid merchandise</strong> designed by the community, for the community. 
            From premium t-shirts to exclusive mugs, represent your passion for the HyperLiquid ecosystem with 
            high-quality apparel and accessories that celebrate the future of decentralized finance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Official Community Store</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Premium Quality Materials</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Exclusive Designs</span>
            <span className="bg-secondary/20 px-3 py-1 rounded-full">✓ Free Shipping Over $60</span>
          </div>
        </section>

        {/* Category Quick Links */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/hyperliquid-tshirts" className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
              <div className="text-4xl mb-4">👕</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">T-Shirts</h3>
              <p className="text-sm text-gray-600">Premium HyperLiquid tees</p>
            </Link>
            <Link href="/hyperliquid-mugs" className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Mugs</h3>
              <p className="text-sm text-gray-600">High-quality ceramic mugs</p>
            </Link>
            <Link href="/products?category=caps" className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
              <div className="text-4xl mb-4">🧢</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Caps</h3>
              <p className="text-sm text-gray-600">Stylish HyperLiquid caps</p>
            </Link>
            <Link href="/products" className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">All Items</h3>
              <p className="text-sm text-gray-600">Complete collection</p>
            </Link>
          </div>
        </section>

        {/* Featured Banner */}
        <section className="bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl p-8 mb-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Why Choose HyperLiquid Merchandise?</h2>
            <div className="grid md:grid-cols-4 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Community Driven</h3>
                  <p className="text-sm text-gray-600">Every design is created by and for the HyperLiquid community</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Premium Quality</h3>
                  <p className="text-sm text-gray-600">High-grade materials and construction for lasting durability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Exclusive Designs</h3>
                  <p className="text-sm text-gray-600">{`Unique artwork you won't find anywhere else in the crypto space`}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Fast Shipping</h3>
                  <p className="text-sm text-gray-600">Free shipping over $60 with worldwide delivery available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products by Category */}
        {Object.entries(productsByCategory).map(([category, products]) => (
          <section key={category} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-primary">HyperLiquid {category}</span>
            </h2>
            <ProductGrid products={products as Product[]} />
            <div className="text-center mt-8">
              <Link 
                href={`/products?category=${category.toLowerCase()}`}
                className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                View All {category} →
              </Link>
            </div>
          </section>
        ))}

        {/* Community Section */}
        <section className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Join the HyperLiquid Community</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-semibold mb-3">For Traders</h3>
              <p className="text-gray-600">Show your dedication to DeFi while trading on HyperLiquid. Perfect conversation starters at crypto meetups.</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💻</div>
              <h3 className="font-semibold mb-3">For Developers</h3>
              <p className="text-gray-600">Represent the ecosystem {`you're building on. Ideal for hackathons, conferences, and coding sessions.`}</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="font-semibold mb-3">For Enthusiasts</h3>
              <p className="text-gray-600">Express your passion for the future of finance. Perfect gifts for fellow crypto enthusiasts.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">What is HyperLiquid merchandise?</h3>
              <p className="text-gray-600">HyperLiquid merchandise includes official apparel and accessories designed by the HyperLiquid community, including t-shirts, mugs, caps, and other items that celebrate the HyperLiquid ecosystem.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Where can I buy official HyperLiquid merchandise?</h3>
              <p className="text-gray-600">HyperWear.io is the official community merchandise store for HyperLiquid fans. All products are designed with community input and approval.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">What types of HyperLiquid merchandise are available?</h3>
              <p className="text-gray-600">We offer a wide range of HyperLiquid merchandise including premium t-shirts, ceramic mugs, caps, phone cases, and other accessories. All feature exclusive HyperLiquid community designs.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Is HyperLiquid merchandise high quality?</h3>
              <p className="text-gray-600">Yes! All HyperLiquid merchandise is made from premium materials. Our t-shirts use 100% cotton, mugs are high-grade ceramic, and all items are built to last.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Do you offer free shipping on HyperLiquid merchandise?</h3>
              <p className="text-gray-600">Yes! We offer free shipping on all orders over $60. Most merchandise bundles qualify for free shipping.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Represent the Future of DeFi</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {`Join thousands of HyperLiquid community members who proudly wear and use our merchandise. 
            Every purchase supports the community and helps spread awareness of the HyperLiquid ecosystem.`}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Shop All Merchandise
            </Link>
            <Link href="/community" className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors">
              Join Community
            </Link>
          </div>
        </section>
      </div>
    </>
  );
} 