"use client";

import { cancelOrder } from "@/app/checkout/actions";
import { Button } from "@/components/ui/button";
import { LEDGER_RECEIVING_ADDRESS } from "@/constants/wallet";
import { useCartStore } from "@/stores/cart";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ConfirmationPageProps {
  params: {
    token: string;
  };
}

function HypeConfirmation({ params }: ConfirmationPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const supabase = createClient();

  const [order, setOrder] = useState<Tables<"orders"> | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const { clearCart, setPendingOrder } = useCartStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [successNotified, setSuccessNotified] = useState(false);
  const isChecking = useRef(false);

  const isPaid = order?.status === "paid" || order?.status === "completed";
  const isExpired = timeLeft !== null && timeLeft <= 0;

  const receivingAddress = LEDGER_RECEIVING_ADDRESS;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyAmount = () => {
    if (order?.remaining_amount) {
      navigator.clipboard.writeText(
        order.remaining_amount.toFixed(18).toString(),
      );
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getPaymentMessage = (status?: string | null) => {
    if (!status) return null;
    switch (status) {
      case "underpaid":
        return (
          <div className="mt-4 rounded-md bg-yellow-900/50 p-3 text-center text-sm text-yellow-300">
            <p className="font-bold">Underpayment Detected</p>
            <p>Please send the remaining balance to complete your order.</p>
          </div>
        );
      case "paid":
      case "completed":
        return (
          <div className="mt-6 animate-pulse text-center text-lg font-semibold text-green-400">
            Verifying payment on the blockchain...
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error || !data) {
        setOrder(null);
      } else {
        if (data.status === "cancelled") {
          setIsCancelled(true);
        }
        setOrder(data);
      }
      setIsLoading(false);
    }
    fetchOrder();
  }, [orderId, supabase]);

  useEffect(() => {
    if (order?.expires_at) {
      const interval = setInterval(() => {
        const expiryTime = new Date(order.expires_at as string).getTime();
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
    }
  }, [order]);

  useEffect(() => {
    if (isCancelled) {
      setPendingOrder(null);
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCancelled, router, setPendingOrder]);

  useEffect(() => {
    if (isPaid && !successNotified) {
      toast.success("✅ Payment received!");
      clearCart();
      setPendingOrder(null);
      setSuccessNotified(true);
    }
  }, [isPaid, successNotified, clearCart, setPendingOrder]);

  // Periodic check for order status
  useEffect(() => {
    if (!orderId || isPaid || isCancelled || isExpired) {
      return;
    }

    const checkOrderStatus = async () => {
      if (isChecking.current) return;

      isChecking.current = true;
      try {
        // First, trigger the backend to check for new transactions
        await fetch("/api/trigger-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        // Then, fetch the latest order status from the database
        const { data: updatedOrder, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) {
          console.error("Error fetching order status:", error);
          // Do not return here, always release the lock in finally
        } else if (updatedOrder) {
          setOrder(updatedOrder);
          if (updatedOrder.status === "underpaid") {
            toast.warning("Partial payment received. Please send the rest.");
          }
        }
      } finally {
        isChecking.current = false;
      }
    };

    // Trigger immediately on load
    checkOrderStatus();

    const interval = setInterval(checkOrderStatus, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, [orderId, isPaid, isCancelled, isExpired, supabase]);

  const handleCancel = async () => {
    if (!orderId || isCancelling) return;
    setIsCancelling(true);

    const result = await cancelOrder(orderId);

    if (result.success) {
      toast.info("Your order has been cancelled.");
      setIsCancelled(true); // Manually trigger the UI update
    } else {
      toast.error(result.error || "Failed to cancel order.");
      setIsCancelling(false); // Re-enable button only on failure
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--color-jungle]">
        <div className="text-white">Loading order details...</div>
      </div>
    );
  }

  const tokenImages: { [key: string]: string } = {
    hype: "/HYPE.svg",
    usdt0: "/USDT0.svg",
    usdhl: "/USDHL.svg",
  };
  const normalizedPaymentMethod =
    order?.payment_method?.toLowerCase() || params.token;
  const tokenImage = tokenImages[normalizedPaymentMethod];

  const amountToPay = order?.remaining_amount ?? order?.total_token_amount ?? 0;

  if (isCancelled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--color-jungle]">
        <div className="w-full max-w-md rounded-2xl bg-[--color-primary] p-8 text-center shadow-2xl shadow-black/40">
          <h1 className="font-display text-3xl font-bold text-white">
            Order Cancelled
          </h1>
          <p className="mt-2 text-white/80">
            This order has been successfully cancelled. You will be redirected
            to the homepage shortly.
          </p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--color-jungle]">
        <p className="text-white">Loading order...</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[--color-jungle]">
          <p className="text-white">Loading confirmation...</p>
        </div>
      }
    >
      <div className="font-body flex min-h-screen items-center justify-center bg-[--color-jungle] p-4 text-white">
        <div className="w-full max-w-md rounded-2xl bg-[--color-primary] p-8 shadow-2xl shadow-black/40">
          {isPaid ? (
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold text-[--color-secondary]">
                Payment Received!
              </h1>
              <p className="mt-2 text-[--color-accent]">
                Your order has been confirmed.
              </p>
              <p className="mt-4 text-sm text-[--color-light]">
                Thank you for your purchase! You will receive an email
                confirmation shortly with your order details.
              </p>
              <Button
                onClick={() => router.push(`/dashboard/orders`)}
                className="mt-8 w-full rounded-full bg-[--color-secondary] py-3 text-lg font-bold text-[--color-primary] shadow-lg transition-all hover:scale-105 hover:bg-[--color-secondary]/90"
              >
                View Your Orders
              </Button>
            </div>
          ) : isExpired ? (
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold text-red-500">
                Order Expired
              </h1>
              <p className="mt-4 text-[--color-accent]">
                This payment request has expired.
              </p>
              <Button
                onClick={() => router.push("/checkout")}
                className="mt-6 w-full rounded-full bg-gray-600 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-500"
              >
                Create a New Order
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold text-white">
                  Complete Your Payment
                </h1>
                {timeLeft !== null && (
                  <div className="mt-2 text-lg font-semibold text-red-500">
                    {formatTime(timeLeft)}
                  </div>
                )}
              </div>

              {getPaymentMessage(order?.status)}

              <div className="my-6 space-y-4 rounded-lg bg-[--color-jungle] p-4 text-center">
                <div>
                  <p className="text-sm text-[--color-accent]">Send exactly</p>
                  <div
                    className="mt-2 flex items-center justify-center"
                    key={order?.remaining_amount}
                  >
                    {tokenImage && (
                      <Image
                        src={tokenImage}
                        alt={normalizedPaymentMethod.toUpperCase()}
                        width={28}
                        height={28}
                      />
                    )}
                    <span className="font-mono text-2xl font-bold text-[--color-secondary]">
                      {amountToPay.toFixed(6)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAmount}
                      className="flex items-center gap-1.5 text-xs text-[--color-accent] hover:text-white"
                    >
                      {copiedAmount ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="mt-4 text-sm text-[--color-accent]">
                    To the following address
                  </p>
                  <div className="my-4 flex justify-center">
                    <QRCodeSVG
                      value={receivingAddress}
                      size={140}
                      bgColor="var(--color-jungle)"
                      fgColor="var(--color-secondary)"
                    />
                  </div>
                  <div className="font-mono text-sm break-all text-[--color-light]">
                    {receivingAddress}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 text-xs text-[--color-accent] hover:text-white"
                  >
                    {copiedAddress ? "Copied!" : "Copy Address"}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-center text-xs text-[--color-accent]">
                  Your order will be processed automatically once the payment is
                  confirmed on the blockchain.
                </p>
              </div>

              <Button
                onClick={handleCancel}
                disabled={isCancelling}
                variant="outline"
                className="mt-6 w-full rounded-full border-red-500/50 text-red-500/80 transition-all hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </Button>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default function HypeConfirmationPage({
  params,
}: ConfirmationPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[--color-jungle]">
          <p className="text-white">Loading confirmation...</p>
        </div>
      }
    >
      <HypeConfirmation params={params} />
    </Suspense>
  );
}
