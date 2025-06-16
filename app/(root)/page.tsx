import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <div className="bg-primary">
      <Header />
      <div className="-mt-28">
        <Hero />
        <Footer />
      </div>
    </div>
  );
}
