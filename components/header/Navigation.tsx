"use client";

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
    src: "/products-img/short-1/front.png",
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

export function Navigation() {
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
          <Link href="/collections" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Collections
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/new-arrivals" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              New Arrivals
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/community" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Community
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { src: string; liClassName?: string }
>(({ className, title, children, src, liClassName, ...props }, ref) => {
  return (
    <li className={liClassName}>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
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
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
