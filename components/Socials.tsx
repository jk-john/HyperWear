import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import Link from "next/link";

export function Socials() {
  return (
    <div className="flex space-x-3">
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="text-accent hover:bg-dark1 h-11 w-11 transform rounded-lg transition-all duration-300 hover:scale-110 hover:text-white"
      >
        <Link
          href="https://x.com/wear_hyper"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-5 w-5" />
        </Link>
      </Button>
     
    </div>
  );
}
