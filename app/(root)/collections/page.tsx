"use client";

import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const CollectionsPage = () => {
  const carouselImages = [
    "/persons/girl-front.png",
    "/persons/men-front.png",
    "/persons/men-caps-front.png",
    "/persons/mugs-front.png",
  ];

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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-gray-900">
            Our Collections
          </h1>
          <p className="font-body mx-auto mt-4 max-w-2xl text-xl text-gray-500">
            Discover our carefully curated collections, each with a unique style
            and story.
          </p>
        </div>
        <ThreeDPhotoCarousel images={carouselImages} />

        <div className="mt-20 grid gap-16 lg:grid-cols-3 lg:gap-x-12">
          {collections.map((collection) => (
            <div
              key={collection.title}
              className="relative transform overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <Badge
                variant="secondary"
                className="bg-secondary text-primary absolute top-2 right-2"
              >
                Coming Soon
              </Badge>
              <Image
                src={collection.image}
                height="400"
                width="400"
                className="h-60 w-full object-cover"
                alt={collection.title}
              />
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-gray-900">
                  {collection.title}
                </h3>
                <p className="font-body mt-2 text-gray-600">
                  {collection.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    className="cursor-not-allowed rounded-full font-semibold opacity-60"
                    disabled
                  >
                    View Collection
                  </Button>
                  <Button
                    className="bg-primary hover:bg-secondary cursor-not-allowed rounded-full font-semibold text-white opacity-60 hover:text-black"
                    disabled
                  >
                    Shop Now
                  </Button>
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
