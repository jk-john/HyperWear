"use client";

import { Socials } from "@/components/Socials";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

// TODO: The footer is not working

const Footer = () => {
  return (
    <footer className="bg-dark2 font-body text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Newsletter Section */}
        <div className="mb-20 text-center">
          <h3 className="font-display mb-4 text-4xl font-bold">
            Stay in the Loop
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-white/70">
            Crypto was Fragmented. HyperLiquid made it United. Wear the
            Movement.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-dark1 border-tealMid/50 focus:ring-accent focus:border-accent h-12 rounded-lg text-white transition-all placeholder:text-white/40 focus:ring-2"
            />
            <Button className="text-jungle hover:bg-cream/90 shadow-accent/20 h-12 transform rounded-lg bg-white px-8 font-bold shadow-lg transition-all duration-300 hover:-translate-y-1">
              <Mail className="mr-2 h-5 w-5" />
              Subscribe
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="font-display mb-4 text-3xl font-bold">
              <span>HyperWear</span>
            </div>
            <p className="mb-8 pr-28 text-justify leading-relaxed text-white/70">
              We&apos;re designing premium merch to reflect and empower the
              unique spirit of the Hyperliquid community.
              <br />
              HyperWear is an independent community project inspired by
              HyperLiquid. It is not affiliated with or endorsed by HyperLiquid.
            </p>

            <div className="flex space-x-3">
              <Socials />
            </div>
          </div>

          {/* Links Columns */}

          {[
            {
              title: "Products",
              links: [
                "Performance Shirts",
                "Athletic Caps",
                "Training Hoodies",
                "Sport Accessories",
                "New Arrivals",
              ],
            },
            {
              title: "Support",
              links: [
                "Size Guide",
                "Shipping Info",
                "Care Instructions",
                "Returns & Refunds Policy",
                "FAQ",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Contact"],
            },
          ].map((column) => (
            <div key={column.title}>
              <h4 className="mb-5 text-lg font-bold text-white">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
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
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-dark1 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="mb-4 text-sm text-white/50 md:mb-0">
            © 2025 HyperWear. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-white/50">
            <Link href="#" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
