"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Link from "next/link";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  {
    ssr: false,
  },
);

export default function CancelPage() {
  return (
    <div className="container mx-auto mt-20 px-4 py-8 text-center text-white">
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
          <Button className="bg-secondary text-jungle hover:bg-mint hover:shadow-mint/40 mt-8 w-80 rounded-full py-6 text-lg font-bold transition-colors hover:text-white">
            Back to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
