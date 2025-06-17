"use client";

import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Product = Tables<"products">;

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const products = await searchProducts(searchTerm);
    setResults(products as Product[]);
    setLoading(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Update URL as user types
    router.push(`/search?q=${encodeURIComponent(newQuery)}`, { scroll: false });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 300); // Debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div>
      <h1 className="font-display mb-6 text-3xl">Search Products</h1>
      <div className="mb-6">
        <Input
          type="search"
          value={query}
          onChange={onInputChange}
          placeholder="Search for products..."
          className="w-full text-lg"
        />
      </div>
      {loading && <p>Loading...</p>}
      {!loading && results.length === 0 && query && (
        <p>No products found for &quot;{query}&quot;.</p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
