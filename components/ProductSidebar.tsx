import { ProductFilters } from "./ProductFilters";

interface ProductSidebarProps {
  categories: string[];
}

export default function ProductSidebar({ categories }: ProductSidebarProps) {
  return (
    <aside className="md:col-span-1">
      <div className="sticky top-36">
        <ProductFilters categories={categories} />
      </div>
    </aside>
  );
}
