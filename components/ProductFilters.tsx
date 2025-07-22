"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


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

  const currentCategory = searchParams.get("category");
  const currentSort = searchParams.get("sortBy");
  const currentOrder = searchParams.get("order");

  const handleFilterChange = (
    filterType: "category",
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

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentCategory || currentSort;

  const sortOptions = [
    { value: "price-asc", label: "Price: Low to High", icon: ArrowUp },
    { value: "price-desc", label: "Price: High to Low", icon: ArrowDown },
  ];

  const titleClassName = isMobile
    ? "mb-4 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider"
    : "mb-5 text-sm font-semibold text-gray-800 uppercase tracking-wider";

  const sortButtonClassName = (isActive: boolean) => {
    const baseClasses = "w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center border";
    const mobileClasses = isMobile ? "min-h-[44px]" : "min-h-[48px]";
    const activeClasses = isActive
      ? "bg-[var(--color-primary)] text-white shadow-lg border-[var(--color-primary)] hover:shadow-xl transform hover:-translate-y-0.5"
      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md";
    return `${baseClasses} ${mobileClasses} ${activeClasses}`;
  };

  const categoryButtonClassName = (isActive: boolean) => {
    const baseClasses = "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border";
    const mobileClasses = isMobile ? "min-w-[60px] text-xs" : "";
    const activeClasses = isActive
      ? "bg-[var(--color-primary)] text-white shadow-lg border-[var(--color-primary)] hover:shadow-xl transform hover:-translate-y-0.5"
      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md";
    return `${baseClasses} ${mobileClasses} ${activeClasses}`;
  };

  return (
    <div className={isMobile ? "space-y-6" : "space-y-8"}>
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className={`border-b border-gray-200 ${isMobile ? "pb-4" : "pb-6"}`}>
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-all duration-200 hover:bg-red-50 px-3 py-2 rounded-lg w-full justify-center lg:justify-start"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        </div>
      )}

      {/* Sort Options */}
      <div className="space-y-4">
        <h3 className={titleClassName}>Sort</h3>
        <div className={isMobile ? "space-y-2" : "space-y-3"}>
          <button
            onClick={() => handleSortChange("none")}
            className={sortButtonClassName(!currentSort)}
          >
            <span className="flex items-center gap-x-2 leading-none">
              <ArrowUpDown className="h-4 w-4 flex-shrink-0 align-middle" />
              <span className="whitespace-nowrap leading-none">Default</span>
            </span>
          </button>
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isActive = currentSort === option.value.split("-")[0] && currentOrder === option.value.split("-")[1];
            return (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={sortButtonClassName(isActive)}
              >
                <span className="flex items-center gap-x-2 leading-none">
                  <Icon className="h-4 w-4 flex-shrink-0 align-middle" />
                  <span className="whitespace-nowrap leading-none">{option.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <h3 className={titleClassName}>Category</h3>
        <div className={`flex flex-wrap ${isMobile ? "gap-2" : "gap-3"}`}>
          <button
            onClick={() => handleFilterChange("category", "all")}
            className={categoryButtonClassName(!currentCategory)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange("category", category)}
              className={categoryButtonClassName(currentCategory === category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all duration-200">
                {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
                <button
                  onClick={() => handleFilterChange("category", "all")}
                  className="ml-1 hover:text-green-800 hover:bg-green-200 rounded-full p-0.5 transition-all duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentSort && (
              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all duration-200">
                {sortOptions.find(s => s.value === `${currentSort}-${currentOrder}`)?.label || "Sorted"}
                <button
                  onClick={() => handleSortChange("none")}
                  className="ml-1 hover:text-purple-800 hover:bg-purple-200 rounded-full p-0.5 transition-all duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
