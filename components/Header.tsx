"use client";

import { Cart } from "@/components/Cart";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import * as React from "react";
import { DesktopNav } from "./header/DesktopNav";
import { Logo } from "./header/Logo";
import { MobileNav } from "./header/MobileNav";
import { SearchBar } from "./header/SearchBar";
import { UserAccountNav } from "./header/UserAccountNav";

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
      <div className="flexmax-w-7xl bg-primary mx-auto rounded-full border-2 border-white/10 shadow-lg ring-1 ring-white backdrop-blur-xl">
        <div className="px-4">
          <div className="flex h-24 items-center">
            {/* Left Section */}
            <div className="flex flex-1 items-center justify-start">
              <DesktopNav />
            </div>
            {/* Center Section (Logo) */}
            <Logo />
            {/* Right Section */}
            <div className="flex flex-1 items-center justify-end">
              <div className="flex items-center space-x-4">
                <SearchBar />
                <UserAccountNav user={user} />
                <Cart />
                <Link href="/products">
                  <ShimmerButton className="hidden md:flex" />
                </Link>
                <MobileNav user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
