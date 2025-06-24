"use client";

import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useState } from "react";

function HypeConfirmation() {
  const searchParams = useSearchParams();
  const initialAmount = parseFloat(searchParams.get("amount") || "0");
  const cartTotalUsd = parseFloat(searchParams.get("cartTotal") || "0");

  const [hypeAmount, setHypeAmount] = useState(initialAmount);
  const ledgerAddress = "0xYourLedgerAddressHere";

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
            {hypeAmount.toFixed(6)} HYPE
          </strong>
          <br />
          to the following address:
        </p>
        <div className="my-6 flex justify-center">
          <QRCodeSVG value={ledgerAddress} size={128} />
        </div>
        <p className="font-mono text-sm break-words">{ledgerAddress}</p>
        <p className="mt-4 text-xs text-gray-500">
          The HYPE amount updates every 15 seconds based on the live market
          price.
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
