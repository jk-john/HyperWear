import { Socials } from "@/components/Socials";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "Check out the latest Web3 clothing and crypto fashion at HyperWear.io. Fresh drops of HyperLiquid merch and more.",
  alternates: {
    canonical: "/new-arrivals",
  },
  openGraph: {
    title: "New Arrivals | HyperWear.io",
    description:
      "Check out the latest Web3 clothing and crypto fashion at HyperWear.io. Fresh drops of HyperLiquid merch and more.",
    url: "/new-arrivals",
  },
};

export default function NewArrivalsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Image
        src="/purr-lying-happy.png"
        alt="Happy cat"
        width={150}
        height={150}
        className="shadow-emerald/20 rounded-full shadow-2xl"
      />
      <h1 className="text-secondary mt-8 text-4xl font-bold">Coming Soon!</h1>
      <p className="text-accent mt-4 text-lg">
        We are working hard to bring you new and exciting products. Stay tuned!
      </p>
      <div className="mt-8">
        <p className="text-accent text-lg">
          Join us on our socials for more updates!
        </p>
        <div className="mt-4 flex justify-center">
          <Socials />
        </div>
      </div>
    </div>
  );
}
