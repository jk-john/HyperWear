"use client";

import { Button } from "@/components/ui/button";
import { LEDGER_RECEIVING_ADDRESS } from "@/constants/wallet";
import { useCartStore } from "@/stores/cart";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function HypeConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const supabase = createClient();

  const orderId = searchParams.get("orderId");

  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [, setPaidAmount] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const receivingAddress = LEDGER_RECEIVING_ADDRESS;

  const tokenImages: { [key: string]: string } = {
    hype: "/hyperliquid-logo.png",
    usdt0: "/USDT0.svg",
    usdhl: "/USDHL.svg",
  };
  const normalizedPaymentMethod = paymentMethod?.toLowerCase() || "hype";
  const tokenImage = tokenImages[normalizedPaymentMethod];

  const isExpired = timeLeft !== null && timeLeft <= 0;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amountToPay.toFixed(18));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getPaymentMessage = () => {
    if (isExpired) {
      return (
        <div className="rounded-md bg-red-100 p-4 text-center text-red-700">
          <p className="font-bold">Order Expired</p>
          <p>
            Your payment window has closed. Please go back to checkout to start
            over.
          </p>
        </div>
      );
    }
    switch (orderStatus) {
      case "paid":
        return (
          <div className="rounded-md bg-green-100 p-4 text-center text-green-700">
            <p className="font-bold">Payment Complete!</p>
            <p>Your order has been successfully paid.</p>
          </div>
        );
      case "underpaid":
        return (
          <div className="rounded-md bg-yellow-100 p-4 text-center text-yellow-700">
            <p className="font-bold">Underpayment Detected</p>
            <p>
              We received a payment, but it was less than the required amount.
              Please send the remaining balance to complete your order.
            </p>
          </div>
        );
      default:
        return (
          <p className="text-md text-primary mt-2 text-center">
            Please send the exact amount of{" "}
            <span className="font-bold">
              {normalizedPaymentMethod.toUpperCase()}
            </span>{" "}
            to the address below.
          </p>
        );
    }
  };

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      toast.error("No order specified. Redirecting to checkout.");
      router.push("/checkout");
      return;
    }

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error || !order) {
        toast.error("Could not find your order. Redirecting...");
        router.push("/checkout");
        return;
      }

      setOrderStatus(order.status);
      setPaymentMethod(order.payment_method?.toLowerCase() || "hype");
      setPaidAmount(order.paid_amount ?? 0);
      setExpiresAt(order.expires_at);
      setAmountToPay(order.remaining_amount ?? order.total_token_amount ?? 0);

      if (order.status === "paid") {
        clearCart();
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("An unexpected error occurred while fetching your order.");
      router.push("/checkout");
    }
  }, [orderId, router, supabase, clearCart]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const expiryTime = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance < 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(Math.floor(distance / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updatedOrder = payload.new as {
            status: string;
            remaining_amount: number;
            paid_amount: number;
          };
          setOrderStatus(updatedOrder.status);
          setAmountToPay(updatedOrder.remaining_amount);
          setPaidAmount(updatedOrder.paid_amount);

          if (updatedOrder.status === "paid") {
            toast.success("✅ Payment received! You'll be redirected shortly.");
            clearCart();
            setTimeout(() => {
              router.push(`/dashboard/orders/${orderId}`);
            }, 3000);
          } else if (updatedOrder.status === "underpaid") {
            toast.warning("Partial payment received. Please send the rest.");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, supabase, router, clearCart]);

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <div className="bg-primary flex min-h-screen items-center justify-center p-4">
        <div className="bg-primary w-full max-w-md rounded-lg p-8 shadow-lg">
          {orderStatus === "paid" ? (
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold">Payment Successful!</h1>
              <p>Your order has been confirmed.</p>
              <Button
                onClick={() => router.push(`/dashboard/orders/${orderId}`)}
                className="mt-6"
              >
                View Your Order
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Complete Your Payment</h1>
                {timeLeft !== null && (
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {formatTime(timeLeft)}
                  </div>
                )}
              </div>
              {getPaymentMessage()}
              <div className="text-primary my-2 mt-6 mb-6 flex items-center justify-center space-x-2 text-lg font-bold">
                <span className="flex items-center gap-2">
                  {amountToPay.toFixed(4)}{" "}
                  {tokenImage && (
                    <Image
                      src={tokenImage}
                      alt={normalizedPaymentMethod.toUpperCase()}
                      width={24}
                      height={24}
                    />
                  )}
                </span>
                <Button
                  onClick={handleCopyAmount}
                  size="sm"
                  variant="ghost"
                  className="bg-primary hover:bg-secondary/80 ml-9 px-6 py-3 text-xs text-white hover:text-black"
                >
                  {copiedAmount ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-primary">to the following address:</p>
              <div className="my-4 flex justify-center">
                <QRCodeSVG value={receivingAddress} size={128} />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="font-mono text-sm break-all">
                  {receivingAddress}
                </div>
                <Button
                  onClick={handleCopyAddress}
                  size="sm"
                  variant="ghost"
                  className="bg-primary hover:bg-secondary/80 px-10 text-white hover:text-black"
                >
                  {copiedAddress ? "Copied!" : "Copy"}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  Send exactly this amount. Do not send from an exchange.
                  Underpayments will delay your order.
                </p>
                <p className="mt-2">
                  Your order will be processed once the payment is confirmed on
                  the blockchain.
                </p>
              </div>
              <Button
                onClick={() => router.push("/checkout")}
                variant="outline"
                className="mt-6 w-full"
              >
                Cancel and Return to Checkout
              </Button>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default function HypeConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <HypeConfirmation />
    </Suspense>
  );
}
