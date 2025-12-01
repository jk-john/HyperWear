"use client";

import { useCartStore } from "@/stores/cart";
import { useEffect } from "react";

export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
