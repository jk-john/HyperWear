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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
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
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Header = () => {
  const [user, setUser] = React.useState<SupabaseUser | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="flexmax-w-7xl mx-auto rounded-full bg-white shadow-lg ring-1 ring-black/5 backdrop-blur-xl">
        <div className="px-4">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="HyperWear"
                width={256}
                height={256}
                className="h-14 w-14 rounded-full"
              />
              <div className="font-display text-primary hover:text-secondary text-4xl font-bold transition-colors duration-300">
                <span className="text-jungle">Hyper</span>
                <span className="text-mint">Wear</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-10 space-x-2 md:flex">
              <NavigationMenu className="rounded-lg border-none bg-white/90 px-4 py-2 backdrop-blur-xl">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-body outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="font-body grid w-[400px] gap-3 rounded-lg border-none bg-white/90 p-4 backdrop-blur-xl md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                            className="font-body absolute -top-5.5 -right-6 animate-pulse"
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
            <div className="flex items-center space-x-8 rounded-lg border-none bg-white/90 px-2 py-1 backdrop-blur-xl">
              <Link href="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary/80 hover:text-primary hover:bg-primary/5 hidden h-11 w-11 rounded-full transition-all duration-300 md:flex"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </Link>

              {user ? (
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary/80 hover:text-primary hover:bg-primary/5 hidden h-11 w-11 rounded-full transition-all duration-300 md:flex"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary/80 hover:text-primary hover:bg-primary/5 hidden h-11 w-11 rounded-full transition-all duration-300 md:flex"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              <Cart />

              {/* Shop Now Button */}
              <Link href="/products">
                <Button className="bg-primary hover:bg-secondary font-body hidden h-11 rounded-full px-6 font-semibold text-white transition-all duration-300 hover:text-black md:flex">
                  Shop Now
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary/80 hover:text-primary hover:bg-primary/5 h-11 w-11 rounded-full transition-all duration-300 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-white/95 backdrop-blur-xl"
                >
                  <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-2">
                    <Link
                      href="/products/tee-shirts"
                      className="text-primary/80 hover:text-primary font-body hover:bg-primary/5 rounded-lg px-4 py-3 font-medium transition-colors"
                    >
                      Tee-Shirts
                    </Link>
                    <Link
                      href="/products/caps"
                      className="text-primary/80 hover:text-primary font-body hover:bg-primary/5 rounded-lg px-4 py-3 font-medium transition-colors"
                    >
                      Caps
                    </Link>
                    <Link
                      href="/products/accessories"
                      className="text-primary/80 hover:text-primary font-body hover:bg-primary/5 rounded-lg px-4 py-3 font-medium transition-colors"
                    >
                      Accessories
                    </Link>
                    <Link
                      href="/collections"
                      className="text-primary/80 hover:text-primary font-body hover:bg-primary/5 rounded-lg px-4 py-3 font-medium transition-colors"
                    >
                      Collections
                    </Link>

                    <div className="space-y-2 border-t border-gray-200 pt-4">
                      <Link href="/search">
                        <Button
                          variant="ghost"
                          className="font-body text-primary/80 hover:text-primary hover:bg-primary/5 w-full justify-start rounded-lg"
                        >
                          <Search className="mr-3 h-5 w-5" />
                          Search
                        </Button>
                      </Link>
                      {user ? (
                        <Link href="/dashboard">
                          <Button
                            variant="ghost"
                            className="font-body text-primary/80 hover:text-primary hover:bg-primary/5 w-full justify-start rounded-lg"
                          >
                            <User className="mr-3 h-5 w-5" />
                            Dashboard
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/sign-in">
                          <Button
                            variant="ghost"
                            className="font-body text-primary/80 hover:text-primary hover:bg-primary/5 w-full justify-start rounded-lg"
                          >
                            <User className="mr-3 h-5 w-5" />
                            Account
                          </Button>
                        </Link>
                      )}
                      <Link href="/products">
                        <Button className="bg-secondary text-primary hover:bg-primary mt-4 h-12 w-full rounded-full font-semibold transition-colors hover:text-white">
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
