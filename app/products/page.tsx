import ProductGrid from "@/components/ProductGrid";
import { OrderLimitBanner } from "@/components/ui/OrderLimitBanner";
import { getProducts } from "@/lib/supabase";

export const metadata = {
  title: "Shop • HyperWear",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-semibold text-[var(--color-dark)]">
            All Products
          </h1>
        </div>
        <OrderLimitBanner />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
