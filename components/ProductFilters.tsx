"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductFiltersProps = {
  categories: string[];
};

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (
    filterType: "gender" | "category",
    value: string,
  ) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === "all") {
      current.delete(filterType);
    } else {
      current.set(filterType, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (value === "none") {
      current.delete("sortBy");
      current.delete("order");
    } else {
      const [sortBy, order] = value.split("-");
      current.set("sortBy", sortBy);
      current.set("order", order);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Sort by</h3>
        <Select
          onValueChange={handleSortChange}
          defaultValue={
            searchParams.get("sortBy") && searchParams.get("order")
              ? `${searchParams.get("sortBy")}-${searchParams.get("order")}`
              : "none"
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="none">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Gender</h3>
        <Select
          onValueChange={(value) => handleFilterChange("gender", value)}
          defaultValue={searchParams.get("gender") ?? "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by gender" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="women">Women</SelectItem>
            <SelectItem value="unisex">Unisex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Category</h3>
        <Select
          onValueChange={(value) => handleFilterChange("category", value)}
          defaultValue={searchParams.get("category") ?? "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
