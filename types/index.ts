import { Database } from "./supabase";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Omit<
  Database["public"]["Tables"]["order_items"]["Row"],
  "product_id"
> & {
  product: Product;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  variant_id: string | null;
  imageUrl: string;
  cartItemId: string;
};

export type ShippingAddress = {
  first_name: string;
  last_name: string;
  phone_number: string;
  street: string;
  address_complement?: string | null;
  city: string;
  postal_code: string;
  country: string;
  company_name?: string | null;
  delivery_instructions?: string | null;
};

export type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  street: string;
  addressComplement?: string;
  city: string;
  zip: string;
  country: string;
  companyName?: string;
  deliveryInstructions?: string;
  paymentMethod: "stripe" | "nowpayments" | "hype" | "usdhl" | "usdt0";
  evmAddress?: string;
};
