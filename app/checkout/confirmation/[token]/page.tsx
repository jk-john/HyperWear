"use client";

import { cancelOrder } from "@/app/checkout/actions";
import { Button } from "@/components/ui/button";
import { LEDGER_RECEIVING_ADDRESS } from "@/constants/wallet";
import { useCartStore } from "@/stores/cart";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ConfirmationPageProps = {
  params: { token: string };
};

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
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyAmount = () => {
    if (order?.total_token_amount) {
      navigator.clipboard.writeText(
        order.total_token_amount.toFixed(18).toString(),
      );
      setCopiedAmount(true);
      toast.success("Amount copied to clipboard!");
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
          <div className="mb-4 rounded-lg bg-amber-50 p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <p className="font-semibold text-amber-800 text-sm">Underpayment Detected</p>
            </div>
            <p className="text-amber-700 text-xs">Please send the remaining balance to complete your order.</p>
          </div>
        );
      case "paid":
      case "completed":
        return (
          <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-sm font-semibold text-emerald-800">Verifying payment on the blockchain...</p>
            </div>
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
      <div className="flex min-h-screen items-center justify-center bg-[--color-dark]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[--color-secondary] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[--color-light] font-medium">Loading order details...</div>
        </div>
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

  const amountToPay = order?.total_token_amount ?? 0;

  if (isCancelled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--color-dark] p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="font-display text-xl font-bold text-gray-900 mb-2">
            Order Cancelled
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            This order has been successfully cancelled. You will be redirected
            to the homepage shortly.
          </p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--color-dark]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[--color-secondary] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[--color-light]">Loading order...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[--color-dark]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[--color-secondary] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[--color-light]">Loading confirmation...</p>
          </div>
        </div>
      }
    >
      <div className="font-body min-h-screen bg-[--color-dark] p-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {isPaid ? (
              <div className="text-center space-y-4">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h1 className="font-display text-2xl font-bold text-gray-900">
                  Payment Received!
                </h1>
                <p className="text-[--color-primary] font-medium">
                  Your order has been confirmed.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed px-2">
                  Thank you for your purchase! You will receive an email
                  confirmation shortly with your order details.
                </p>
                <Button
                  onClick={() => router.push(`/dashboard/orders`)}
                  className="mt-6 w-full bg-[--color-primary] hover:bg-[--color-emerald] text-white rounded-full py-3 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  View Your Orders
                </Button>
              </div>
            ) : isExpired ? (
              <div className="text-center space-y-4">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h1 className="font-display text-2xl font-bold text-gray-900">
                  Order Expired
                </h1>
                <p className="text-gray-600">
                  This payment request has expired.
                </p>
                <Button
                  onClick={() => router.push("/checkout")}
                  className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white rounded-full py-3 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Create a New Order
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Header */}
                <div className="text-center space-y-3">
                  <h1 className="font-display text-xl font-bold text-gray-900 leading-tight">
                    Complete Your Payment
                  </h1>
                  {timeLeft !== null && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-lg font-mono font-bold text-red-700">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  )}
                </div>

                {getPaymentMessage(order?.status)}

                {/* Payment Amount */}
                <div className="text-center space-y-3">
                  <p className="text-gray-600 text-sm font-medium">Send exactly</p>
                  <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-50">
                    {tokenImage && (
                      <Image
                        src={tokenImage}
                        alt={normalizedPaymentMethod.toUpperCase()}
                        width={28}
                        height={28}
                        className="flex-shrink-0"
                      />
                    )}
                    <span className="font-mono text-lg font-bold text-[--color-primary] break-all">
                      {amountToPay.toFixed(6)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAmount}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm border ${
                        copiedAmount 
                          ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600" 
                          : "bg-[--color-primary] text-black border-[--color-primary] hover:bg-[--color-emerald] hover:scale-105"
                      }`}
                    >
                      {copiedAmount ? "✓ Copied" : "Copy"}
                    </Button>
                  </div>
                </div>

                {/* QR Code and Address in two columns on larger screens */}
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm font-medium text-center">To the following address</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* QR Code */}
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-xl bg-white shadow-md border">
                        <QRCodeSVG
                          value={receivingAddress}
                          size={120}
                          bgColor="#ffffff"
                          fgColor="#0f3933"
                          level="M"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex-1 space-y-3">
                      <div className="p-3 rounded-xl bg-gray-50 border">
                        <div className="font-mono text-xs text-gray-700 break-all leading-relaxed">
                          {receivingAddress}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleCopyAddress}
                        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
                          copiedAddress 
                            ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105" 
                            : "bg-[--color-secondary] text-[--color-primary] hover:bg-[--color-secondary]/90 hover:scale-105"
                        }`}
                      >
                        {copiedAddress ? "✓ Address Copied!" : "Copy Address"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Info Message */}
                <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-blue-800 text-xs leading-relaxed">
                    Your order will be processed automatically once the payment is
                    confirmed on the blockchain.
                  </p>
                </div>

                {/* Cancel Button */}
                <Button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  variant="outline"
                  className="w-full py-3 rounded-xl border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50 font-semibold transition-all duration-300 text-sm shadow-sm hover:scale-105"
                >
                  {isCancelling ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                      Cancelling...
                    </div>
                  ) : (
                    "Cancel Order"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default function HypeConfirmationPage() {
  const params = useParams<{ token: string }>();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[--color-dark]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[--color-secondary] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[--color-light]">Loading confirmation...</p>
          </div>
        </div>
      }
    >
      <HypeConfirmation params={{ token: params.token }} />
    </Suspense>
  );
}
