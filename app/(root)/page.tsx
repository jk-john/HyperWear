import AllProducts from "@/components/AllProducts";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <div className="bg-secondary text-primary w-full py-3 text-center font-bold">
        <p>Free shipping on orders over $60!</p>
      </div>
      <FeaturedProducts />
      <AllProducts />
    </div>
  );
}
