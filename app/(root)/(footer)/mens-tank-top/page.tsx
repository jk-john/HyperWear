const MensTankTopPage = () => {
  const features = [
    "100% combed and ring-spun cotton",
    "Tri-blends: 50% polyester, 25% combed cotton, 25% ring-spun cotton",
    "Athletic Heather color: 90% combed and ring-spun cotton, 10% polyester",
    "Other heather colors: 52% combed and ring-spun cotton, 48% polyester",
    "Fabric weight: 142.40 g/m² (4.2 oz/yd²), tri-blends: 90.07 g/m² (3.8 oz/yd²)",
    "30 singles",
    "Regular fit",
    "Side seams",
  ];

  const careInstructions = [
    "Machine wash cold (max 30°C), gentle cycle",
    "Wash with similar colors",
    "Do not use bleach",
    "Iron on low heat",
    "Do not tumble dry, prefer air drying",
    "Do not dry clean",
  ];

  return (
    <div className="bg-dark font-body text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display mb-12 text-center text-4xl font-bold md:text-5xl">
          Men&apos;s Tank Top
        </h1>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Product Description */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Product Description
            </h2>
            <p className="space-y-4 text-white/80">
              <span>
                The men&apos;s tank top is designed with a durable, high-quality
                fabric that easily adapts to movement.
              </span>
              <br />
              <span>
                Perfect for a sunny day or to feature in your online store.
              </span>
            </p>
          </div>

          {/* Composition & Features */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Composition & Features
            </h2>
            <ul className="list-inside list-disc space-y-2 text-white/80">
              {features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Care Instructions */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Care Instructions
            </h2>
            <ul className="list-inside list-disc space-y-2 text-white/80">
              {careInstructions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Size Guide */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">Size Guide</h2>
            <p className="text-white/80">
              This tank top has a regular fit and standard length. Choose your
              usual size for a classic fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensTankTopPage;
