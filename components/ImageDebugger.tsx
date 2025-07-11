"use client";

import { getPublicImageUrl } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

interface ImageDebuggerProps {
  product?: {
    id?: string;
    name: string;
    images?: string[] | null;
  };
}

interface DebugInfo {
  environment: {
    NEXT_PUBLIC_SUPABASE_URL: string | undefined;
    NODE_ENV: string | undefined;
  };
  originalImages: string[];
  processedImages: Array<{
    original: string;
    processed: string;
    startsWithHttp: boolean;
    includesSlash: boolean;
  }>;
  cartProcessing: {
    bestImageUrl: string;
    finalImageUrl: string;
  };
}

export const ImageDebugger = ({ product }: ImageDebuggerProps) => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  const debugImageUrls = () => {
    if (!product?.images) return;

    const debug: DebugInfo = {
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
      },
      originalImages: product.images,
      processedImages: product.images.map((img) => ({
        original: img,
        processed: getPublicImageUrl(img),
        startsWithHttp: img.startsWith("http"),
        includesSlash: img.includes("/"),
      })),
      cartProcessing: (() => {
        // Simulate cart processing logic
        let bestImageUrl = product.images?.[0] || "";
        if (product.images && product.images.length > 1) {
          const variantName = product.name.split(" - ")[1]?.toLowerCase();
          if (variantName) {
            const foundImage = product.images.find((img) =>
              img.toLowerCase().includes(variantName.trim()),
            );
            if (foundImage) {
              bestImageUrl = foundImage;
            }
          }
        }
        return {
          bestImageUrl,
          finalImageUrl: getPublicImageUrl(bestImageUrl),
        };
      })(),
    };

    setDebugInfo(debug);
    console.log("Image Debug Info:", debug);
  };

  return (
    <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
      <h3 className="font-semibold mb-2">Image URL Debugger</h3>
      <Button onClick={debugImageUrls} size="sm" variant="outline">
        Debug Image URLs
      </Button>
      
      {debugInfo && (
        <div className="mt-4 text-xs space-y-2">
          <div>
            <strong>Environment:</strong>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugInfo.environment, null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Original Images:</strong>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugInfo.originalImages, null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Processed Images:</strong>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugInfo.processedImages, null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Cart Processing:</strong>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugInfo.cartProcessing, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}; 