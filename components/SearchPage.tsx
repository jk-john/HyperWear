"use client";

import ProductGrid from "@/components/ProductGrid";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage({
  products,
  query: initialQuery,
}: {
  products: Product[];
  query: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      } else if (initialQuery && !query) {
        router.push("/search");
      }
    }, 300); // Debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [query, initialQuery, router]);

  return (
    <div>
      <h1 className="font-display mb-6 text-3xl">Search Products</h1>
      <div className="mb-6">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full text-lg"
        />
      </div>
      <div className="mt-6">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          query && <p>No products found for &quot;{query}&quot;.</p>
        )}
      </div>
    </div>
  );
}
