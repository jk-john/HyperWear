"use client";

import { Cart } from "@/components/Cart";
import { Logo } from "@/components/header/Logo";
import { Navigation } from "@/components/header/Navigation";
import { SearchBar } from "@/components/header/SearchBar";
import { UserAccountNav } from "@/components/header/UserAccountNav";
import ShimmerButton from "@/components/ui/ShimmerButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center md:flex">
          <Navigation />
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center space-x-4 md:flex">
          <SearchBar />
          <UserAccountNav user={user} />
          <Cart />
          <Link href="/products">
            <ShimmerButton>Shop Now</ShimmerButton>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button>
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-full bg-white sm:w-3/4">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col items-center space-y-4 px-4">
                <Navigation isMobile />
                <div className="w-full">
                  <SearchBar />
                </div>
                <UserAccountNav user={user} displayMode="button" />
                <Cart displayMode="button" />
                <Link href="/products" className="w-full">
                  <ShimmerButton className="w-full">Shop Now</ShimmerButton>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
