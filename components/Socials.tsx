import { Button } from "@/components/ui/button";
import { Instagram, Twitter } from "lucide-react";

export function Socials() {
  return (
    <div className="flex space-x-3">
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="text-accent hover:bg-dark1 h-11 w-11 transform rounded-lg transition-all duration-300 hover:scale-110 hover:text-white"
      >
        <a
          href="https://x.com/wear_hyper"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-5 w-5" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="text-accent hover:bg-dark1 h-11 w-11 transform rounded-lg transition-all duration-300 hover:scale-110 hover:text-white"
      >
        <a
          href="https://www.instagram.com/wear_hyper/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}
