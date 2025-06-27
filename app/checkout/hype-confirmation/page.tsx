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
  const { cartItems } = useCartStore();

  const initialAmount = parseFloat(searchParams.get("amount") || "0");
  const cartTotalUsd = parseFloat(searchParams.get("cartTotal") || "0");
  const evmAddress = searchParams.get("evmAddress");

  const [hypeAmount, setHypeAmount] = useState(initialAmount);
  const [copied, setCopied] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const receivingAddress = LEDGER_RECEIVING_ADDRESS;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(hypeAmount.toFixed(2));
    setCopiedAmount(true);
    setTimeout(() => {
      setCopiedAmount(false);
    }, 2000);
  };

  useEffect(() => {
    const priceInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/hype-price");
        if (response.ok) {
          const { hypeToUsd } = await response.json();
          if (cartTotalUsd > 0 && hypeToUsd > 0) {
            setHypeAmount(cartTotalUsd / hypeToUsd);
          }
        }
      } catch (error) {
        console.error("Failed to refresh HYPE price:", error);
      }
    }, 15000); // 15 seconds

    return () => clearInterval(priceInterval);
  }, [cartTotalUsd]);

  useEffect(() => {
    if (!evmAddress || !hypeAmount || isVerifying || cartItems.length === 0) {
      return;
    }

    const verificationInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/verify-payment?userAddress=${evmAddress}&amount=${hypeAmount}&token=HYPE`,
        );

        if (response.ok) {
          const data = await response.json();
          if (data.txHash) {
            setIsVerifying(true);
            setTxHash(data.txHash);
            toast.success("Payment detected! Finalizing your order...");

            const shippingInfo = JSON.parse(
              localStorage.getItem("shippingAddress") || "{}",
            );

            const formValues = {
              firstName: shippingInfo.firstName,
              lastName: shippingInfo.lastName,
              email: shippingInfo.email,
              street: shippingInfo.street,
              city: shippingInfo.city,
              zip: shippingInfo.zip,
              country: shippingInfo.country,
              paymentMethod: "hype" as const,
              evmAddress: evmAddress,
            };

            const result = await finalizeHypeOrder(
              cartItems,
              data.txHash,
              formValues,
            );

            if (result.success) {
              router.push(`/checkout/success?orderId=${result.orderId}`);
            } else {
              toast.error(result.error || "Failed to finalize your order.");
              router.push("/checkout");
            }
          }
        }
      } catch (error) {
        // This will silently fail and retry, which is acceptable for polling.
        console.error("Error verifying payment:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(verificationInterval);
  }, [evmAddress, hypeAmount, isVerifying, cartItems, router]);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md rounded-lg bg-gray-100 p-8 shadow-lg dark:bg-gray-800">
        {txHash ? (
          <div>
            <h1 className="mb-4 text-2xl font-bold text-green-500 dark:text-green-400">
              Payment Confirmed!
            </h1>
            <div className="my-4 space-y-2 rounded-lg bg-gray-200 p-4 text-left font-mono text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
              <p className="break-all">
                <span>Tx:</span>{" "}
                <span className="font-bold">{shortenHash(txHash)}</span>
              </p>
              <a
                href={`https://explorer.hyperliquid.xyz/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 opacity-50 dark:text-blue-400"
                style={{
                  pointerEvents: "none",
                  cursor: "not-allowed",
                }}
                onClick={(e) => e.preventDefault()}
              >
                View on Explorer (coming soon)
              </a>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Finalizing your order... you will be redirected shortly.
            </p>
          </div>
        ) : (
          <>
            <h1 className="mb-4 text-2xl font-bold">Complete Your Payment</h1>
            <p className="mb-6">
              To finalize your order, please send exactly on{" "}
              <span className="text-primary font-bold">HyperEVM</span> :{" "}
              <div className="text-primary my-2 mt-6 mb-6 flex items-center justify-center space-x-2 text-lg font-bold">
                <span>{hypeAmount.toFixed(2)} $HYPE</span>
                <Button
                  onClick={handleCopyAmount}
                  size="sm"
                  variant="ghost"
                  className="bg-primary hover:bg-secondary/80 ml-9 px-6 py-3 text-xs text-white hover:text-black"
                >
                  {copiedAmount ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="text-primary mt-4">to the following address:</div>
            </p>
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
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              The HYPE amount updates every 15 seconds based on the live market
              price.
            </p>
            <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
              We will scan the blockchain for your payment and confirm your
              order automatically. This page will redirect upon confirmation.
            </p>
            <div className="mt-6 w-full border-t pt-6">
              <Button
                onClick={() => router.push("/checkout")}
                variant="secondary"
                className="bg-primary hover:bg-secondary/80 w-full px-8 text-white hover:text-black"
                disabled={isVerifying}
              >
                {isVerifying ? "Processing..." : "Cancel Payment"}
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
