"use client";

import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import ListItem from "./ListItem";

export const DesktopNav = () => {
  return (
    <nav className="hidden items-center gap-10 space-x-2 md:flex">
      <NavigationMenu className="rounded-lg border-none bg-transparent px-4 py-2 backdrop-blur-xl">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="font-body bg-transparent text-white outline-none hover:bg-white/10 focus:bg-white/10 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:bg-white/10">
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="font-body grid w-[400px] gap-3 rounded-lg border-none bg-white p-4 backdrop-blur-xl md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/products/tee-shirts" title="Tee-Shirts">
                  Re-discover the basics
                </ListItem>
                <ListItem href="/products/caps" title="Caps">
                  The best caps for your style.
                </ListItem>
                <ListItem href="/products/plushies" title="Plushies">
                  The best plushies for your home and office.
                </ListItem>
                <ListItem href="/products/accessories" title="Accessories">
                  Complete your look with our accessories
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={
                navigationMenuTriggerStyle() +
                " bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-transparent focus:text-white"
              }
            >
              <Link href="/collections">Collections</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={
                navigationMenuTriggerStyle() +
                " bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-transparent focus:text-white"
              }
            >
              <Link href="/">
                <span className="relative">
                  New Arrivals
                  <Badge
                    variant="secondary"
                    className="font-body absolute -top-5.5 -right-6 animate-pulse text-black"
                  >
                    Coming Soon
                  </Badge>
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={
                navigationMenuTriggerStyle() +
                " bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-transparent focus:text-white"
              }
            >
              <Link href="/community">Community</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
