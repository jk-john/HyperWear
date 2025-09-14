import CollectionsClient from "@/components/CollectionsClient";
import { Metadata } from "next";

interface Collection {
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  comingSoon?: boolean;
}

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Discover our carefully curated collections of Web3 streetwear and crypto fashion, each with a unique style and story. Made for the HyperLiquid community, created by the HyperLiquid community.",
  alternates: {
    canonical: "/collections",
  },
  openGraph: {
    title: "Collections | HyperWear.io",
    description:
      "Discover our carefully curated collections of Web3 streetwear and crypto fashion, each with a unique style and story.",
    url: "/collections",
  },
};

const carouselImages = [
  "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02198.jpg",
  "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02340.jpg",
  "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02232.jpg",
  "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02268.jpg",
  "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02297.jpg",
  "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02325.jpg",
  "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02288.jpg",
];

const collections: Collection[] = [
  {
    title: "Cool Caps",
    description: "Top off your look with our stylish caps.",
    image: "https://auth.hyperwear.io/storage/v1/object/public/products-images/hyperliquid-cap-embroidered/classic-dad-hat-white-front-6861cf08e0a36.webp",
    link: "/products/caps",
    category: "caps",
    comingSoon: false,
  },
  {
    title: "Cozy Hoodies",
    description: "Stay warm and stylish with our hoodie collection.",
    image: "/products-img/hoddie-2.webp",
    link: "/products/hoodies",
    category: "hoodies",
    comingSoon: true,
  },
  {
    title: "Unique Mugs",
    description: "Start your day with a mug from our collection.",
    image: "https://auth.hyperwear.io/storage/v1/object/public/products-images/hyperliquid-mug/white-glossy-mug-white-11-oz-front-view-6861d2a30720b.webp",
    link: "/products/mugs",
    category: "accessories",
    comingSoon: false,
  },
  {
    title: "Cuddly Plushies",
    description: "Soft, cuddly, and ready for a new home.",
    image: "/products-img/plush.jpeg",
    link: "/products/plushies",
    category: "plushies",
    comingSoon: true,
  },
  {
    title: "Classic Tees",
    description: "Essential tees for every wardrobe.",
    image: "https://auth.hyperwear.io/storage/v1/object/public/hyperwear-images/DSC02232.jpg",
    link: "/products/tees",
    category: "t-shirts",
    comingSoon: false,
  },
  {
    title: "iPhone Cases",
    description: "Protect your phone in style with our exclusive cases.",
    image:
      "https://auth.hyperwear.io/storage/v1/object/public/products-images/hyperliquid-iphone-case-purr-edition/clear-case-for-iphone-iphone-14-pro-lifestyle-4-6861d324193c2.webp",
    link: "/iphone-case",
    category: "phone-cases",
    comingSoon: false,
  },
];

const CollectionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-gray-900">
            Our Collections
          </h1>
          <p className="font-body mx-auto mt-4 max-w-2xl text-xl text-gray-500">
            Discover our carefully curated collections, each with a unique style and story.
          </p>
        </div>
        
        <CollectionsClient images={carouselImages} collections={collections} />
      </div>
    </div>
  );
};

export default CollectionsPage;
