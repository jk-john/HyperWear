import { cancelOrder } from "@/app/checkout/actions";
import { getPublicImageUrl } from "@/lib/utils";
import { Product } from "@/types";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem extends Product {
  quantity: number;
  size?: string;
  cartItemId: string; // Unique ID for the cart item (product.id + size)
  imageUrl: string; // Full URL for the product image
}

type Order = Tables<"orders">;

interface CartState {
  cartItems: CartItem[];
  pendingOrder: Order | null;
  timeLeft: number | null;
  timerId: number | null;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  totalPrice: () => number;
  clearCart: () => void;
  checkPendingOrder: (userId: string) => Promise<void>;
  cancelPendingOrder: () => Promise<void>;
  setPendingOrder: (order: Order | null) => void;
}

const supabase = createClient();

// Helper function to ensure we get a valid image URL for the cart
const getCartImageUrl = (product: Product, variantName?: string): string => {
  let bestImageUrl = product.images?.[0] || "";
  
  // Try to find a better image based on variant name
  if (product.images && product.images.length > 1 && variantName) {
    const foundImage = product.images.find((img) =>
      img.toLowerCase().includes(variantName.toLowerCase().trim()),
    );
    if (foundImage) {
      bestImageUrl = foundImage;
    }
  }

  // If we already have a full URL (starts with http), return it directly
  if (bestImageUrl.startsWith("http")) {
    return bestImageUrl;
  }

  // Otherwise, process it through getPublicImageUrl
  return getPublicImageUrl(bestImageUrl);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      pendingOrder: null,
      timeLeft: null,
      timerId: null,

      setPendingOrder: (order) => {
        set({ pendingOrder: order, timerId: null });
        
        if (order && order.expires_at) {
          const expiryTime = new Date(order.expires_at).getTime();
          const updateTimer = () => {
            const now = new Date().getTime();
            const distance = expiryTime - now;
            if (distance < 0) {
              set({ timeLeft: 0, timerId: null });
              if (get().pendingOrder?.status === "pending") {
                get().cancelPendingOrder();
              }
            } else {
              set({ timeLeft: Math.floor(distance / 1000) });
            }
          };
          
          // Initial call
          updateTimer();
          
          // Set up interval (update every second)
          const newTimerId = window.setInterval(updateTimer, 1000);
          set({ timerId: newTimerId });
        } else {
          set({ timeLeft: null, timerId: null });
        }
      },

      checkPendingOrder: async (userId: string) => {
        const { data: order, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .in("status", ["pending", "underpaid"])
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error checking for pending order:", error);
          get().setPendingOrder(null);
          return;
        }

        if (order) {
          const { data: orderItems, error: itemsError } = await supabase
            .from("order_items")
            .select("*, products(*)")
            .eq("order_id", order.id);

          if (itemsError) {
            console.error(
              "Error fetching items for pending order:",
              itemsError,
            );
            get().setPendingOrder(order);
            set({ cartItems: [] }); // Fallback to old behavior if items can't be fetched
            return;
          }

          const newCartItems: CartItem[] = orderItems
            .filter((item) => item.products)
            .map((item) => {
              const product = item.products as Product;
              return {
                ...product,
                price: Number(item.price_at_purchase),
                quantity: item.quantity,
                size: item.size ?? undefined,
                cartItemId: `${product.id!}-${item.size || "nosize"}`,
                imageUrl: getCartImageUrl(product),
              };
            });

          set({ cartItems: newCartItems });
          get().setPendingOrder(order);
        } else {
          // If no pending order is found, we should not clear the cart,
          // as the user might be returning to a cart they built previously.
          get().setPendingOrder(null);
        }
      },

      cancelPendingOrder: async () => {
        const orderToCancel = get().pendingOrder;
        if (!orderToCancel) return;

        // Use the new server action
        const result = await cancelOrder(orderToCancel.id);

        if (result.success) {
          toast.success("Your pending order has been cancelled.");
          const currentTimerId = get().timerId;
          if (currentTimerId) {
            clearInterval(currentTimerId);
          }
          set({ pendingOrder: null, timeLeft: null, timerId: null, cartItems: [] });
        } else {
          toast.error(result.error || "Failed to cancel your order.");
          console.error("Error cancelling order:", result.error);
        }
      },

      addToCart: (product, size) => {
        if (get().pendingOrder) {
          toast.error(
            "You have a pending payment. Please complete or cancel it before adding new items.",
          );
          return;
        }

        const cartItemId = `${product.id!}-${size || "nosize"}`;

        // Get the best image URL for this product variant
        const variantName = product.name.split(" - ")[1];
        const imageUrl = getCartImageUrl(product, variantName);

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
        const currentTimerId = get().timerId;
        if (currentTimerId) {
          clearInterval(currentTimerId);
        }
        set({ cartItems: [], pendingOrder: null, timeLeft: null, timerId: null });
      },
    }),
    {
      name: "cart-storage-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
