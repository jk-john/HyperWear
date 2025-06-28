"use client";

import { finalizeHypeOrder } from "@/app/checkout/actions";
import { Button } from "@/components/ui/Button";
import { LEDGER_RECEIVING_ADDRESS } from "@/constants/wallet";
import { useCartStore } from "@/stores/cart";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

const shortenHash = (hash: string, start = 6, end = 4) => {
  if (!hash) return "";
  return `${hash.slice(0, start)}...${hash.slice(hash.length - end)}`;
};

function HypeConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, clearCart } = useCartStore();

  const initialAmount = parseFloat(searchParams.get("amount") || "0");
  const cartTotalUsd = parseFloat(searchParams.get("cartTotal") || "0");
  const evmAddress = searchParams.get("evmAddress");
  const paymentMethod = searchParams.get("paymentMethod");

  const [amountToPay, setAmountToPay] = useState(initialAmount);
  const [totalHypeRequired, setTotalHypeRequired] = useState(initialAmount);
  const [orderStatus, setOrderStatus] = useState<string | null>("pending");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const receivingAddress = LEDGER_RECEIVING_ADDRESS;

  const isExpired = timeLeft !== null && timeLeft <= 0;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amountToPay.toFixed(2));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const createOrderWithHype = async () => {
    try {
      const shippingInfo = JSON.parse(
        localStorage.getItem("shippingAddress") || "{}",
      );
      const formValues = {
        firstName: shippingInfo.first_name,
        lastName: shippingInfo.last_name,
        email: shippingInfo.email,
        phone_number: shippingInfo.phone_number,
        street: shippingInfo.street,
        address_complement: shippingInfo.address_complement,
        city: shippingInfo.city,
        postal_code: shippingInfo.postal_code,
        country: shippingInfo.country,
        company_name: shippingInfo.company_name,
        delivery_instructions: shippingInfo.delivery_instructions,
        paymentMethod: paymentMethod as "hype" | "usdhl",
        evmAddress: evmAddress || undefined,
      };

      const result = await finalizeHypeOrder(
        cartItems,
        null, // No txHash yet
        formValues,
        totalPrice,
      );

      if (!result.success) {
        toast.error(result.error || "Failed to create order.");
        router.push("/checkout");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An unexpected error occurred while creating your order.");
      router.push("/checkout");
    }
  };
  const totalPrice = useCartStore((state) => state.totalPrice());
  useEffect(() => {
    if (cartItems.length > 0) {
      createOrderWithHype();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const priceInterval = setInterval(async () => {
      if (paymentMethod !== "hype") return;
      try {
        const response = await fetch("/api/hype-price", { cache: "no-store" });
        if (response.ok) {
          const { hypeToUsd } = await response.json();
          if (cartTotalUsd > 0 && hypeToUsd > 0) {
            const newTotalHype = cartTotalUsd / hypeToUsd;
            setTotalHypeRequired(newTotalHype);
            if (orderStatus !== "underpaid") {
              setAmountToPay(newTotalHype);
            }
          }
        }
      } catch (error) {
        console.error("Failed to refresh HYPE price:", error);
      }
    }, 15000);

    return () => clearInterval(priceInterval);
  }, [cartTotalUsd, orderStatus, paymentMethod]);

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
    if (!evmAddress || isFinalizing || isExpired) return;

    const verificationInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/verify-payment?evmAddress=${evmAddress}`,
        );
        if (!response.ok) return;

        const data = await response.json();
        setOrderStatus(data.status);
        setTxHash(data.tx_hash);
        if (data.expires_at) {
          setExpiresAt(data.expires_at);
        }

        if (data.status === "completed") {
          setIsFinalizing(true);
          toast.success("Payment complete! Finalizing your order...");
          clearCart();
          localStorage.removeItem("shippingAddress");
          router.push(`/checkout/success?orderId=${data.id}`);
          clearInterval(verificationInterval);
        } else if (data.status === "underpaid") {
          if (data.remaining_amount !== null) {
            setAmountToPay(data.remaining_amount);
          }
          if (data.paid_amount !== null) {
            setPaidAmount(data.paid_amount);
          }
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    }, 5000);

    return () => clearInterval(verificationInterval);
  }, [
    evmAddress,
    isFinalizing,
    router,
    clearCart,
    paymentMethod,
    cartTotalUsd,
    totalHypeRequired,
    isExpired,
  ]);

  const getPaymentMessage = () => {
    if (orderStatus === "underpaid") {
      return (
        <div className="mb-4 text-center">
          <p className="font-semibold text-yellow-500">
            Partial Payment Received!
          </p>
          <p>
            You have paid {paidAmount.toFixed(2)} /{" "}
            {totalHypeRequired.toFixed(2)} $
            {paymentMethod?.toUpperCase() || "HYPE"}.
          </p>
          <p className="mt-2">
            Please send the remaining amount to complete your order.
          </p>
        </div>
      );
    }
    return (
      <p className="mb-6">
        To finalize your order, please send exactly on{" "}
        <span className="text-primary font-bold">HyperEVM</span>:
      </p>
    );
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
        {isFinalizing ? (
          <div>
            <h1 className="mb-4 text-2xl font-bold text-green-500 dark:text-green-400">
              Payment Confirmed!
            </h1>
            <div className="my-4 space-y-2 rounded-lg bg-gray-200 p-4 text-left font-mono text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
              <p className="break-all">
                <span>Tx:</span>{" "}
                <span className="font-bold">{shortenHash(txHash || "")}</span>
              </p>
              <a
                href={`https://explorer.hyperliquid.xyz/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400"
              >
                View on Explorer
              </a>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Finalizing your order... you will be redirected shortly.
            </p>
          </div>
        ) : isExpired ? (
          <div>
            <h1 className="mb-4 text-2xl font-bold text-red-500 dark:text-red-400">
              Payment Window Expired
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
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
              <span>
                {amountToPay.toFixed(4)} $
                {paymentMethod?.toUpperCase() || "HYPE"}
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
            <p className="text-primary mt-4">to the following address:</p>
            <div className="my-6 flex justify-center">
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
                className="bg-primary hover:bg-secondary/80 mt-4 px-10 text-white hover:text-black"
              >
                {copiedAddress ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              The {paymentMethod?.toUpperCase() || "HYPE"} amount may update
              periodically based on the live market price.
            </p>
            <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
              We will scan the blockchain for your payment and confirm your
              order automatically. This page will update upon confirmation.
            </p>
            <div className="mt-6 w-full border-t pt-6">
              <Button
                onClick={() => router.push("/checkout")}
                variant="secondary"
                className="bg-primary hover:bg-secondary/80 w-full px-8 text-white hover:text-black"
                disabled={isFinalizing}
              >
                {isFinalizing ? "Processing..." : "Cancel Payment"}
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
