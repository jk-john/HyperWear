"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const IPHONE_MODELS = [
  "iPhone 17 Pro Max",
  "iPhone 17 Pro",
  "iPhone 17 Air",
  "iPhone 17",
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14 Plus",
  "iPhone 14",
  "iPhone 13 Pro Max",
  "iPhone 13 Pro",
  "iPhone 13",
  "iPhone 13 mini",
  "iPhone 12 Pro Max",
  "iPhone 12 Pro",
  "iPhone 12",
  "iPhone 12 mini",
  "iPhone 11 Pro Max",
  "iPhone 11 Pro",
  "iPhone 11",
  "iPhone XS Max",
  "iPhone XS",
  "iPhone XR",
  "iPhone X",
  "iPhone SE (3rd gen)",
  "iPhone SE (2nd gen)",
  "iPhone 8 Plus",
  "iPhone 8",
  "iPhone 7 Plus",
  "iPhone 7",
] as const;

export const ALL_IPHONE_MODELS = IPHONE_MODELS;

interface IPhoneModelSelectProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  disabled?: boolean;
}

export function IPhoneModelSelect({
  value,
  onValueChange,
  disabled = false,
}: IPhoneModelSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val === "null" ? undefined : val)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 hover:border-[var(--color-mint)] focus:border-[var(--color-mint)] focus:ring-[var(--color-mint)]/20 transition-all duration-200">
        <SelectValue placeholder="Choose your iPhone model" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700">
        {IPHONE_MODELS.map((model) => (
          <SelectItem
            key={model}
            value={model}
            className="hover:bg-[var(--color-light)] dark:hover:bg-[var(--color-emerald)]/20 focus:bg-[var(--color-light)] dark:focus:bg-[var(--color-emerald)]/20"
          >
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
