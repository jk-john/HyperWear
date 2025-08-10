import { ProductFilters } from "./ProductFilters";

interface ProductSidebarProps {
  categories: string[];
  isMobile?: boolean;
}

export default function ProductSidebar({
  categories,
  isMobile = false,
}: ProductSidebarProps) {
  if (isMobile) {
    return <ProductFilters categories={categories} isMobile={isMobile} />;
  }

  // Desktop inline filters
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <ProductFilters categories={categories} isMobile={isMobile} />
    </div>
  );
}
