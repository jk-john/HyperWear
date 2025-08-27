import ProductGrid from "@/components/ProductGrid";
import ProductSidebar from "@/components/ProductSidebar";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/types/utils/supabase/server";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

type ProductsPageProps = {
  searchParams: Promise<{
    gender?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  }>;
};

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;

  const {
    gender,
    category,
    sortBy,
    order
  } = searchParams;

  const supabase = createClient();

  // Fetch all products to derive categories
  const { data: allProducts, error: allProductsError } = await supabase
    .from("products")
    .select("category");

  if (allProductsError) {
    console.error("Error fetching products for categories:", allProductsError);
    return <div>Error loading products.</div>;
  }

  const categories = allProducts
    ? [...new Set(allProducts.map((p) => p.category).filter(Boolean))]
    : [];

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

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              All Products
            </h1>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              Discover our complete collection of HyperLiquid merchandise designed by the community, for the community.
            </p>
          </div>

        {/* Filters Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left: Results count */}
            <div className="flex items-center gap-4">
              <p className="text-gray-600 font-medium">
                {products ? `${products.length} ${products.length === 1 ? 'product' : 'products'}` : 'Loading...'}
              </p>
            </div>
            
            {/* Right: Filter and Sort controls */}
            <div className="flex items-center gap-3">
              {/* Mobile Filters */}
              <div className="sm:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="bg-[var(--color-primary)] hover:bg-[var(--color-emerald)] text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>Filters</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent className="bg-white border-gray-200">
                    <SheetHeader className="text-center pb-6">
                      <SheetTitle className="text-xl font-bold text-gray-900">
                        Filters & Sort
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 mx-auto px-4 w-full max-w-sm pt-6">
                      <ProductSidebar categories={categories} isMobile />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Desktop Filters Toggle */}
              <div className="hidden sm:block">
                <ProductSidebar categories={categories} />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <main>
            {products && products.length > 0 ? (
              <ProductGrid
                products={products}
                className="!bg-transparent !p-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8 lg:gap-10 xl:gap-12"
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-20 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <SlidersHorizontal className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    No Products Found
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    We couldn&apos;t find any products matching your current filters. Try adjusting your search criteria.
                  </p>
                  <Link 
                    href="/products"
                    className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-emerald)] text-white px-10 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Clear All Filters
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
