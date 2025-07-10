export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      email_logs: {
        Row: {
          email_type: string
          error_message: string | null
          id: string
          order_id: string | null
          sent_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          email_type: string
          error_message?: string | null
          id?: string
          order_id?: string | null
          sent_at?: string
          status: string
          user_id?: string | null
        }
        Update: {
          email_type?: string
          error_message?: string | null
          id?: string
          order_id?: string | null
          sent_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      manual_orders: {
        Row: {
          amount_hype: number
          cart_total_usd: number
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          status: string | null
          wallet_address: string
        }
        Insert: {
          amount_hype: number
          cart_total_usd: number
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          status?: string | null
          wallet_address: string
        }
        Update: {
          amount_hype?: number
          cart_total_usd?: number
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          status?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
          size: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
          size?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          paid_amount: number | null
          payment_method: string | null
          remaining_amount: number | null
          shipping_address_complement: string | null
          shipping_address_complement_from_line2: string | null
          shipping_city: string | null
          shipping_company_name: string | null
          shipping_country: string | null
          shipping_delivery_instructions: string | null
          shipping_email: string | null
          shipping_first_name: string | null
          shipping_last_name: string | null
          shipping_phone_number: string | null
          shipping_postal_code: string | null
          shipping_street: string | null
          status: string | null
          total: number | null
          total_token_amount: number
          tx_hashes: string[] | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          paid_amount?: number | null
          payment_method?: string | null
          remaining_amount?: number | null
          shipping_address_complement?: string | null
          shipping_address_complement_from_line2?: string | null
          shipping_city?: string | null
          shipping_company_name?: string | null
          shipping_country?: string | null
          shipping_delivery_instructions?: string | null
          shipping_email?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_phone_number?: string | null
          shipping_postal_code?: string | null
          shipping_street?: string | null
          status?: string | null
          total?: number | null
          total_token_amount: number
          tx_hashes?: string[] | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          paid_amount?: number | null
          payment_method?: string | null
          remaining_amount?: number | null
          shipping_address_complement?: string | null
          shipping_address_complement_from_line2?: string | null
          shipping_city?: string | null
          shipping_company_name?: string | null
          shipping_country?: string | null
          shipping_delivery_instructions?: string | null
          shipping_email?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_phone_number?: string | null
          shipping_postal_code?: string | null
          shipping_street?: string | null
          status?: string | null
          total?: number | null
          total_token_amount?: number
          tx_hashes?: string[] | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          available_sizes: string[] | null
          category: string | null
          colors: string[] | null
          created_at: string | null
          description: string | null
          gender: string | null
          id: string
          images: string[] | null
          name: string
          original_price: number | null
          price: number
          slug: string | null
          tags: string[] | null
          type: string | null
        }
        Insert: {
          available_sizes?: string[] | null
          category?: string | null
          colors?: string[] | null
          created_at?: string | null
          description?: string | null
          gender?: string | null
          id?: string
          images?: string[] | null
          name: string
          original_price?: number | null
          price: number
          slug?: string | null
          tags?: string[] | null
          type?: string | null
        }
        Update: {
          available_sizes?: string[] | null
          category?: string | null
          colors?: string[] | null
          created_at?: string | null
          description?: string | null
          gender?: string | null
          id?: string
          images?: string[] | null
          name?: string
          original_price?: number | null
          price?: number
          slug?: string | null
          tags?: string[] | null
          type?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          unsubscribed: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          unsubscribed?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          unsubscribed?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_complement: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          delivery_instructions: string | null
          first_name: string
          id: string
          is_default: boolean | null
          last_name: string
          phone_number: string
          postal_code: string | null
          street: string | null
          type: Database["public"]["Enums"]["address_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_complement?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          delivery_instructions?: string | null
          first_name: string
          id?: string
          is_default?: boolean | null
          last_name: string
          phone_number: string
          postal_code?: string | null
          street?: string | null
          type: Database["public"]["Enums"]["address_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_complement?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          delivery_instructions?: string | null
          first_name?: string
          id?: string
          is_default?: boolean | null
          last_name?: string
          phone_number?: string
          postal_code?: string | null
          street?: string | null
          type?: Database["public"]["Enums"]["address_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          birthday: string | null
          phone_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birthday?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birthday?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_distinct_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
        }[]
      }
    }
    Enums: {
      address_type: "shipping" | "billing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      address_type: ["shipping", "billing"],
    },
  },
} as const
