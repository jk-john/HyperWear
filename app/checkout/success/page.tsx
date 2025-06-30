"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { Tables } from "@/types/supabase";
import {
  CheckCircle,
  Home,
  Loader2,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { getOrderDetails } from "./actions";

type OrderWithItems = Tables<"orders"> & {
  order_items: Array<{
    quantity: number;
    price_at_purchase: number;
    products: {
      name: string;
      images: string[];
    };
  }>;
};

function SuccessContent() {
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setError("No order ID found.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      // Retry logic to handle potential DB replication delay
      for (let i = 0; i < 3; i++) {
        const { order: fetchedOrder, error: fetchError } =
          await getOrderDetails(orderId);

        if (fetchedOrder) {
          setOrder(fetchedOrder as OrderWithItems);
          clearCart();
          localStorage.removeItem("shippingAddress");
          toast.success(
            "🎉 Order confirmed! We'll notify you once it's shipped.",
          );
          setLoading(false);
          return; // Exit loop on success
        }

        if (i < 2) {
          // Wait 1 second before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          // Set error after final attempt fails
          setError(
            fetchError ||
              "Failed to fetch order details after multiple attempts.",
          );
        }
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Processing your order...
        </h1>
        <Loader2 className="mt-8 h-24 w-24 animate-spin text-white" />
        <p className="text-muted-foreground mt-4 text-white">
          Please wait while we confirm your order details.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-500">Error</h1>
        <p className="text-muted-foreground mt-4 text-white">{error}</p>
        <Button
          onClick={() => router.push("/")}
          className="hover:bg-secondary/90 mt-8 bg-white text-black hover:text-white"
        >
          <Home className="mr-2 h-4 w-4" />
          Go back to Home
        </Button>
      </div>
    );
  }

  if (!order) {
    // This state should ideally not be reached if an orderId is present
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold">Could not load your order.</h1>
        <p className="text-muted-foreground mt-4">
          Please check your dashboard for order status.
        </p>
        <Button
          onClick={() => router.push("/dashboard/orders")}
          className="mt-8"
        >
          <Package className="mr-2 h-4 w-4 text-white" /> Go to Dashboard
        </Button>
      </div>
    );
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7); // Estimated delivery in 7 days

  const subtotal = order.order_items.reduce(
    (acc, item) => acc + item.price_at_purchase * item.quantity,
    0,
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <CheckCircle className="mb-4 h-32 w-32 self-center text-green-500 md:self-start" />
            <h1 className="text-4xl font-extrabold tracking-tighter text-white sm:text-5xl">
              Thank you for your order!
            </h1>
            <p className="text-muted-foreground mt-4 max-w-md text-white">
              Your order{" "}
              <span className="font-semibold text-white">#{order.id}</span> has
              been placed successfully. You will receive an email confirmation
              shortly.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white text-white sm:w-auto"
              >
                <Link href="/" passHref>
                  <div className="flex items-center">
                    <ShoppingCart className="block-inline mr-2 h-5 w-5 border-white text-white" />
                    <span className="block-inline text-white">
                      Continue Shopping
                    </span>
                  </div>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white text-white sm:w-auto"
              >
                <Link href="/dashboard/orders" passHref>
                  <div className="flex items-center">
                    <Truck className="mr-2 h-5 w-5 border-white text-white" />
                    Track Your Order
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border-5 border-white p-6 shadow-lg lg:p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Order Summary
            </h2>
            <div className="space-y-5">
              {order.order_items.map((item, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="aspect-square w-20 overflow-hidden rounded-lg border">
                      <Image
                        src={
                          item.products.images?.[0] || "/placeholder-image.png"
                        }
                        alt={item.products.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {item.products.name}
                      </p>
                      <p className="text-muted-foreground text-sm text-white">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-white">
                    ${(item.price_at_purchase * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-white" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Shipping</span>
                <span className="text-white">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Taxes</span>
                <span className="text-white">Calculated at next step</span>
              </div>
            </div>

            <div className="my-6 border-t border-white" />

            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Shipping Information
              </h3>
              <div className="text-muted-foreground text-sm">
                <p className="text-white">
                  {order.shipping_first_name} {order.shipping_last_name}
                </p>
                <p className="text-white">{order.shipping_street}</p>
                <p className="text-white">
                  {order.shipping_city}, {order.shipping_postal_code}
                </p>
                <p className="text-white">{order.shipping_country}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-5 w-5 text-white" />
              {/* TODO: Add a link to the tracking page based on the database*/}
              <p className="text-primary text-sm font-medium">
                Estimated Delivery: {deliveryDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
