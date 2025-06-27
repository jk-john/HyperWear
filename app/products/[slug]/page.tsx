// app/products/[slug]/page.tsx
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductBySlug } from "@/lib/supabase";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    // no match → 404
    return notFound();
  }

  return (
    <main className="container mx-auto py-8">
      <ProductDetailClient product={product} />
    </main>
  );
}
