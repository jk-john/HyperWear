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
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export const Cart = ({
  displayMode = "icon",
}: {
  displayMode?: "icon" | "button";
}) => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } =
    useCartStore();
  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {displayMode === "button" ? (
          <Button
            variant="ghost"
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 p-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Cart</span>
            {totalCartItems > 0 && (
              <Badge className="bg-accent text-primary ml-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white p-0 text-xs font-bold">
                {totalCartItems}
              </Badge>
            )}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-primary/80 hover:text-primary relative h-11 w-11 cursor-pointer rounded-full hover:bg-gray-100"
          >
            <ShoppingBag className="h-8 w-8" />
            {totalCartItems > 0 && (
              <Badge className="bg-accent text-primary absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white p-0 text-xs font-bold">
                {totalCartItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-[400px] flex-col bg-white/95 backdrop-blur-xl sm:w-[540px]">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="font-display text-primary text-2xl font-bold">
            Shopping Cart ({totalCartItems})
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-4 py-6"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-body text-primary font-semibold">
                      {item.name}
                    </h3>
                    {item.size && (
                      <p className="text-primary/80 text-sm font-medium">
                        Size: {item.size}
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
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
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
        {cartItems.length > 0 && (
          <SheetFooter className="rounded-t-2xl bg-gray-50/80 px-6 py-6">
            <div className="w-full">
              <div className="text-primary flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <p className="text-primary/60 mt-1 text-sm">
                Shipping and taxes calculated at checkout.
              </p>
              <Button
                onClick={handleCheckout}
                className="bg-primary hover:bg-secondary font-body mt-4 h-12 w-full rounded-full text-base font-semibold text-white transition-all duration-300 hover:text-black"
              >
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
