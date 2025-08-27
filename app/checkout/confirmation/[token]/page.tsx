"use client";

import { Button } from "@/components/ui/button";
import { LEDGER_RECEIVING_ADDRESS } from "@/constants/wallet";
import { useCartStore } from "@/stores/cart";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function HypeConfirmationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { setPendingOrder, clearCart } = useCartStore();
  const supabase = createClient();

  const [order, setOrder] = useState<Tables<"orders"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [successNotified, setSuccessNotified] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const isChecking = useRef(false);

  const receivingAddress = LEDGER_RECEIVING_ADDRESS;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress);
    setCopiedAddress(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const renderStatus = () => {
    if (isPaid) {
      return (
        <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <p className="text-sm font-semibold text-emerald-800">Payment confirmed! ✅</p>
          </div>
        </div>
      );
    }
    if (isCancelled) {
      return (
        <div className="mb-4 rounded-lg bg-gray-50 p-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <p className="text-sm font-semibold text-gray-800">Order cancelled</p>
          </div>
        </div>
      );
    }
    if (isExpired) {
      return (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <p className="text-sm font-semibold text-red-800">Order expired</p>
          </div>
        </div>
      );
    }
    if (timeLeft !== null && timeLeft > 0) {
      return (
        <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-sm font-semibold text-emerald-800">Verifying payment on the blockchain...</p>
          </div>
        </div>
      );
    }
    return null;
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
        const now = new Date().getTime();
        const expirationTime = new Date(order.expires_at!).getTime();
        const timeLeftMs = expirationTime - now;

        if (timeLeftMs <= 0) {
          setTimeLeft(0);
          setIsExpired(true);
        } else {
          setTimeLeft(Math.floor(timeLeftMs / 1000));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order]);

  useEffect(() => {
    if (isCancelled && !successNotified) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCancelled, router, setPendingOrder, successNotified]);

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
        const { data } = await supabase
          .from("orders")
          .select("status, paid_amount, remaining_amount")
          .eq("id", orderId)
          .single();

        if (data) {
          if (data.status === "paid") {
            setIsPaid(true);
          } else if (data.status === "cancelled") {
            setIsCancelled(true);
          }
        }
      } catch (error) {
        console.error("Error checking order status:", error);
      } finally {
        isChecking.current = false;
      }
    };

    checkOrderStatus();
    const interval = setInterval(checkOrderStatus, 15000);
    return () => clearInterval(interval);
  }, [orderId, isPaid, isCancelled, isExpired, supabase]);

  const handleCancel = async () => {
    if (!orderId || isCancelling) return;
    setIsCancelling(true);
    
    try {
      // Client-side implementation of cancel order
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("User not authenticated.");
        setIsCancelling(false);
        return;
      }

      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, user_id, status")
        .eq("id", orderId)
        .single();

      if (fetchError || !order) {
        toast.error("Order not found.");
        setIsCancelling(false);
        return;
      }

      if (order.user_id !== user.id) {
        toast.error("You are not authorized to cancel this order.");
        setIsCancelling(false);
        return;
      }

      if (order.status !== "pending" && order.status !== "underpaid") {
        toast.error(`Cannot cancel an order with status: ${order.status}.`);
        setIsCancelling(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id);

      if (updateError) {
        console.error("Error cancelling order:", updateError);
        toast.error("Failed to cancel the order.");
        setIsCancelling(false);
        return;
      }

      toast.info("Your order has been cancelled.");
      setIsCancelled(true);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel the order.");
      setIsCancelling(false);
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

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--color-dark] px-4">
        <div className="text-center text-[--color-light]">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-[--color-accent] mb-6">
            The order you&apos;re looking for could not be found.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-[--color-secondary] text-[--color-primary] hover:bg-[--color-secondary]/90"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-dark] py-8 px-4">
      <div className="mx-auto max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-[--color-primary] to-[--color-emerald] text-white p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full border-4 border-white/30 backdrop-blur-sm">
                <Image
                  src="/HYPE.svg"
                  alt="HYPE Token"
                  width={40}
                  height={40}
                  className="drop-shadow-lg"
                />
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">
              Complete Your Payment
            </h1>
            <p className="text-white/80 text-sm">
              Send {params.token.toUpperCase()} to the address below
            </p>
            
            {timeLeft !== null && timeLeft > 0 && (
              <div className="mt-4 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <div className="text-sm text-white/70">Time remaining</div>
                <div className="text-2xl font-bold text-white">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
            )}
          </div>

          <div className="p-8">
            {renderStatus()}

            {!isPaid && !isCancelled && !isExpired && (
              <div className="space-y-6">
                {/* QR Code and Address */}
                <div className="text-center space-y-4">
                  <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
                    <QRCodeSVG 
                      value={receivingAddress} 
                      size={200} 
                      level="M"
                      includeMargin={true}
                      className="rounded-lg"
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Receiving Address
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="font-mono text-xs text-gray-800 break-all leading-relaxed">
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
    </div>
  );
}