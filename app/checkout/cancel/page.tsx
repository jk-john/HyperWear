"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { markOrderAsFailed } from "./actions";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      markOrderAsFailed(orderId);
    }
  }, [orderId]);

  return (
    <div className="bg-background flex min-h-[80vh] flex-col items-center justify-center text-center">
      <XCircle className="h-24 w-24 text-red-500" />
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        Payment Canceled
      </h1>
      <p className="mt-4 max-w-md text-lg text-white/80">
        Your payment was not completed. Your order has been canceled, but your
        cart has been saved if you&apos;d like to try again.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild>
          <Link href="/checkout">Return to Checkout</Link>
        </Button>
        <Button variant="outline" className="text-white" asChild>
          <Link href="/">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
