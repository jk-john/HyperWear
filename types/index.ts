export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  colors?: string[];
  tags?: string[];
  category?: string;
  created_at: string;
};
