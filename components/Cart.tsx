"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-11 w-11 text-primary/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-full"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalCartItems > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center p-0 bg-accent text-primary text-xs font-bold rounded-full border-2 border-white">
              {totalCartItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-white/95 backdrop-blur-xl flex flex-col">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-2xl font-bold font-display text-primary">
            Shopping Cart ({totalCartItems})
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-6">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold font-body text-primary">
                      {item.name}
                    </h3>
                    <p className="text-sm text-primary/80">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full">
                    <p className="font-bold text-lg text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary/50 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-24 w-24 text-primary/20" />
              <h3 className="mt-6 text-xl font-semibold font-display text-primary">
                Your cart is empty
              </h3>
              <p className="text-primary/60 mt-2">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <SheetClose asChild>
                <Link href="/products">
                  <Button className="mt-6 bg-primary text-white hover:bg-secondary hover:text-black font-semibold px-6 h-11 rounded-full transition-all duration-300 font-body">
                    Start Shopping
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <SheetFooter className="px-6 py-6 bg-gray-50/80 rounded-t-2xl">
            <div className="w-full">
              <div className="flex justify-between font-bold text-lg text-primary">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-primary/60 mt-1">
                Shipping and taxes calculated at checkout.
              </p>
              <Link href="/checkout">
                <Button className="w-full mt-4 bg-primary text-white hover:bg-secondary hover:text-black font-semibold h-12 rounded-full transition-all duration-300 font-body text-base">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
