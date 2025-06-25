"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/stores/cart";
import { Tables } from "@/types/supabase";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrderDetails } from "./actions";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  {
    ssr: false,
  },
);

type OrderWithItems = Tables<"orders"> & {
  order_items: Array<{
    quantity: number;
    price_at_purchase: number;
    products: {
      name: string;
      image_url: string;
    };
  }>;
};

export default function SuccessPage() {
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
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">Processing your order...</h1>
        <Player
          autoplay
          loop
          src="https://lottie.host/e24f7e4a-a82f-4749-a359-5f187a077473/3L7JzJc8bA.json"
          style={{ height: "300px", width: "300px" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-500">Error</h1>
        <p className="mt-4">{error}</p>
        <Button onClick={() => router.push("/")} className="mt-8">
          Go back to Home
        </Button>
      </div>
    );
  }

  if (!order) {
    // This state should ideally not be reached if an orderId is present
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">Could not load your order.</h1>
        <p className="mt-4">Please check your dashboard for order status.</p>
        <Button
          onClick={() => router.push("/dashboard/orders")}
          className="mt-8"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="text-center">
        <div className="mx-auto w-48">
          <Player
            autoplay
            loop={false}
            src="https://lottie.host/9f7b2d5a-6b8a-4d7a-8f8b-9e8c3b5a7b8c/t2kR3bY5qE.json"
            style={{ height: "200px", width: "200px" }}
          />
        </div>
        <h1 className="text-3xl font-bold">Thank you for your order!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your order has been placed successfully. Order ID:{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {order.id}
          </span>
        </p>
      </div>

      <div className="mt-8 rounded-lg border bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="mt-4 space-y-4">
          {order.order_items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={item.products.image_url}
                  alt={item.products.name}
                  width={64}
                  height={64}
                  className="rounded-md"
                />
                <div>
                  <p className="font-semibold">{item.products.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">
                ${(item.price_at_purchase * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="my-6 h-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center justify-between text-xl font-bold">
          <p>Total</p>
          <p>${order.total?.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/dashboard/orders">
          <Button>View your orders</Button>
        </Link>
      </div>
    </div>
  );
}
