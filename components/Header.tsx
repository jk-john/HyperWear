"use client";

import { Cart } from "@/components/Cart";
import { Logo } from "@/components/header/Logo";
import { Navigation } from "@/components/header/Navigation";
import { SearchBar } from "@/components/header/SearchBar";
import { UserAccountNav } from "@/components/header/UserAccountNav";
import ShimmerButton from "@/components/ui/ShimmerButton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";
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

  // Close mobile menu on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Additional safety: close menu on any navigation event
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    let originalPushState: typeof window.history.pushState | null = null;
    let originalReplaceState: typeof window.history.replaceState | null = null;

    // Listen for route changes (works with both router.push and Link clicks)
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleRouteChange);
      
      // Store original methods
      originalPushState = window.history.pushState;
      originalReplaceState = window.history.replaceState;
      
      // Override history methods to detect navigation
      window.history.pushState = function(...args) {
        handleRouteChange();
        return originalPushState!.apply(window.history, args);
      };
      
      window.history.replaceState = function(...args) {
        handleRouteChange();
        return originalReplaceState!.apply(window.history, args);
      };
      
      window.addEventListener('popstate', handleRouteChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleRouteChange);
        window.removeEventListener('popstate', handleRouteChange);
        // Restore original methods
        if (originalPushState) {
          window.history.pushState = originalPushState;
        }
        if (originalReplaceState) {
          window.history.replaceState = originalReplaceState;
        }
      }
    };
  }, []);

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
        <div className="flex items-center space-x-3 md:hidden">
          <Cart />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 -mr-2 touch-manipulation">
                <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-full bg-white p-0 overflow-hidden flex flex-col max-h-[100vh]">
              <SheetHeader className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-100">
                <SheetTitle className="flex items-center justify-between px-4 py-4">
                  <Logo />
                  <SheetClose asChild>
                    <button className="p-2 -mr-2 touch-manipulation hover:bg-gray-100 rounded-full transition-colors">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </button>
                  </SheetClose>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <Navigation isMobile />
                <div className="w-full">
                  <SearchBar />
                </div>
              </div>
              <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-white">
                <div className="flex flex-col gap-3 w-full">
                  <UserAccountNav user={user} displayMode="button" />
                  <Link href="/products" className="w-full">
                    <ShimmerButton className="w-full h-12 text-base touch-manipulation">Shop Now</ShimmerButton>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
