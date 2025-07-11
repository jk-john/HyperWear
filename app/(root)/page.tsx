import AllProducts from "@/components/AllProducts";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HyperWear",
  url: "https://hyperwear.io",
  description: "Official community merchandise store for HyperLiquid fans. Premium t-shirts, mugs, caps, and accessories designed by the community, for the community.",
  sameAs: [
    "https://twitter.com/wear_hyper",
    "https://instagram.com/wear_hyper",
  ],
  logo: "https://hyperwear.io/HYPE.svg",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: "https://hyperwear.io/support"
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "US"
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "15",
    highPrice: "150",
    availability: "https://schema.org/InStock"
  }
};

// Website structured data
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HyperWear.io",
  url: "https://hyperwear.io",
  description: "Official HyperLiquid merchandise store featuring premium t-shirts, mugs, caps, and accessories designed by the community.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://hyperwear.io/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  publisher: {
    "@type": "Organization",
    name: "HyperWear"
  }
};

// Store structured data
const storeSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "HyperWear.io",
  description: "Official HyperLiquid merchandise store offering premium t-shirts, mugs, caps, and accessories for the HyperLiquid community.",
  url: "https://hyperwear.io",
  logo: "https://hyperwear.io/HYPE.svg",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "HyperLiquid Merchandise",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "HyperLiquid T-Shirts",
          description: "Premium HyperLiquid t-shirts designed by the community"
        }
      },
      {
        "@type": "Offer", 
        itemOffered: {
          "@type": "Product",
          name: "HyperLiquid Mugs",
          description: "High-quality ceramic HyperLiquid mugs"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product", 
          name: "HyperLiquid Caps",
          description: "Stylish HyperLiquid caps and headwear"
        }
      }
    ]
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        key="org-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        key="website-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        key="store-jsonld"
      />
      
      <div className="flex flex-col items-center">
        <Hero />
        
        {/* SEO Content Section */}
        <section className="w-full bg-gradient-to-r from-primary/5 to-emerald-500/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Official <span className="text-primary">HyperLiquid Merchandise</span> Store
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-8">
              Welcome to <strong>HyperWear.io</strong>, the official community merchandise store for HyperLiquid fans. 
              Shop premium <strong>HyperLiquid t-shirts</strong>, <strong>HyperLiquid mugs</strong>, caps, and accessories 
              designed by the community, for the community. Every purchase supports the HyperLiquid ecosystem.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              <Link href="/hyperliquid-tshirts" className="group bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">👕</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">HyperLiquid T-Shirts</h3>
                <p className="text-gray-600 text-sm">Premium quality tees with exclusive HyperLiquid community designs. Perfect for crypto enthusiasts and traders.</p>
              </Link>
              <Link href="/hyperliquid-mugs" className="group bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">☕</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">HyperLiquid Mugs</h3>
                <p className="text-gray-600 text-sm">High-quality ceramic mugs perfect for your morning coffee while checking HyperLiquid positions.</p>
              </Link>
              <Link href="/hyperliquid-merchandise" className="group bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">🛍️</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">All Merchandise</h3>
                <p className="text-gray-600 text-sm">Explore the complete collection of HyperLiquid merchandise including caps, accessories, and more.</p>
              </Link>
            </div>
          </div>
        </section>

        <div className="bg-secondary text-primary w-full py-3 text-center font-bold">
          <p>Free shipping on orders over $60!</p>
        </div>
        
        <FeaturedProducts />
        
        {/* Community Trust Section */}
        <section className="w-full bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Trusted by the <span className="text-primary">HyperLiquid Community</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">1000+</div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">50+</div>
                <p className="text-gray-600">Unique Designs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">4.8★</div>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <p className="text-gray-600">Community Support</p>
              </div>
            </div>
          </div>
        </section>

        <AllProducts />
        
        {/* Why Choose HyperWear Section */}
        <section className="w-full bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Why Choose <span className="text-primary">HyperWear</span> for HyperLiquid Merchandise?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">🎨</div>
                <h3 className="font-semibold mb-3">Community Designed</h3>
                <p className="text-gray-600 text-sm">Every design is created by HyperLiquid community members, ensuring authentic representation of our shared values.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">⭐</div>
                <h3 className="font-semibold mb-3">Premium Quality</h3>
                <p className="text-gray-600 text-sm">We use only the finest materials - 100% cotton for tees, high-grade ceramic for mugs, and durable fabrics for all items.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">🚚</div>
                <h3 className="font-semibold mb-3">Fast Shipping</h3>
                <p className="text-gray-600 text-sm">Free shipping on orders over $60 with fast processing and worldwide delivery to HyperLiquid fans everywhere.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">🤝</div>
                <h3 className="font-semibold mb-3">Community Support</h3>
                <p className="text-gray-600 text-sm">Every purchase supports the HyperLiquid community and helps fund future developments and initiatives.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
