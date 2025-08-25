"use client";

import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  colors: string[];
  selectedColor: string | undefined;
  onColorSelect: (color: string) => void;
}

export function ColorSwatch({
  colors,
  selectedColor,
  onColorSelect,
}: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorSelect(color)}
          className={cn(
            "h-8 w-8 rounded-full border-2 transition-transform duration-200 hover:scale-110",
            selectedColor === color
              ? "border-ring ring-2 ring-ring ring-offset-2"
              : "border-gray-300",
          )}
          style={{ backgroundColor: color.toLowerCase() }}
          aria-label={`Select ${color}`}
        />
      ))}
    </div>
  );
}
