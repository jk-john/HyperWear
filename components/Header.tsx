"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// TODO: The search bar is not working
// TODO: The cart icon is not working
// TODO: The user icon is not working
// TODO: The shop now button is not working
// TODO: The mobile menu is not developed
// TODO: The navigation bar is not working

const Header = () => {
  const [cartItems] = useState(3); // Mock cart count

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full shadow-lg ring-1 ring-black/5">
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
              <div className="text-4xl font-bold font-display text-primary">
                HyperWear
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {["Shirts", "Caps", "Accessories", "Collections"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="relative text-[#072723] hover:text-primary font-body font-normal text-base leading-6 px-4 py-2 rounded-lg transition-colors duration-300 group"
                >
                  {item}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-2/3"></span>
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-8">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex h-11 w-11 text-primary/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-full"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex h-11 w-11 text-primary/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-full"
              >
                <User className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative h-11 w-11 text-primary/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-full"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center p-0 bg-accent text-primary text-xs font-bold rounded-full border-2 border-white">
                    {cartItems}
                  </Badge>
                )}
              </Button>

              {/* Shop Now Button */}
              <Button className="hidden md:flex bg-primary text-white hover:bg-secondary hover:text-black font-semibold px-6 h-11 rounded-full transition-all duration-300 font-body">
                Shop Now
              </Button>

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
                    {["Shirts", "Caps", "Accessories", "Collections"].map(
                      (item) => (
                        <a
                          key={item}
                          href="#"
                          className="text-primary/80 hover:text-primary font-body font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          {item}
                        </a>
                      )
                    )}

                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-body text-primary/80 hover:text-primary hover:bg-primary/5 rounded-lg"
                      >
                        <Search className="h-5 w-5 mr-3" />
                        Search
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-body text-primary/80 hover:text-primary hover:bg-primary/5 rounded-lg"
                      >
                        <User className="h-5 w-5 mr-3" />
                        Account
                      </Button>
                      <Button className="w-full bg-secondary text-primary hover:bg-primary hover:text-white font-semibold mt-4 h-12 rounded-full transition-colors">
                        Shop Now
                      </Button>
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
