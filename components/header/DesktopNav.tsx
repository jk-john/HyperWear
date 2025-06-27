"use client";

import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    title: "T-shirts",
    href: "/products?category=T-shirts",
    description: "Show your support in style with our premium tees.",
    img: "/products-img/tee-shirt.webp",
  },
  {
    title: "Shorts",
    href: "/products?category=Shorts",
    description: "Comfortable and stylish shorts for any occasion.",
    img: "/products-img/hoddie-2.webp",
  },
  {
    title: "Caps",
    href: "/products?category=Caps",
    description: "Top off your look with our signature caps.",
    img: "/products-img/caps-2.jpg",
  },
  {
    title: "Accessories",
    href: "/products?category=Accessories",
    description: "The perfect accessories to complete your fit.",
    img: "/products-img/mug.webp",
  },
  {
    title: "Plushies",
    href: "/products?category=Plushies",
    description: "Collectible plushies for the true fans.",
    img: "/products-img/plush.jpeg",
  },
];

export const DesktopNav = () => {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <span className="text-primary bg-white">Products</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-full grid-cols-3 gap-4 bg-white p-4">
                {products.map((product) => (
                  <NavigationMenuLink asChild key={product.title}>
                    <Link
                      href={product.href}
                      className="group block rounded-lg border border-transparent p-3 transition-all hover:border-gray-200 hover:shadow-md"
                    >
                      <div className="relative mb-2 h-24 w-full overflow-hidden rounded-md">
                        <Image
                          src={product.img}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {product.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/collections" className="px-4 py-2">
                <span className="after:bg-primary relative after:absolute after:-top-1 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                  Collections
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="px-4 py-2">
                <span className="after:bg-primary relative after:absolute after:-top-1 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                  New Arrivals
                  <Badge
                    variant="secondary"
                    className="absolute -top-5 -right-6 animate-pulse"
                  >
                    Soon
                  </Badge>
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/community" className="px-4 py-2">
                <span className="after:bg-primary relative after:absolute after:-top-1 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                  Community
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
