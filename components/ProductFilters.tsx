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
  isMobile?: boolean;
};

export function ProductFilters({
  categories,
  isMobile = false,
}: ProductFiltersProps) {
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

  const selectTriggerClassName = isMobile 
    ? "h-12 border-2 border-gray-200 bg-white hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200" 
    : "h-14 border-2 border-gray-200 bg-white hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200";

  const titleClassName = isMobile
    ? "mb-4 text-center text-lg font-bold text-gray-900"
    : "mb-4 text-lg font-bold text-gray-900";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className={titleClassName}>Sort by</h3>
        <Select
          onValueChange={handleSortChange}
          defaultValue={
            searchParams.get("sortBy") && searchParams.get("order")
              ? `${searchParams.get("sortBy")}-${searchParams.get("order")}`
              : "none"
          }
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
            <SelectItem 
              value="none" 
              className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
            >
              Default
            </SelectItem>
            <SelectItem 
              value="price-asc" 
              className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
            >
              Price: Low to High
            </SelectItem>
            <SelectItem 
              value="price-desc" 
              className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
            >
              Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className={titleClassName}>Gender</h3>
        <Select
          onValueChange={(value) => handleFilterChange("gender", value)}
          defaultValue={searchParams.get("gender") ?? "all"}
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
            <SelectItem 
              value="all" 
              className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
            >
              All Genders
            </SelectItem>
            <SelectItem 
              value="men" 
              className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
            >
              Men
            </SelectItem>
            <SelectItem 
              value="women" 
              className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
            >
              Women
            </SelectItem>
            <SelectItem 
              value="unisex" 
              className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
            >
              Unisex
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className={titleClassName}>Category</h3>
        <Select
          onValueChange={(value) => handleFilterChange("category", value)}
          defaultValue={searchParams.get("category") ?? "all"}
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
            <SelectItem 
              value="all" 
              className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
            >
              All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="focus:bg-gray-100 hover:bg-gray-50 text-gray-900 font-medium py-3"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
