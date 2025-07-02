import { ProductFilters } from "./ProductFilters";

interface ProductSidebarProps {
  categories: string[];
  isMobile?: boolean;
}

export default function ProductSidebar({
  categories,
  isMobile = false,
}: ProductSidebarProps) {
  return (
    <aside className="mr-25 md:col-span-1">
      <div className="md:sticky md:top-36">
        <ProductFilters categories={categories} isMobile={isMobile} />
      </div>
    </aside>
  );
}
