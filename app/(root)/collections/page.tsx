"use client";

import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { Button } from "@/components/ui/Button";
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
        <ThreeDPhotoCarousel images={collections.map((c) => c.image)} />

        <div className="mt-20 grid gap-16 lg:grid-cols-3 lg:gap-x-12">
          {collections.map((collection) => (
            <div
              key={collection.title}
              className="transform overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
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
                  <Link href={collection.link}>
                    <Button
                      variant="outline"
                      className="rounded-full font-semibold"
                    >
                      View Collection
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button className="bg-primary hover:bg-secondary rounded-full font-semibold text-white hover:text-black">
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
