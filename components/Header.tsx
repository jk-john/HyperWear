"use client";

import { Cart } from "@/components/Cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href || "/"}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Header = () => {
  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="flexmax-w-7xl mx-auto bg-white backdrop-blur-xl rounded-full shadow-lg ring-1 ring-black/5">
        <div className="px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="HyperWear"
                width={256}
                height={256}
                className="w-14 h-14 rounded-full"
              />
              <div className="text-4xl font-bold font-display text-primary hover:text-secondary transition-colors duration-300">
                <span className="text-jungle">Hyper</span>
                <span className="text-mint">Wear</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 gap-10">
              <NavigationMenu className=" bg-white/90 backdrop-blur-xl rounded-lg border-none px-4 py-2">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-body focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] font-body bg-white/90 backdrop-blur-xl rounded-lg  border-none">
                        <ListItem
                          href="/products/tee-shirts"
                          title="Tee-Shirts"
                        >
                          Re-discover the basics
                        </ListItem>
                        <ListItem href="/products/caps" title="Caps">
                          The best caps for your style
                        </ListItem>
                        <ListItem
                          href="/products/accessories"
                          title="Accessories"
                        >
                          Complete your look with our accessories
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href="/collections">Collections</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href="/new-arrivals">
                        <span className="relative">
                          New Arrivals
                          <Badge
                            variant="secondary"
                            className="absolute -top-5.5 -right-6 font-body animate-pulse"
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
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href="/community">Community</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-8 px-2 py-1 bg-white/90 backdrop-blur-xl rounded-lg border-none">
              <Link href="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-11 w-11 text-primary/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-full"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-11 w-11 text-primary/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Cart />

              {/* Shop Now Button */}
              <Link href="/products">
                <Button className="hidden md:flex bg-primary text-white hover:bg-secondary hover:text-black font-semibold px-6 h-11 rounded-full transition-all duration-300 font-body">
                  Shop Now
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-11 w-11 text-primary/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-full"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-white/95 backdrop-blur-xl"
                >
                  <nav className="flex flex-col space-y-2 mt-8">
                    <Link
                      href="/products/tee-shirts"
                      className="text-primary/80 hover:text-primary font-body font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Tee-Shirts
                    </Link>
                    <Link
                      href="/products/caps"
                      className="text-primary/80 hover:text-primary font-body font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Caps
                    </Link>
                    <Link
                      href="/products/accessories"
                      className="text-primary/80 hover:text-primary font-body font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Accessories
                    </Link>
                    <Link
                      href="/collections"
                      className="text-primary/80 hover:text-primary font-body font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Collections
                    </Link>

                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <Link href="/search">
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-body text-primary/80 hover:text-primary hover:bg-primary/5 rounded-lg"
                        >
                          <Search className="h-5 w-5 mr-3" />
                          Search
                        </Button>
                      </Link>
                      <Link href="/sign-in">
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-body text-primary/80 hover:text-primary hover:bg-primary/5 rounded-lg"
                        >
                          <User className="h-5 w-5 mr-3" />
                          Account
                        </Button>
                      </Link>
                      <Link href="/products">
                        <Button className="w-full bg-secondary text-primary hover:bg-primary hover:text-white font-semibold mt-4 h-12 rounded-full transition-colors">
                          Shop Now
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
