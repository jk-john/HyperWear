"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <form
      action={(formData) => {
        const query = formData.get("q");
        if (typeof query === "string" && query.trim() !== "") {
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
      }}
      className="hidden items-center md:flex"
    >
      <div className="relative">
        <Input
          type="search"
          name="q"
          placeholder="Search..."
          className="h-11 rounded-full bg-white/20 pr-4 pl-10 text-white placeholder:text-gray-300"
        />
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-300" />
      </div>
    </form>
  );
};
