import ProductGrid from "@/components/ProductGrid";
import ProductSidebar from "@/components/ProductSidebar";
import StylishTitle from "@/components/ProductsTitle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/server";
import { SlidersHorizontal } from "lucide-react";

type ProductsPageProps = {
  searchParams: {
    gender?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  };
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const supabase = createClient();
  const { gender, category, sortBy, order } = await searchParams;

  let query = supabase.from("products").select("*");

  if (gender) {
    query = query.eq("gender", gender);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (sortBy) {
    query = query.order(sortBy, {
      ascending: order !== "desc",
    });
  }

  const { data: products, error } = await query;

  if (error) {
    // Handle error appropriately
    console.error(error);
    return <div>Error loading products.</div>;
  }

  const categories = ["T-shirts", "Cups", "Caps", "Phone Cases", "Plushes"];
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <StylishTitle />
        </div>

        {/* Mobile Filters */}
        <div className="mb-8 flex justify-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-primary text-secondary hover:bg-primary/90 flex items-center gap-2 px-6">
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="text-primary bg-white">
              <SheetHeader className="text-center">
                <SheetTitle className="text-primary text-xl font-bold">
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProductSidebar categories={categories} isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="hidden md:block">
            <ProductSidebar categories={categories} />
          </div>
          <main className="md:col-span-3">
            <ProductGrid
              products={products}
              className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
            />
          </main>
        </div>
      </div>
    </section>
  );
}
