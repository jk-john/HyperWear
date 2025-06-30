"use client";

import { finalizeHypeOrder } from "@/app/checkout/actions";
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
  const { cartItems, clearCart } = useCartStore();
  const supabase = createClient();

  const initialAmount = parseFloat(searchParams.get("amount") || "0");
  const evmAddress = searchParams.get("evmAddress");
  const paymentMethod = searchParams.get("paymentMethod");
  const orderId = searchParams.get("orderId");

  const [amountToPay, setAmountToPay] = useState<number>(initialAmount);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [orderTotal, setOrderTotal] = useState<number>(initialAmount);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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
    toast.success("Copied to clipboard!");
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amountToPay.toFixed(2));
    toast.success("Copied to clipboard!");
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleManualVerify = async () => {
    setIsVerifying(true);
    toast.info("Verifying your payment on the blockchain...");
    try {
      const response = await fetch("/api/verify-payment-manual", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(
          data.error ||
            "⚠️ Payment couldn't be verified. Please check and try again.",
        );
        return;
      }
      toast.success(
        "Verification scan complete. Fetching latest order status...",
      );
      // Manually re-fetch the order data to update the UI
      await createOrFetchOrder();
    } catch {
      toast.error(
        "⚠️ Payment couldn't be verified. Please check and try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const createOrFetchOrder = useCallback(async () => {
    try {
      if (orderId) {
        // If orderId is present, fetch the existing order
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
        setPaidAmount(order.paid_amount ?? 0);
        setExpiresAt(order.expires_at);
        setAmountToPay(order.remaining_amount ?? order.total ?? 0);
        setOrderTotal(order.total ?? 0);
      } else if (cartItems.length > 0) {
        // Create a new order if no ID is present
        const shippingInfo = JSON.parse(
          localStorage.getItem("shippingAddress") || "{}",
        );
        const totalPriceUSD = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );

        let finalAmount = totalPriceUSD;

        // For HYPE payments, convert USD to HYPE amount
        if (paymentMethod === "hype") {
          try {
            const hypePriceResponse = await fetch(
              `/api/hype-price?amount=${totalPriceUSD}`,
              {
                cache: "no-store",
              },
            );
            if (!hypePriceResponse.ok) {
              const errorData = await hypePriceResponse.json();
              throw new Error(errorData.error || "Failed to fetch HYPE price");
            }
            const priceData = await hypePriceResponse.json();
            if (!priceData.hypeAmount) {
              throw new Error("Invalid price data received.");
            }
            finalAmount = priceData.hypeAmount;
          } catch (error) {
            console.error("Could not fetch HYPE price:", error);
            toast.error(
              "Could not fetch current HYPE price. Please try again.",
            );
            router.push("/checkout");
            return;
          }
        }

        const result = await finalizeHypeOrder(
          cartItems,
          null,
          { ...shippingInfo, paymentMethod, evmAddress },
          finalAmount, // Pass the token amount (HYPE amount for HYPE payments, USD for others)
          evmAddress ?? undefined,
        );

        if (result.success && result.orderId) {
          // Redirect to the same page with the new orderId
          router.replace(
            `/checkout/hype-confirmation?orderId=${result.orderId}&amount=${finalAmount}&paymentMethod=${paymentMethod}`,
          );
        } else {
          toast.error(result.error || "Failed to create order.");
          router.push("/checkout");
        }
      }
    } catch (error) {
      console.error("Error in createOrFetchOrder:", error);
      toast.error("An unexpected error occurred.");
    }
  }, [orderId, cartItems, evmAddress, paymentMethod, router, supabase]);

  useEffect(() => {
    createOrFetchOrder();
  }, [createOrFetchOrder]);

  useEffect(() => {
    if (!orderId) return;

    // Listen for real-time updates on the order
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
          toast.success("✅ Payment received! You'll be redirected shortly.");
          setOrderStatus(updatedOrder.status);
          setAmountToPay(updatedOrder.remaining_amount);
          setPaidAmount(updatedOrder.paid_amount);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, supabase, router, clearCart]);

  useEffect(() => {
    if (!expiresAt) return;

    const timerInterval = setInterval(() => {
      const expirationTime = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const newTimeLeft = Math.max(0, expirationTime - now);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [expiresAt]);

  useEffect(() => {
    if (orderStatus === "completed" || !orderId) return;

    const checkStatus = async () => {
      const { data: order } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .single();

      if (order?.status === "completed") {
        setOrderStatus("completed");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, [orderId, orderStatus, supabase]);

  useEffect(() => {
    if (orderStatus === "completed") {
      toast.success("Payment complete! Finalizing your order...");
      clearCart();
      localStorage.removeItem("shippingAddress");
      // Hard redirect to clear any lingering state from previous pages
      window.location.href = `/checkout/success?orderId=${orderId}`;
    }
  }, [orderStatus, orderId, router, clearCart]);

  const getPaymentMessage = () => {
    if (orderStatus === "underpaid") {
      return (
        <div className="mb-4 text-center">
          <p className="font-semibold text-yellow-500">
            Partial Payment Received!
          </p>
          <p>
            You have paid {paidAmount.toFixed(5)} / {orderTotal.toFixed(5)}.
            <br />
            Please send the remaining <strong>{amountToPay.toFixed(5)}</strong>.
          </p>
        </div>
      );
    }
    if (orderStatus === "pending") {
      return (
        <div className="mt-4 text-center">
          <p className="font-normal">
            To complete your order, please send exactly:
          </p>
        </div>
      );
    }
    return null;
  };

  const formatTime = (ms: number | null) => {
    if (ms === null) return "00:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md rounded-lg bg-gray-100 p-8 shadow-lg dark:bg-gray-800">
        {isExpired ? (
          <div>
            <h1 className="mb-4 text-2xl font-bold text-red-500 dark:text-red-400">
              Payment Window Expired
            </h1>
            <p className="text-primary">
              Your 15-minute payment window has closed. Please place a new order
              to try again.
            </p>
            <div className="mt-6 w-full border-t pt-6">
              <Button
                onClick={() => router.push("/checkout")}
                className="bg-primary hover:bg-secondary/80 w-full px-8 text-white hover:text-black"
              >
                Back to Checkout
              </Button>
            </div>
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
            <p className="mt-4 text-xs text-gray-500">
              The amount may update periodically based on the live market price.
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We will scan the blockchain for your payment and confirm your
              order automatically. This page will update upon confirmation.
            </p>
            <div className="mt-6 w-full space-y-4 border-t pt-6">
              <Button
                onClick={handleManualVerify}
                disabled={isVerifying}
                className="bg-primary hover:bg-secondary/80 w-full px-8 text-white hover:text-black"
              >
                {isVerifying
                  ? "Verifying..."
                  : "I've Sent the Payment - Verify Now"}
              </Button>
              <Button
                onClick={() => router.push("/checkout")}
                variant="secondary"
                className="w-full bg-red-500/80 text-white hover:bg-red-600"
              >
                Cancel Payment
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function HypeConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HypeConfirmation />
    </Suspense>
  );
}
