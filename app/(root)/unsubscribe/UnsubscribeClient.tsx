"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) {
      setMessage("❌ Something went wrong. Email is missing.");
      return;
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch("/api/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setMessage("✅ You've been unsubscribed successfully.");
        } else {
          const data = await response.json();
          setMessage(
            `❌ Something went wrong: ${data.error || "Please try again."}`,
          );
        }
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setMessage("❌ An unexpected error occurred. Please try again later.");
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Unsubscribe</h1>
        <p className="text-lg">{message || "Processing your request..."}</p>
      </div>
    </div>
  );
}
