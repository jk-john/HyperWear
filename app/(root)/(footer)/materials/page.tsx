import Link from "next/link";

const MaterialsPage = () => {
  return (
    <div className="bg-dark2 min-h-screen text-white">
      <div className="container mx-auto px-6 py-16">
        <h1 className="font-display mb-12 text-center text-4xl font-bold">
          Our Materials
        </h1>
        <div className="mx-auto max-w-4xl text-center text-white/70">
          <p className="mb-4">
            We are committed to using high-quality materials for all our
            products to ensure comfort, durability, and a premium feel.
          </p>
          <p className="mb-4">
            Detailed information on the materials used for each specific product
            can be found on the product&apos;s page.
          </p>
          <p>
            If you have any specific questions about our materials, please
            don&apos;t hesitate to{" "}
            <Link href="/support" className="text-accent underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
