export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      manual_orders: {
        Row: {
          amount_hype: number;
          cart_total_usd: number;
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          status: string | null;
          wallet_address: string;
        };
        Insert: {
          amount_hype: number;
          cart_total_usd: number;
          created_at?: string;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          status?: string | null;
          wallet_address: string;
        };
        Update: {
          amount_hype?: number;
          cart_total_usd?: number;
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          status?: string | null;
          wallet_address?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          order_id: string;
          price_at_purchase: number;
          product_id: string;
          quantity: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          order_id: string;
          price_at_purchase: number;
          product_id: string;
          quantity: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          order_id?: string;
          price_at_purchase?: number;
          product_id?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_product";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          id: string;
          payment_method: string | null;
          shipping_address_complement: string | null;
          shipping_address_complement_from_line2: string | null;
          shipping_city: string | null;
          shipping_company_name: string | null;
          shipping_country: string | null;
          shipping_delivery_instructions: string | null;
          shipping_email: string | null;
          shipping_first_name: string | null;
          shipping_last_name: string | null;
          shipping_phone_number: string | null;
          shipping_postal_code: string | null;
          shipping_street: string | null;
          status: string | null;
          total: number;
          tx_hash: string | null;
          user_id: string | null;
          wallet_address: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payment_method?: string | null;
          shipping_address_complement?: string | null;
          shipping_address_complement_from_line2?: string | null;
          shipping_city?: string | null;
          shipping_company_name?: string | null;
          shipping_country?: string | null;
          shipping_delivery_instructions?: string | null;
          shipping_email?: string | null;
          shipping_first_name?: string | null;
          shipping_last_name?: string | null;
          shipping_phone_number?: string | null;
          shipping_postal_code?: string | null;
          shipping_street?: string | null;
          status?: string | null;
          total: number;
          tx_hash?: string | null;
          user_id?: string | null;
          wallet_address?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          payment_method?: string | null;
          shipping_address_complement?: string | null;
          shipping_address_complement_from_line2?: string | null;
          shipping_city?: string | null;
          shipping_company_name?: string | null;
          shipping_country?: string | null;
          shipping_delivery_instructions?: string | null;
          shipping_email?: string | null;
          shipping_first_name?: string | null;
          shipping_last_name?: string | null;
          shipping_phone_number?: string | null;
          shipping_postal_code?: string | null;
          shipping_street?: string | null;
          status?: string | null;
          total?: number;
          tx_hash?: string | null;
          user_id?: string | null;
          wallet_address?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          available_sizes: string[] | null;
          category: string | null;
          colors: string[] | null;
          created_at: string | null;
          description: string | null;
          gender: string | null;
          id: string;
          images: string[] | null;
          name: string;
          original_price: number | null;
          price: number;
          slug: string | null;
          tags: string[] | null;
          type: string | null;
        };
        Insert: {
          available_sizes?: string[] | null;
          category?: string | null;
          colors?: string[] | null;
          created_at?: string | null;
          description?: string | null;
          gender?: string | null;
          id?: string;
          images?: string[] | null;
          name: string;
          original_price?: number | null;
          price: number;
          slug?: string | null;
          tags?: string[] | null;
          type?: string | null;
        };
        Update: {
          available_sizes?: string[] | null;
          category?: string | null;
          colors?: string[] | null;
          created_at?: string | null;
          description?: string | null;
          gender?: string | null;
          id?: string;
          images?: string[] | null;
          name?: string;
          original_price?: number | null;
          price?: number;
          slug?: string | null;
          tags?: string[] | null;
          type?: string | null;
        };
        Relationships: [];
      };
      user_addresses: {
        Row: {
          address_complement: string | null;
          city: string | null;
          company_name: string | null;
          country: string | null;
          created_at: string | null;
          delivery_instructions: string | null;
          first_name: string;
          id: string;
          is_default: boolean | null;
          last_name: string;
          phone_number: string;
          postal_code: string | null;
          street: string | null;
          type: Database["public"]["Enums"]["address_type"];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          address_complement?: string | null;
          city?: string | null;
          company_name?: string | null;
          country?: string | null;
          created_at?: string | null;
          delivery_instructions?: string | null;
          first_name: string;
          id?: string;
          is_default?: boolean | null;
          last_name: string;
          phone_number: string;
          postal_code?: string | null;
          street?: string | null;
          type: Database["public"]["Enums"]["address_type"];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          address_complement?: string | null;
          city?: string | null;
          company_name?: string | null;
          country?: string | null;
          created_at?: string | null;
          delivery_instructions?: string | null;
          first_name?: string;
          id?: string;
          is_default?: boolean | null;
          last_name?: string;
          phone_number?: string;
          postal_code?: string | null;
          street?: string | null;
          type?: Database["public"]["Enums"]["address_type"];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          birthday: string | null;
          phone_number: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          birthday?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          birthday?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          wallet_address: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          wallet_address?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          wallet_address?: string | null;
        };
        Relationships: [];
      };
      variants: {
        Row: {
          id: string;
          product_id: string | null;
          size: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          size: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          size?: string;
        };
        Relationships: [
          {
            foreignKeyName: "variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      address_type: "shipping" | "billing";
      product_category: "T-shirts" | "Caps" | "Accessories" | "Plush";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      address_type: ["shipping", "billing"],
      product_category: ["T-shirts", "Caps", "Accessories", "Plush"],
    },
  },
} as const;
