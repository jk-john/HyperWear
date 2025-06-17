"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Mail, Twitter, Youtube } from "lucide-react";

// TODO: The footer is not working

const Footer = () => {
  return (
    <footer className="bg-dark2 text-white font-body">
      <div className="container mx-auto px-6 py-16">
        {/* Newsletter Section */}
        <div className="text-center mb-20">
          <h3 className="text-4xl font-display font-bold mb-4">
            Stay in the Loop
          </h3>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Crypto was Fragmented. HyperLiquid made it United. Wear the
            Movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-dark1 h-12 border-tealMid/50 text-white placeholder:text-white/40 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
            <Button className="bg-white text-jungle font-bold h-12 px-8 rounded-lg hover:bg-cream/90 transition-all duration-300 shadow-lg shadow-accent/20 transform hover:-translate-y-1">
              <Mail className="h-5 w-5 mr-2" />
              Subscribe
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <div className="text-3xl font-display font-bold mb-4">
              <span>HyperWear</span>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              We&apos;re designing premium merch to reflect and empower the
              unique spirit of the Hyperliquid community.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-dark1 rounded-lg h-11 w-11 transform hover:scale-110 transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-dark1 rounded-lg h-11 w-11 transform hover:scale-110 transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-dark1 rounded-lg h-11 w-11 transform hover:scale-110 transition-all duration-300"
              >
                <Youtube className="h-5 w-5" />
              </Button>
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
              <h4 className="font-bold text-lg mb-5 text-white">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark1 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © 2025 HyperWear. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
