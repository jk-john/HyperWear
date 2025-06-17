"use client";

import { Button } from "@/components/ui/button";
import { Player } from "@lottiefiles/react-lottie-player";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Player
        autoplay
        loop
        src="https://lottie.host/1b73b8a1-8b9a-4c2a-8c2a-6a5b2b5e7e0a/yG3b3b3b3b.json"
        style={{ height: "300px", width: "300px" }}
      />
      <h1 className="text-destructive text-3xl font-bold">Payment Canceled</h1>
      <p className="mt-4">Your payment was not processed. You can try again.</p>
      <div className="mt-8">
        <Link href="/checkout">
          <Button>Back to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
