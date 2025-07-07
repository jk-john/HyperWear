import SearchPage from "@/components/SearchPage";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Search • HyperWear",
};

export default async function Search(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = createClient();
  const query = searchParams?.q as string;

  let products = [];
  if (query) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    products = data || [];
  }

  return (
    <main className="container mx-auto py-8">
      <SearchPage products={products} query={query} />
    </main>
  );
}
