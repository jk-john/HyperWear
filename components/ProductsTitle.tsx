"use client";

import { type ClassValue, clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StylishTitleProps {
  title?: string;
  className?: string;
  titleClassName?: string;
}

const StylishTitle: React.FC<StylishTitleProps> = ({
  title = "Stay Liquid, Wear Hyper.",
  className,
  titleClassName,
}) => {
  return (
    <div className={cn("space-y-4 text-center", className)}>
      <h1
        className={cn(
          "bg-clip-text text-4xl font-bold text-transparent md:text-6xl lg:text-7xl",
          "font-display",
          "from-forest via-forest/80 to-forest bg-gradient-to-r",
          titleClassName,
        )}
      >
        {title}
      </h1>
    </div>
  );
};

export default StylishTitle;
