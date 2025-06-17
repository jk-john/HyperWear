// app/products/[slug]/page.tsx
import AddToCartButton from "@/components/ui/AddToCartButton";
import { getProductBySlug } from "@/lib/supabase";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    // no match → 404
    return notFound();
  }

  const productForCart = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image_url,
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Image
          src={product.image_url}
          alt={product.name}
          width={500}
          height={500}
          className="w-full lg:w-1/2 object-cover rounded-2xl"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-display mb-4">{product.name}</h1>
          <p className="text-xl mb-6">${product.price.toFixed(2)}</p>
          <p className="mb-8">{product.description}</p>
          <AddToCartButton product={productForCart} />
        </div>
      </div>
    </main>
  );
}
