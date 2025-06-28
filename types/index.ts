import { Database } from "./supabase";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Omit<
  Database["public"]["Tables"]["order_items"]["Row"],
  "product_id"
> & {
  product: Product;
};
