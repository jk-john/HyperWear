"use client";

import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Minus, Plus, ShoppingBag, X } from "@/components/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const Cart = ({
  displayMode = "icon",
}: {
  displayMode?: "icon" | "button";
}) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalPrice,
    pendingOrder,
    timeLeft,
    checkPendingOrder,
    cancelPendingOrder,
  } = useCartStore();

  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      checkPendingOrder(user.id);
    }
  }, [user, checkPendingOrder]);

  // Reset navigation state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setIsNavigating(false);
    }
  }, [isOpen]);

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const router = useRouter();

  // Prefetch checkout routes for snappier navigation
  useEffect(() => {
    router.prefetch("/checkout");
    if (pendingOrder) {
      router.prefetch(
        `/checkout/confirmation/${pendingOrder.payment_method?.toLowerCase()}?orderId=${
          pendingOrder.id
        }`
      );
    }
  }, [router, pendingOrder]);

  const handleCheckout = async () => {
    if (isNavigating) return; // Prevent double clicks
    
    setIsNavigating(true);
    
    try {
      // SheetClose component will handle closing the sheet
      await router.push("/checkout");
    } catch (error) {
      console.error("Navigation to checkout failed:", error);
      // If navigation fails, reset the navigating state
      setIsNavigating(false);
    }
  };

  const handleGoToPayment = async () => {
    if (!pendingOrder || isNavigating) return; // Prevent double clicks
    
    setIsNavigating(true);
    
    try {
      // SheetClose component will handle closing the sheet
      await router.push(
        `/checkout/confirmation/${pendingOrder.payment_method?.toLowerCase()}?orderId=${
          pendingOrder.id
        }`,
      );
    } catch (error) {
      console.error("Navigation to payment failed:", error);
      // If navigation fails, reset the navigating state
      setIsNavigating(false);
    }
  };

  const handleCancelOrder = async () => {
    await cancelPendingOrder();
  };

  const hasPendingCryptoOrder =
    pendingOrder &&
    (pendingOrder.payment_method === "HYPE" ||
      pendingOrder.payment_method === "USDT0" ||
      pendingOrder.payment_method === "USDHL");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {displayMode === "button" ? (
          <Button
            variant="ghost"
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 p-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Cart</span>
            {(totalCartItems > 0 || hasPendingCryptoOrder) && (
              <Badge className="bg-accent text-primary ml-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white p-0 text-xs font-bold">
                {hasPendingCryptoOrder ? "!" : totalCartItems}
              </Badge>
            )}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-primary/80 hover:text-primary relative h-11 w-11 cursor-pointer rounded-full hover:bg-gray-100"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag className="h-8 w-8" />
            {(totalCartItems > 0 || hasPendingCryptoOrder) && (
              <Badge className="bg-accent text-primary absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white p-0 text-xs font-bold">
                {hasPendingCryptoOrder ? "!" : totalCartItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-[400px] flex-col bg-white/95 backdrop-blur-xl sm:w-[540px]">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="font-display text-primary text-2xl font-bold">
            {hasPendingCryptoOrder
              ? "Pending Payment"
              : `Shopping Cart (${totalCartItems})`}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {cartItems.map((item, index) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-4 py-6"
                >
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={`${item.name} product image`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-lg border border-gray-200 object-cover"
                      priority={index < 3}
                      loading={index < 3 ? "eager" : "lazy"}
                      quality={85}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body text-primary font-semibold truncate">
                      {item.name}
                    </h3>
                    {item.size && (
                      <p className="text-primary/80 text-sm font-medium">
                        Size: {item.size}
                      </p>
                    )}
                    {item.iphoneModel && (
                      <p className="text-primary/80 text-sm font-medium">
                        Model: {item.iphoneModel}
                      </p>
                    )}
                    <p className="text-primary/80 text-sm">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity - 1)
                        }
                        disabled={!!hasPendingCryptoOrder}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold" aria-live="polite" aria-atomic="true">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                        disabled={!!hasPendingCryptoOrder}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex h-full flex-col items-end justify-between">
                    <p className="text-primary text-lg font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary/50 hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => removeFromCart(item.cartItemId)}
                      disabled={!!hasPendingCryptoOrder}
                      aria-label={`Remove ${item.name} from your cart`}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-1 flex-col items-center justify-center text-center">
              <ShoppingBag className="text-primary/20 h-24 w-24" />
              <h3 className="font-display text-primary mt-6 text-xl font-semibold">
                Your cart is empty
              </h3>
              <p className="text-primary/60 mt-2">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <SheetClose asChild>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-secondary font-body mt-6 h-11 rounded-full px-6 font-semibold text-white transition-all duration-300 hover:text-black">
                    Start Shopping
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
        <SheetFooter className="rounded-t-2xl bg-gray-50/80 px-6 py-6">
          {hasPendingCryptoOrder ? (
            <div className="w-full">
              <div className="text-primary mb-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(pendingOrder?.total ?? pendingOrder?.amount_total ?? 0).toFixed(2)}</span>
              </div>
              {timeLeft !== null && (
                <div className="mb-3 text-center text-lg font-bold text-red-500">
                  Time left: {formatTime(timeLeft)}
                </div>
              )}
              <div className="w-full space-y-3">
                <SheetClose asChild>
                  <Button
                    onClick={handleGoToPayment}
                    disabled={isNavigating}
                    className="bg-primary hover:bg-secondary font-body h-12 w-full rounded-full text-base font-semibold text-white transition-all duration-300 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isNavigating ? "Loading..." : "Complete Payment"}
                  </Button>
                </SheetClose>
                <Button
                  onClick={handleCancelOrder}
                  variant="outline"
                  className="w-full"
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="w-full">
              <div className="text-primary flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <p className="text-primary/60 mt-1 text-sm">
                Shipping and taxes calculated at checkout.
              </p>
              <SheetClose asChild>
                <Button
                  onClick={handleCheckout}
                  disabled={isNavigating}
                  className="bg-primary hover:bg-secondary font-body mt-4 h-12 w-full rounded-full text-base font-semibold text-white transition-all duration-300 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isNavigating ? "Loading..." : "Proceed to Checkout"}
                </Button>
              </SheetClose>
            </div>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
