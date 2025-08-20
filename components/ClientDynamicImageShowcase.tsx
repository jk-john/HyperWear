"use client";

import dynamic from "next/dynamic";

const DynamicImageShowcaseWrapper = dynamic(
  () => import("@/components/DynamicImageShowcaseWrapper"),
  {
    loading: () => (
      <div className="h-80 animate-pulse bg-gray-100 rounded-lg" />
    ),
    ssr: false,
  }
);

interface ClientDynamicImageShowcaseProps {
  images: string[];
}

export default function ClientDynamicImageShowcase({
  images,
}: ClientDynamicImageShowcaseProps) {
  return <DynamicImageShowcaseWrapper images={images} />;
}
