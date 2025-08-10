"use client";

import { ErrorBoundary } from "./ErrorBoundary";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface CheckoutErrorBoundaryProps {
  children: ReactNode;
}

export function CheckoutErrorBoundary({ children }: CheckoutErrorBoundaryProps) {
  const checkoutErrorFallback = (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <ShoppingCart className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Checkout Error
          </h2>
          <p className="text-gray-600">
            We encountered an issue processing your checkout. Your payment has not been charged.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link href="/dashboard">
            <Button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-emerald)] text-white">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/support">
            <Button 
              variant="outline" 
              className="w-full border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            >
              Contact Support
            </Button>
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          If you were in the middle of a payment, please check your email for confirmation or contact support.
        </p>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={checkoutErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Checkout Error:', error, errorInfo);
        // In production, you might want to send this to a monitoring service
        // with additional context about the checkout process
      }}
    >
      {children}
    </ErrorBoundary>
  );
}