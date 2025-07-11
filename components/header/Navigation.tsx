"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const components: {
  title: string;
  href: string;
  src: string;
  description: string;
  priority?: boolean;
}[] = [
  {
    title: "HyperLiquid T-Shirts",
    href: "/hyperliquid-tshirts",
    src: "/products-img/tee-shirt.webp",
    description: "Premium HyperLiquid tees designed by the community",
    priority: true,
  },
  {
    title: "HyperLiquid Mugs",
    href: "/hyperliquid-mugs", 
    src: "/products-img/mug.webp",
    description: "High-quality ceramic mugs for HyperLiquid fans",
    priority: true,
  },
  {
    title: "T-Shirts",
    href: "/products?category=t-shirts",
    src: "/products-img/tee-shirt.webp",
    description: "Re-discover the basics",
  },
  {
    title: "Shorts",
    href: "/products?category=shorts",
    src: "/products-img/short-front.png",
    description: "Comfort and style for every day.",
  },
  {
    title: "Caps",
    href: "/products?category=caps",
    src: "/products-img/caps-2.jpg",
    description: "The best caps for your style.",
  },
  {
    title: "Accessories",
    href: "/products?category=accessories",
    src: "/products-img/mug.webp",
    description: "Complete your look with our accessories.",
  },
  {
    title: "Plushies",
    href: "/products?category=plushies",
    src: "/products-img/plush.jpeg",
    description: "The best plushies for your home and office.",
  },
];

export function Navigation({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-4">
        <h3 className="text-lg font-bold">Featured</h3>
        <ul className="flex flex-col space-y-2 pl-4">
          <li>
            <Link
              href="/hyperliquid-merchandise"
              className="flex items-center gap-x-1 hover:underline font-medium text-primary"
            >
              HyperLiquid Merchandise
            </Link>
          </li>
          <li>
            <Link
              href="/hyperliquid-tshirts"
              className="flex items-center gap-x-1 hover:underline font-medium text-primary"
            >
              HyperLiquid T-Shirts
            </Link>
          </li>
          <li>
            <Link
              href="/hyperliquid-mugs"
              className="flex items-center gap-x-1 hover:underline font-medium text-primary"
            >
              HyperLiquid Mugs
            </Link>
          </li>
        </ul>
        <h3 className="text-lg font-bold">Products</h3>
        <ul className="flex flex-col space-y-2 pl-4">
          {components.filter(c => !c.priority).map((component) => {
            const isComingSoon =
              component.title === "Shorts" || component.title === "Plushies";
            return (
              <li
                key={component.title}
                className={cn(isComingSoon && "cursor-not-allowed opacity-60")}
              >
                <Link
                  href={isComingSoon ? "#!" : component.href}
                  onClick={(e) => {
                    if (isComingSoon) {
                      e.preventDefault();
                    }
                  }}
                  className="flex items-center gap-x-1 hover:underline"
                >
                  {component.title}
                  {isComingSoon && (
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-primary"
                    >
                      Coming Soon
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/collections"
          className="text-lg font-medium hover:underline"
        >
          Collections
        </Link>
        <Link
          href="/new-arrivals"
          className="text-lg font-medium hover:underline"
        >
          New Arrivals
        </Link>
        <Link href="/community" className="text-lg font-medium hover:underline">
          Community
        </Link>
      </nav>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[900px] gap-3 bg-white p-6 md:w-[900px] md:grid-cols-2 lg:w-[900px]">
              {/* Featured SEO Pages */}
              <div className="col-span-2 mb-4">
                <h4 className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">Featured Collections</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Link
                    href="/hyperliquid-merchandise"
                    className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none group-hover:text-primary">HyperLiquid Merchandise</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Complete collection of official merchandise</p>
                  </Link>
                  <Link
                    href="/hyperliquid-tshirts"
                    className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none group-hover:text-primary">HyperLiquid T-Shirts</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Premium tees designed by the community</p>
                  </Link>
                  <Link
                    href="/hyperliquid-mugs"
                    className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none group-hover:text-primary">HyperLiquid Mugs</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">High-quality ceramic drinkware</p>
                  </Link>
                </div>
              </div>
              
              {/* Regular Product Categories */}
              <div className="col-span-2">
                <h4 className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">All Categories</h4>
                <div className="grid grid-cols-2 gap-3">
                  {components.filter(c => !c.priority).map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      src={component.src}
                      liClassName=""
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </div>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/collections">Collections</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/new-arrivals" className="flex items-center gap-x-1">
              <Badge
                variant="secondary"
                className="bg-secondary text-primary absolute -top-4 -right-4"
              >
                Coming Soon
              </Badge>
              New Arrivals
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/community">Community</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    href: string;
    src: string;
    liClassName?: string;
  }
>(({ className, title, children, href, src, liClassName, ...props }, ref) => {
  const isComingSoon = title === "Shorts" || title === "Plushies";
  
  return (
    <li className={liClassName}>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={isComingSoon ? "#!" : href}
          onClick={(e) => {
            if (isComingSoon) {
              e.preventDefault();
            }
          }}
          className={cn(
            "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isComingSoon && "cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            <Image
              src={src}
              alt={title}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <div className="text-sm font-medium leading-none flex items-center gap-2">
                {title}
                {isComingSoon && (
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-primary text-xs"
                  >
                    Coming Soon
                  </Badge>
                )}
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
