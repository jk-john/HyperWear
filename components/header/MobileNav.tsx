"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ShimmerButton from "@/components/ui/ShimmerButton";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Menu, Search, User } from "lucide-react";
import Link from "next/link";

interface MobileNavProps {
  user: SupabaseUser | null;
}

export const MobileNav = ({ user }: MobileNavProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-full text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white md:hidden"
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
              <ShimmerButton className="mt-4 w-full" />
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
