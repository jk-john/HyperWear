import AllProducts from "@/components/AllProducts";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import { DynamicImageShowcase } from "@/components/ui/dynamic-image-showcase";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HyperWear",
  url: "https://hyperwear.io",
  description: "Community merchandise store for HyperLiquid fans. Premium t-shirts, mugs, caps, and accessories designed by the community, for the community.",
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
  description: "HyperLiquid merchandise store featuring premium t-shirts, mugs, caps, and accessories designed by the community.",
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
  description: "HyperLiquid merchandise store offering premium t-shirts, mugs, caps, and accessories for the HyperLiquid community.",
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
  // Collection images for the 3D carousel
  const carouselImages = [
    "/img-collections/DSC02198.jpg",
    "/img-collections/DSC02218.jpg",
    "/img-collections/DSC02232.jpg",
    "/img-collections/DSC02234.jpg",
    "/img-collections/DSC02235.jpg",
    "/img-collections/DSC02268.jpg",
    "/img-collections/DSC02288.jpg",
    "/img-collections/DSC02297.jpg",
    "/img-collections/DSC02300.jpg",
    "/img-collections/DSC02317.jpg",
    "/img-collections/DSC02319.jpg",
    "/img-collections/DSC02325.jpg",
    "/img-collections/DSC02340.jpg",
  ];

  // Shuffle images for dynamic experience
  const shuffledImages = [...carouselImages].sort(() => Math.random() - 0.5);

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
        
        {/* Community Showcase Carousel Section */}
        <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 relative">
          <div className="container mx-auto px-4 text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Made by the Community,{" "}
              <span className="text-primary">for the Community</span>
            </h2>
          </div>
          <DynamicImageShowcase images={shuffledImages} />
        </section>

        {/* Trusted by Community Section */}
        <section className="w-full bg-white py-6">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Trusted by the <span className="text-primary">HyperLiquid Community</span>
            </h2>
            <p className="text-lg text-gray-500 font-medium mb-12">
              Join thousands of community members showcasing their HyperWear
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">100+</div>
                <p className="text-gray-600 font-medium">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">20+</div>
                <p className="text-gray-600 font-medium">Unique Designs</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">4.8★</div>
                <p className="text-gray-600 font-medium">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
                <p className="text-gray-600 font-medium">Community Support</p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-secondary text-primary w-full py-3 text-center font-bold">
          <p>Free shipping on orders over $60!</p>
        </div>
        
        <FeaturedProducts />
        <AllProducts />
      </div>
    </>
  );
}
