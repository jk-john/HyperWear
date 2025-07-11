"use client";

import Image from "next/image";
import Link from "next/link";
import { Socials } from "./Socials";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-t bg-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/HYPE.svg"
                alt="HyperWear Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">HyperWear</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Official HyperLiquid merchandise store designed by the community, for the community. Premium apparel and accessories for HyperLiquid fans worldwide.
            </p>
            <div className="mt-6">
              <Socials />
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-3">
            {[
              {
                title: "Featured Collections",
                links: [
                  { name: "HyperLiquid Merchandise", href: "/hyperliquid-merchandise" },
                  { name: "HyperLiquid T-Shirts", href: "/hyperliquid-tshirts" },
                  { name: "HyperLiquid Mugs", href: "/hyperliquid-mugs" },
                  { name: "All Products", href: "/products" },
                  { name: "Collections", href: "/collections" },
                ],
              },
              {
                title: "Products",
                links: [
                  "Classic Unisex T-Shirt",
                  "Classic Cap", 
                  "Women's Tank Top",
                  "Men's Tank Top",
                  "Mug",
                  "iPhone Case",
                ],
              },
              {
                title: "Informations",
                links: [
                  "Size Guide",
                  "Shipping Info",
                  "Care Instructions",
                  "Returns and Refunds Policy",
                  "Taxes and Duties",
                  "FAQ",
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="mb-5 text-lg font-bold text-white">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => {
                    // Handle both string links and object links
                    if (typeof link === 'object') {
                      return (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-white/70 transition-colors duration-200 hover:text-white font-medium"
                          >
                            {link.name}
                          </Link>
                        </li>
                      );
                    }
                    
                    // Handle legacy string links
                    return (
                      <li key={link}>
                        <Link
                          href={`/${link
                            .toLowerCase()
                            .replace(/'/g, "")
                            .replace(/\s+/g, "-")}`}
                          className="text-white/70 transition-colors duration-200 hover:text-white"
                        >
                          {link}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            
            {/* Company Section */}
            <div>
              <h4 className="mb-5 text-lg font-bold text-white">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Careers", "Support", "Community"].map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-12">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
              <p className="text-sm text-white/70">
                © {currentYear} HyperWear.io. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <Link
                  href="/privacy-policy"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/cookie-policy"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <span>🔒</span>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <span>🚚</span>
                <span>Free Shipping $60+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
