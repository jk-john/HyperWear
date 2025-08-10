"use client";

import { DynamicImageShowcase } from "@/components/ui/dynamic-image-showcase";

interface DynamicImageShowcaseWrapperProps {
  images: string[];
}

export default function DynamicImageShowcaseWrapper({ images }: DynamicImageShowcaseWrapperProps) {
  return <DynamicImageShowcase images={images} />;
}