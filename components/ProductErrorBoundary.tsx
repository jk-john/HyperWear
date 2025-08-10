"use client";

import { ErrorBoundary } from "./ErrorBoundary";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Link from "next/link";

interface ProductErrorBoundaryProps {
  children: ReactNode;
}

export function ProductErrorBoundary({ children }: ProductErrorBoundaryProps) {
  const productErrorFallback = (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <Package className="h-16 w-16 mx-auto text-orange-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Product Loading Error
          </h2>
          <p className="text-gray-600">
            We&apos;re having trouble loading this product. Please try again or browse our other products.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-emerald)] text-white"
          >
            Try Again
          </Button>
          <Link href="/products">
            <Button 
              variant="outline" 
              className="w-full border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            >
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={productErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Product Error:', error, errorInfo);
        // Log product-specific errors with context
      }}
    >
      {children}
    </ErrorBoundary>
  );
}