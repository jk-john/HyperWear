export type PageProps = {
  params?: {
    slug: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

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
