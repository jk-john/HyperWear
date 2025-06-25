"use client";

import { Button } from "@/components/ui/Button";
import { LEDGER_RECEIVING_ADDRESS } from "@/constants/wallet";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useState } from "react";

function HypeConfirmation() {
  const searchParams = useSearchParams();
  const initialAmount = parseFloat(searchParams.get("amount") || "0");
  const cartTotalUsd = parseFloat(searchParams.get("cartTotal") || "0");

  const [hypeAmount, setHypeAmount] = useState(initialAmount);
  const [copied, setCopied] = useState(false);

  const receivingAddress = LEDGER_RECEIVING_ADDRESS;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
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

    return () => clearInterval(interval);
  }, [cartTotalUsd]);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md rounded-lg bg-gray-100 p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold">Complete Your Payment</h1>
        <p className="mb-6">
          To finalize your order, please send exactly
          <br />
          <strong className="text-primary text-lg">
            {hypeAmount.toFixed(2)} HYPE
          </strong>
          <br />
          to the following address:
        </p>
        <div className="my-6 flex justify-center">
          <QRCodeSVG value={receivingAddress} size={128} />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="font-mono text-sm break-all">{receivingAddress}</div>
          <Button onClick={handleCopyAddress} size="sm" variant="ghost">
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          The HYPE amount updates every 15 seconds based on the live market
          price.
        </p>
        <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          We will scan the blockchain for your payment and confirm your order
          automatically.
        </p>
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
