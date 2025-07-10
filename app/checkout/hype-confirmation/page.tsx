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
    hype: "/HYPE.svg",
    usdt0: "/USDT0.svg",
    usdhl: "/USDHL.svg",
  };
  const normalizedPaymentMethod = paymentMethod?.toLowerCase() || "hype";
  const tokenImage = tokenImages[normalizedPaymentMethod];

  const isExpired = timeLeft !== null && timeLeft <= 0;
  const isPaid = orderStatus === "paid" || orderStatus === "completed";

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
      return null;
    }
    switch (orderStatus) {
      case "underpaid":
        return (
          <div className="mt-4 rounded-md bg-yellow-900/50 p-3 text-center text-sm text-yellow-300">
            <p className="font-bold">Underpayment Detected</p>
            <p>Please send the remaining balance to complete your order.</p>
          </div>
        );
      default:
        return null;
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

      if (order.status === "paid" || order.status === "completed") {
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

          if (
            updatedOrder.status === "paid" ||
            updatedOrder.status === "completed"
          ) {
            toast.success("✅ Payment received!");
            clearCart();
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

              {getPaymentMessage()}

              <div className="my-6 space-y-4 rounded-lg bg-[--color-jungle] p-4 text-center">
                <div>
                  <p className="text-sm text-[--color-accent]">Send exactly</p>
                  <div className="mt-2 flex items-center justify-center gap-3">
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
                      onClick={handleCopyAmount}
                      size="sm"
                      variant="ghost"
                      className="px-3 py-1 text-xs hover:bg-[--color-primary]"
                    >
                      {copiedAmount ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-[--color-emerald] pt-4">
                  <p className="text-sm text-[--color-accent]">
                    To the following address
                  </p>
                  <div className="my-4 flex justify-center">
                    <QRCodeSVG
                      value={receivingAddress}
                      size={140}
                      bgColor="var(--color-jungle)"
                      fgColor="#FFFFFF"
                    />
                  </div>
                  <div className="font-mono text-sm break-all text-[--color-light]">
                    {receivingAddress}
                  </div>
                  <Button
                    onClick={handleCopyAddress}
                    size="sm"
                    variant="ghost"
                    className="mt-2 px-3 py-1 text-xs hover:bg-[--color-primary]"
                  >
                    {copiedAddress ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-[--color-accent]">
                <p>
                  Your order will be processed automatically once the payment is
                  confirmed on the blockchain.
                </p>
              </div>
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
