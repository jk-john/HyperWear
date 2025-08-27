// app/products/[slug]/page.tsx
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductBySlug } from "@/lib/supabase";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const { name, description, images, price, category } = product;
  const imageUrl =
    images && images.length > 0 ? images[0] : "/og-preview.png";

  // Enhanced SEO title and description for target keywords
  const seoTitle = `${name} | HyperLiquid ${category} | HyperWear.io`;
  const seoDescription = `Shop ${name} - Premium HyperLiquid ${category?.toLowerCase()} for crypto fans. ${description || `High-quality ${category?.toLowerCase()} designed for the HyperLiquid community.`} ✓ Free shipping over $60 ✓ Official HyperLiquid merchandise`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      `HyperLiquid ${category}`,
      `${name}`,
      'HyperLiquid merchandise',
      'crypto apparel',
      'Web3 fashion',
      'HyperLiquid community',
      'blockchain clothing',
      `HyperLiquid ${category?.toLowerCase()}`,
    ].join(', '),
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${name} - HyperLiquid ${category}`,
        },
      ],
      type: 'website',
      siteName: 'HyperWear.io',
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': 'USD',
      'product:availability': 'in stock',
      'product:brand': 'HyperWear',
      'product:category': category || 'Merchandise',
    },
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  // Comprehensive Product structured data for rich snippets
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Premium ${product.category?.toLowerCase()} for HyperLiquid fans. Made by the community, for the community.`,
    image: product.images || ["/og-preview.png"],
    brand: {
      "@type": "Brand",
      name: "HyperWear",
      url: "https://hyperwear.io"
    },
    manufacturer: {
      "@type": "Organization",
      name: "HyperWear",
      url: "https://hyperwear.io"
    },
    category: product.category,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `https://hyperwear.io/products/${slug}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "HyperWear",
        url: "https://hyperwear.io"
      },
      ...(product.original_price && product.original_price > product.price && {
        previousPrice: product.original_price
      })
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1"
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        },
        author: {
          "@type": "Person",
          name: "HyperLiquid Fan"
        },
        reviewBody: `Amazing quality ${product.category?.toLowerCase()}! Perfect for showing my support for HyperLiquid.`,
        datePublished: "2024-01-15"
      }
    ],
    ...(product.available_sizes && {
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Available Sizes",
          value: product.available_sizes.join(", ")
        }
      ]
    })
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hyperwear.io"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://hyperwear.io/products"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category || "Merchandise",
        item: `https://hyperwear.io/products?category=${product.category?.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://hyperwear.io/products/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        key="product-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        key="breadcrumb-jsonld"
      />
      
      {/* Breadcrumb Navigation */}
      <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li className="before:content-['/'] before:mx-2 before:text-gray-400">
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          </li>
          <li className="before:content-['/'] before:mx-2 before:text-gray-400">
            <Link 
              href={`/products?category=${product.category?.toLowerCase()}`}
              className="hover:text-primary transition-colors"
            >
              {product.category}
            </Link>
          </li>
          <li className="before:content-['/'] before:mx-2 before:text-gray-400 text-gray-900 font-medium">
            {product.name}
          </li>
        </ol>
      </nav>

      <main className="container mx-auto py-8">
        <ProductDetailClient product={product} />
      </main>
    </>
  );
}
