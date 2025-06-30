import AllProducts from "@/components/AllProducts";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedProducts />
      <AllProducts />
    </div>
  );
}
