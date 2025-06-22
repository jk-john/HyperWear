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
    image: product.images[0],
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={500}
          height={500}
          className="w-full rounded-2xl object-cover lg:w-1/2"
        />
        <div className="flex-1">
          <h1 className="font-display mb-4 text-4xl">{product.name}</h1>
          <p className="mb-6 text-xl">${product.price.toFixed(2)}</p>
          <p className="mb-8">{product.description}</p>
          <AddToCartButton product={productForCart} />
        </div>
      </div>
    </main>
  );
}
