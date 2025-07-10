import AllProducts from "@/components/AllProducts";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HyperWear",
  url: "https://hyperwear.io",
  description: "Web3 merch store for HyperLiquid fans",
  sameAs: [
    "https://twitter.com/wear_hyper",
    "https://instagram.com/wear_hyper",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        key="org-jsonld"
      />
      <div className="flex flex-col items-center">
        <Hero />
        <div className="bg-secondary text-primary w-full py-3 text-center font-bold">
          <p>Free shipping on orders over $60!</p>
        </div>
        <FeaturedProducts />
        <AllProducts />
      </div>
    </>
  );
}
