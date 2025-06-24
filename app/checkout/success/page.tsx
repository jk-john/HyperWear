"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/stores/cart";
import { Tables } from "@/types/supabase";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createOrder } from "./actions";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  {
    ssr: false,
  },
);

type Order = Tables<"orders">;

export default function SuccessPage() {
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saveOrder = async () => {
      const shippingAddressString = localStorage.getItem("shippingAddress");
      if (cartItems.length > 0 && shippingAddressString) {
        try {
          const shippingAddress = JSON.parse(shippingAddressString);
          const result = await createOrder(
            cartItems,
            totalPrice(),
            shippingAddress,
          );
          if (result.error) {
            setError(result.error.message);
          } else if (result.order) {
            setOrder(result.order);
            clearCart();
            localStorage.removeItem("shippingAddress");
          }
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred.");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    saveOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">No order to process.</h1>
        <p className="mt-4">Your cart was empty.</p>
        <Button onClick={() => router.push("/")} className="mt-8">
          Go back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Player
        autoplay
        loop={false}
        src="https://lottie.host/9f7b2d5a-6b8a-4d7a-8f8b-9e8c3b5a7b8c/t2kR3bY5qE.json"
        style={{ height: "300px", width: "300px" }}
      />
      <h1 className="text-3xl font-bold">Thank you for your order!</h1>
      <p className="mt-4">
        Your order has been placed successfully. Your order ID is{" "}
        <span className="font-semibold">{order.id}</span>.
      </p>
      <div className="mt-8">
        <Link href="/dashboard/orders">
          <Button>View your orders</Button>
        </Link>
      </div>
    </div>
  );
}
