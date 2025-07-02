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

  const selectTriggerClassName = isMobile ? "h-10" : "h-12";
  const titleClassName = isMobile
    ? "mb-2 text-center text-lg font-semibold"
    : "mb-2 text-lg font-semibold";

  return (
    <div className="flex flex-col items-center gap-6">
      <div>
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
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white text-center">
            <SelectItem value="none" className="justify-center">
              Default
            </SelectItem>
            <SelectItem value="price-asc" className="justify-center">
              Price: Low to High
            </SelectItem>
            <SelectItem value="price-desc" className="justify-center">
              Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className={titleClassName}>Gender</h3>
        <Select
          onValueChange={(value) => handleFilterChange("gender", value)}
          defaultValue={searchParams.get("gender") ?? "all"}
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Filter by gender" />
          </SelectTrigger>
          <SelectContent className="bg-white text-center">
            <SelectItem value="all" className="justify-center">
              All Genders
            </SelectItem>
            <SelectItem value="men" className="justify-center">
              Men
            </SelectItem>
            <SelectItem value="women" className="justify-center">
              Women
            </SelectItem>
            <SelectItem value="unisex" className="justify-center">
              Unisex
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className={titleClassName}>Category</h3>
        <Select
          onValueChange={(value) => handleFilterChange("category", value)}
          defaultValue={searchParams.get("category") ?? "all"}
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="text-center">
            <SelectItem value="all" className="justify-center">
              All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="justify-center"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
