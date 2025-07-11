import ProductGrid from "@/components/ProductGrid";
import ProductSidebar from "@/components/ProductSidebar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/server";
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            All Products
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our complete collection of HyperLiquid merchandise designed by the community, for the community.
          </p>
        </div>

        {/* Mobile Filters */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-[var(--color-primary)] hover:bg-[var(--color-emerald)] text-white flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters & Sort</span>
              </button>
            </SheetTrigger>
            <SheetContent className="bg-white border-gray-200">
              <SheetHeader className="text-center pb-6">
                <SheetTitle className="text-xl font-bold text-gray-900">
                  Filters & Sort
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProductSidebar categories={categories} isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sticky top-6">
              <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-4">
                Filters
              </h2>
              <ProductSidebar categories={categories} />
            </div>
          </div>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {products && products.length > 0 ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-medium">
                    Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <ProductGrid
                  products={products}
                  className="!bg-transparent !p-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10 lg:gap-12"
                />
              </div>
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
    </div>
  );
}
