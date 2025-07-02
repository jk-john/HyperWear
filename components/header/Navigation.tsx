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
}[] = [
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
        <h3 className="text-lg font-bold">Products</h3>
        <ul className="flex flex-col space-y-2 pl-4">
          {components.map((component) => {
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
            <ul className="grid w-[800px] gap-3 bg-white p-4 md:w-[800px] md:grid-cols-2 lg:w-[800px]">
              {components.map((component, index) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  src={component.src}
                  liClassName={
                    components.length % 2 !== 0 &&
                    index === components.length - 1
                      ? "md:col-span-2 flex justify-center"
                      : ""
                  }
                >
                  {component.description}
                </ListItem>
              ))}
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
  React.ComponentPropsWithoutRef<"a"> & { src: string; liClassName?: string }
>(({ className, title, children, src, liClassName, href, ...props }, ref) => {
  const isComingSoon = title === "Shorts" || title === "Plushies";
  return (
    <li
      className={cn(
        "group hover:bg-secondary transform-gpu rounded-md transition-all duration-300 ease-in-out hover:scale-[1.02]",
        liClassName,
        isComingSoon && "cursor-not-allowed opacity-60",
      )}
    >
      <Link
        ref={ref}
        href={isComingSoon ? "#!" : (href ?? "")}
        onClick={(e) => {
          if (isComingSoon) {
            e.preventDefault();
          }
        }}
        className={cn(
          "focus:bg-primary focus:text-accent-foreground group-hover:text-primary relative block space-y-1 rounded-md p-3 leading-none no-underline outline-none select-none",
          className,
        )}
        {...props}
      >
        <div className="flex items-center space-x-4">
          <Image
            src={src}
            alt={title ?? ""}
            width={80}
            height={80}
            className="rounded-md"
          />
          <div>
            <div className="text-base leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-base leading-snug">
              {children}
            </p>
          </div>
        </div>
        {isComingSoon && (
          <Badge
            variant="secondary"
            className="bg-secondary text-primary absolute -top-2 right-0 translate-y-1/2 transform"
          >
            Coming Soon
          </Badge>
        )}
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";
