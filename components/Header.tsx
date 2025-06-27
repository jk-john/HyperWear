"use client";

import { Cart } from "@/components/Cart";
import { DesktopNav } from "@/components/header/DesktopNav";
import { Logo } from "@/components/header/Logo";
import { MobileNav } from "@/components/header/MobileNav";
import { SearchBar } from "@/components/header/SearchBar";
import { UserAccountNav } from "@/components/header/UserAccountNav";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import * as React from "react";

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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center Section - Navigation */}
        <div className="hidden md:flex">
          <DesktopNav />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-4">
          <SearchBar />
          <UserAccountNav user={user} />
          <Cart />
          <Link href="/products">
            <ShimmerButton>Shop Now</ShimmerButton>
          </Link>
          <div className="md:hidden">
            <MobileNav user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
