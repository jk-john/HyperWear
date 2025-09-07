import { createClient } from "@/lib/supabase/client";
import { getCartImageUrl } from "@/lib/utils";
import { Product } from "@/types";
import { Tables } from "@/types/supabase";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
  cartItemId: string; // Unique ID for the cart item (product.id + size + color)
  imageUrl: string; // Full URL for the product image
}

type Order = Tables<"orders">;    

interface CartState {
  cartItems: CartItem[];
  pendingOrder: Order | null;
  timeLeft: number | null;
  timerId: number | null;
  isCancelling: boolean;
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  totalPrice: () => number;
  clearCart: () => void;
  checkPendingOrder: (userId: string) => Promise<void>;
  cancelPendingOrder: () => Promise<void>;
  setPendingOrder: (order: Order | null) => void;
}

const supabase = createClient();




export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      pendingOrder: null,
      timeLeft: null,
      timerId: null,
      isCancelling: false,

      setPendingOrder: (order) => {
        set({ pendingOrder: order, timerId: null });
        
        if (order && order.expires_at) {
          const expiryTime = new Date(order.expires_at).getTime();
          const updateTimer = () => {
            const now = new Date().getTime();
            const distance = expiryTime - now;
            if (distance < 0) {
              set({ timeLeft: 0, timerId: null });
              if (get().pendingOrder?.status === "pending" && !get().isCancelling) {
                get().cancelPendingOrder();
              }
            } else {
              set({ timeLeft: Math.floor(distance / 1000) });
            }
          };
          
          // Only set up timer on client-side to prevent hydration issues
          if (typeof window !== 'undefined') {
            // Initial call
            updateTimer();
            
            // Set up interval (update every second)
            const newTimerId = window.setInterval(updateTimer, 1000);
            set({ timerId: newTimerId });
          } else {
            // Server-side: set consistent initial state
            const now = new Date().getTime();
            const serverDistance = expiryTime - now;
            set({ timeLeft: Math.floor(serverDistance / 1000), timerId: null });
          }
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
                color: item.color ?? undefined,
                cartItemId: `${product.id!}-${item.size || "nosize"}-${item.color || "nocolor"}`,
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
        if (!orderToCancel || get().isCancelling) return;

        set({ isCancelling: true });

        try {
          // Client-side implementation of cancel order to avoid HMR issues
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            toast.error("User not authenticated.");
            set({ isCancelling: false });
            return;
          }

          const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("id, user_id, status")
            .eq("id", orderToCancel.id)
            .single();

          if (fetchError || !order) {
            console.log("Order not found during cancellation, clearing pending order state");
            // Clear the pending order state instead of showing error toast
            const currentTimerId = get().timerId;
            if (currentTimerId) {
              clearInterval(currentTimerId);
            }
            set({ pendingOrder: null, timeLeft: null, timerId: null, isCancelling: false });
            return;
          }

          if (order.user_id !== user.id) {
            toast.error("You are not authorized to cancel this order.");
            set({ isCancelling: false });
            return;
          }

          if (order.status !== "pending" && order.status !== "underpaid") {
            toast.error(`Cannot cancel an order with status: ${order.status}.`);
            set({ isCancelling: false });
            return;
          }

          const { error: updateError } = await supabase
            .from("orders")
            .update({ status: "cancelled" })
            .eq("id", order.id);

          if (updateError) {
            console.error("Error cancelling order:", updateError);
            toast.error("Failed to cancel the order.");
            set({ isCancelling: false });
            return;
          }

          const currentTimerId = get().timerId;
          if (currentTimerId) {
            clearInterval(currentTimerId);
          }
          set({ pendingOrder: null, timeLeft: null, timerId: null, cartItems: [], isCancelling: false });
          setTimeout(() => toast.success("Your pending order has been cancelled."), 0);
        } catch (error) {
          console.error("Error cancelling order:", error);
          set({ isCancelling: false });
          setTimeout(() => toast.error("Failed to cancel the order."), 0);
        }
      },

      addToCart: (product, size, color) => {
        if (get().pendingOrder) {
          toast.error(
            "You have a pending payment. Please complete or cancel it before adding new items.",
          );
          return;
        }

        const cartItemId = `${product.id!}-${size || "nosize"}-${color || "nocolor"}`;

        // Get the best image URL for this product
        const imageUrl = getCartImageUrl(product);

        const state = get();
        const itemInCart = state.cartItems.find(
          (item) => item.cartItemId === cartItemId,
        );

        if (itemInCart) {
          set({
            cartItems: state.cartItems.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
          // Toast after state update to avoid render-time calls
          setTimeout(() => toast.success(`Added another ${product.name} to your cart.`), 0);
        } else {
          const sizeColorText = [size, color].filter(Boolean).join(", ");
          set({
            cartItems: [
              ...state.cartItems,
              { ...product, quantity: 1, size, color, cartItemId, imageUrl },
            ],
          });
          // Toast after state update to avoid render-time calls
          setTimeout(() => toast.success(
            `Added ${product.name}${sizeColorText ? ` (${sizeColorText})` : ""} to your cart.`,
          ), 0);
        }
      },

      removeFromCart: (cartItemId) => {
        const state = get();
        const item = state.cartItems.find(
          (item) => item.cartItemId === cartItemId,
        );

        set({
          cartItems: state.cartItems.filter(
            (item) => item.cartItemId !== cartItemId,
          ),
        });

        if (item) {
          // Toast after state update to avoid render-time calls
          setTimeout(() => toast.success(`Removed ${item.name} from your cart.`), 0);
        }
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
        if (currentTimerId && typeof window !== 'undefined') {
          clearInterval(currentTimerId);
        }
        set({ cartItems: [], pendingOrder: null, timeLeft: null, timerId: null, isCancelling: false });
      },
    }),
    {
      name: "cart-storage-v2",
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      ),
    },
  ),
);
