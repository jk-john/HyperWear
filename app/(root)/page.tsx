import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <div className="bg-primary">
      <div className="-mt-28">
        <Hero />
        <FeaturedProducts />
      </div>
    </div>
  );
}
