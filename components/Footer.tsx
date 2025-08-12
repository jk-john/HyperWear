"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Socials } from "./Socials";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(2025); // Default fallback

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="text-white" style={{ background: 'linear-gradient(to bottom right, var(--color-forest), var(--color-dark), var(--color-deep))' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <span 
                className="text-2xl font-bold bg-clip-text font-display text-white"
              >
                HyperWear
              </span>
            </Link>
            <p className="leading-relaxed mb-8 max-w-md" style={{ color: 'var(--color-accent)' }}>
              {`We're designing premium merch to reflect and empower the unique spirit of the HyperLiquid community. 
              HyperWear is an independent community project inspired by HyperLiquid.`}
            </p>
            <div className="mb-8">
              <p className="text-sm mb-4" style={{ color: 'var(--color-light)' }}>Follow us</p>
              <Socials />
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Featured Collections */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white relative">
                  Featured Collections
                  <div 
                    className="absolute -bottom-1 left-0 w-8 h-0.5"
                    style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
                  ></div>
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: "HyperLiquid Merchandise", href: "/hyperliquid-merchandise" },
                    { name: "HyperLiquid T-Shirts", href: "/hyperliquid-tshirts" },
                    { name: "HyperLiquid Caps", href: "/hyperliquid-caps" },
                    { name: "All Products", href: "/products" },
                    { name: "Collections", href: "/collections" },
                  ].map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="transition-colors duration-200 flex items-center group"
                        style={{ color: 'var(--color-accent)' }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'var(--color-secondary)'}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'var(--color-accent)'}
                      >
                        <span 
                          className="w-1 h-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ backgroundColor: 'var(--color-secondary)' }}
                        ></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Products */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white relative">
                  Products
                  <div 
                    className="absolute -bottom-1 left-0 w-8 h-0.5"
                    style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
                  ></div>
                </h3>
                <ul className="space-y-3">
                  {[
                    "Classic Unisex T-Shirt",
                    "Classic Cap",
                    "Women's Tank Top",
                    "Men's Tank Top",
                    "Mug",
                    "iPhone Case",
                  ].map((link) => (
                    <li key={link}>
                      <Link
                        href={`/${link
                          .toLowerCase()
                          .replace(/'/g, "")
                          .replace(/\s+/g, "-")}`}
                        className="transition-colors duration-200 flex items-center group"
                        style={{ color: 'var(--color-accent)' }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'var(--color-secondary)'}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'var(--color-accent)'}
                      >
                        <span 
                          className="w-1 h-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ backgroundColor: 'var(--color-secondary)' }}
                        ></span>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support & Company Combined for mobile, separate for desktop */}
              <div className="space-y-8">
                {/* Informations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white relative">
                    Support
                    <div 
                      className="absolute -bottom-1 left-0 w-8 h-0.5"
                      style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
                    ></div>
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Size Guide",
                      "Shipping Info", 
                      "Care Instructions",
                      "Returns and Refunds Policy",
                      "FAQ",
                    ].map((link) => (
                      <li key={link}>
                        <Link
                          href={`/${link
                            .toLowerCase()
                            .replace(/'/g, "")
                            .replace(/\s+/g, "-")}`}
                          className="transition-colors duration-200 flex items-center group"
                          style={{ color: 'var(--color-accent)' }}
                          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'var(--color-secondary)'}
                          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'var(--color-accent)'}
                        >
                          <span 
                            className="w-1 h-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ backgroundColor: 'var(--color-secondary)' }}
                          ></span>
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div className="space-y-4 lg:hidden">
                  <h3 className="text-lg font-semibold text-white relative">
                    Company
                    <div 
                      className="absolute -bottom-1 left-0 w-8 h-0.5"
                      style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
                    ></div>
                  </h3>
                  <ul className="space-y-3">
                    {["About Us", "Careers", "Support", "Community"].map((link) => (
                      <li key={link}>
                        <Link
                          href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                          className="transition-colors duration-200 flex items-center group"
                          style={{ color: 'var(--color-accent)' }}
                          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'var(--color-secondary)'}
                          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'var(--color-accent)'}
                        >
                          <span 
                            className="w-1 h-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ backgroundColor: 'var(--color-secondary)' }}
                          ></span>
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Company section for desktop only */}
            <div className="hidden lg:block mt-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white relative">
                  Company
                  <div 
                    className="absolute -bottom-1 left-0 w-8 h-0.5"
                    style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
                  ></div>
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  {["About Us", "Careers", "Support", "Community"].map((link) => (
                    <li key={link}>
                      <Link
                        href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className="transition-colors duration-200 flex items-center group"
                        style={{ color: 'var(--color-accent)' }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-secondary)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-accent)'}
                      >
                        <span 
                          className="w-1 h-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ backgroundColor: 'var(--color-secondary)' }}
                        ></span>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8" style={{ borderTop: `1px solid var(--color-emerald)` }}>
          <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            {/* Copyright and Legal */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-8">
              <p className="text-sm" style={{ color: 'var(--color-light)' }}>
                © {currentYear} HyperWear.io. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link
                  href="/privacy-policy"
                  className="transition-colors duration-200"
                  style={{ color: 'var(--color-light)' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-secondary)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-light)'}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="transition-colors duration-200"
                  style={{ color: 'var(--color-light)' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-secondary)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-light)'}
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookie-policy"
                  className="transition-colors duration-200"
                  style={{ color: 'var(--color-light)' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-secondary)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-light)'}
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
              <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-light)' }}>
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'linear-gradient(to right, var(--color-mint), var(--color-secondary))' }}
                >
                  <span className="text-white">🔒</span>
                </div>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-light)' }}>
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-emerald))' }}
                >
                  <span className="text-white">🚚</span>
                </div>
                <span>Free Shipping $60+</span>
              </div>
              <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-light)' }}>
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-mint))' }}
                >
                  <span className="text-white">💫</span>
                </div>
                <span>Community Made</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
