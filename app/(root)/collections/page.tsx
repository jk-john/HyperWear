"use client";

import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const CollectionsPage = () => {
  const collections = [
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-gray-900 font-display tracking-tight">
            Our Collections
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 font-body">
            Discover our carefully curated collections, each with a unique style
            and story.
          </p>
        </div>
        <ThreeDPhotoCarousel images={collections.map((c) => c.image)} />

        <div className="mt-20 grid gap-16 lg:grid-cols-3 lg:gap-x-12">
          {collections.map((collection) => (
            <div
              key={collection.title}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            >
              <Image
                src={collection.image}
                height="400"
                width="400"
                className="h-60 w-full object-cover"
                alt={collection.title}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 font-display">
                  {collection.title}
                </h3>
                <p className="mt-2 text-gray-600 font-body">
                  {collection.description}
                </p>
                <div className="mt-6 flex justify-between items-center">
                  <Link href={collection.link}>
                    <Button
                      variant="outline"
                      className="rounded-full font-semibold"
                    >
                      View Collection
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button className="rounded-full bg-primary text-white hover:bg-secondary hover:text-black font-semibold">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
