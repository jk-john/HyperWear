import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/supabase";

export const metadata = {
  title: "Shop • HyperWear",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-display mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
