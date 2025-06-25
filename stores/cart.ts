import { getPublicImageUrl } from "@/lib/utils";
import { Product } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem extends Product {
  quantity: number;
  size?: string;
  cartItemId: string; // Unique ID for the cart item (product.id + size)
  imageUrl: string; // Full URL for the product image
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  totalPrice: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product, size) => {
        const cartItemId = size ? `${product.id}-${size}` : product.id;
        const imageUrl = getPublicImageUrl(product.images?.[0]);

        set((state) => {
          const itemInCart = state.cartItems.find(
            (item) => item.cartItemId === cartItemId,
          );
          if (itemInCart) {
            toast.success(`Added another ${product.name} to your cart.`);
            return {
              cartItems: state.cartItems.map((item) =>
                item.cartItemId === cartItemId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          } else {
            toast.success(
              `Added ${product.name}${size ? ` (${size})` : ""} to your cart.`,
            );
            return {
              cartItems: [
                ...state.cartItems,
                { ...product, quantity: 1, size, cartItemId, imageUrl },
              ],
            };
          }
        });
      },
      removeFromCart: (cartItemId) => {
        set((state) => {
          const item = state.cartItems.find(
            (item) => item.cartItemId === cartItemId,
          );
          if (item) {
            toast.success(`Removed ${item.name} from your cart.`);
          }
          return {
            cartItems: state.cartItems.filter(
              (item) => item.cartItemId !== cartItemId,
            ),
          };
        });
      },
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item,
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
      name: "cart-storage-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
