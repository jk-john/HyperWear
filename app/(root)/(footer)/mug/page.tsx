const MugPage = () => {
  const features = [
    "Capacity: approx. 330 ml",
    "Material: white ceramic",
    "Heat- and dishwasher-safe print",
    "Microwave safe",
  ];

  const careInstructions = [
    "Hand washing recommended to preserve the print",
    "Dishwasher safe (gentle cycle recommended)",
    "Do not use abrasive sponges or cleaners",
    "Microwave safe",
  ];

  return (
    <div className="bg-dark font-body text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display mb-12 text-center text-4xl font-bold md:text-5xl">
          Mug
        </h1>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Product Description */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Product Description
            </h2>
            <p className="text-white/80">
              High-quality ceramic mug, perfect for enjoying your favorite hot
              beverages while showcasing a unique design.
            </p>
          </div>

          {/* Features */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">Features</h2>
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
        </div>
      </div>
    </div>
  );
};

export default MugPage;
