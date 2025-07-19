import CollectionsClient from "@/components/CollectionsClient";
import { Metadata } from "next";

interface Collection {
  title: string;
  description: string;
  image: string;
  link: string;
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

const collections: Collection[] = [
  {
    title: "Cool Caps",
    description: "Top off your look with our stylish caps.",
    image: "/products-img/caps-2.jpg",
    link: "/products/caps",
  },
  {
    title: "Cozy Hoodies",
    description: "Stay warm and stylish with our hoodie collection.",
    image: "/products-img/hoddie-2.webp",
    link: "/products/hoodies",
  },
  {
    title: "Unique Mugs",
    description: "Start your day with a mug from our collection.",
    image: "/products-img/mug-2.webp",
    link: "/products/mugs",
  },
  {
    title: "Cuddly Plushies",
    description: "Soft, cuddly, and ready for a new home.",
    image: "/products-img/plush.jpeg",
    link: "/products/plushies",
  },
  {
    title: "Classic Tees",
    description: "Essential tees for every wardrobe.",
    image: "/products-img/tee-shirt.webp",
    link: "/products/tees",
  },
  {
    title: "Stylish Hoodies",
    description: "Another look at our stylish hoodies.",
    image: "/products-img/hoodie.webp",
    link: "/products/hoodies",
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
            Discover our carefully curated collections, each with a unique style
            and story.
          </p>
        </div>
        
        <CollectionsClient images={carouselImages} collections={collections} />
      </div>
    </div>
  );
};

export default CollectionsPage;
