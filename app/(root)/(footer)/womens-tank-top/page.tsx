const WomensTankTopPage = () => {
  const features = [
    "52% Airlume combed and ring-spun cotton, 48% polyester",
    "Athletic Heather color: 90% combed cotton / 10% polyester",
    "Fabric weight: 183 g/m² (5.4 oz/yd²)",
    "Yarn diameter: 32 singles",
    "1x1 micro-ribbed knit",
    "Pre-laundered fabric",
    "Stretchy and comfortable fit",
    "Mid-crop length",
    "Thick straps",
    "Scoop neckline",
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
          Women&apos;s Tank Top
        </h1>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Product Description */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Product Description
            </h2>
            <p className="space-y-4 text-white/80">
              <span>
                This women&apos;s tank top modernizes a classic with a
                flattering 1x1 micro-ribbed knit, thick straps, and a mid-length
                cut.
              </span>
              <br />
              <span>
                Its soft and stretchy fabric ensures optimal comfort all day
                long.
              </span>
              <br />
              <span>
                Ideal to pair with high-waisted jeans or a blazer for a chic and
                casual look.
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
              The fit is stretchy and close-fitting, with a medium length.
              Choose your usual size for a fitted look, or a size up for a more
              relaxed fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WomensTankTopPage;
