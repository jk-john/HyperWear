// app/products/[slug]/page.tsx
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductBySlug } from "@/lib/supabase";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const { name, description, images } = product;
  const imageUrl =
    images && images.length > 0 ? images[0].url : "/og-preview.jpg";

  return {
    title: name,
    description: description,
    alternates: {
      canonical: `/products/${params.slug}`,
    },
    openGraph: {
      title: name,
      description: `Shop for ${name} on HyperWear.io. ${description}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: `Shop for ${name} on HyperWear.io. ${description}`,
      images: [imageUrl],
    },
  };
}

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
