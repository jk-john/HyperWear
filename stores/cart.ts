import { Product } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalPrice: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product) => {
        set((state) => {
          const itemInCart = state.cartItems.find(
            (item) => item.id === product.id,
          );
          if (itemInCart) {
            toast.success(`Added another ${product.name} to your cart.`);
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          } else {
            toast.success(`Added ${product.name} to your cart.`);
            return {
              cartItems: [...state.cartItems, { ...product, quantity: 1 }],
            };
          }
        });
      },
      removeFromCart: (productId) => {
        set((state) => {
          const item = state.cartItems.find((item) => item.id === productId);
          if (item) {
            toast.success(`Removed ${item.name} from your cart.`);
          }
          return {
            cartItems: state.cartItems.filter((item) => item.id !== productId),
          };
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          ),
        }));
      },
      totalPrice: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
