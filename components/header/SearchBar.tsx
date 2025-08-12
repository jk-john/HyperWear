"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
  const router = useRouter();

  return (
    <form
      action={(formData) => {
        const query = formData.get("q");
        if (typeof query === "string" && query.trim() !== "") {
          if (typeof window !== 'undefined') {
            router.push(`/search?q=${encodeURIComponent(query)}`);
          }
        }
      }}
      className="hidden items-center md:flex"
    >
      <div className="relative">
        <Input
          type="search"
          name="q"
          placeholder="Search..."
          className="text-primary placeholder:text-primary/60 h-11 rounded-full bg-gray-100 pr-4 pl-10"
        />
        <Search className="text-primary/80 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
      </div>
    </form>
  );
};
