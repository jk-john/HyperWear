const ClassicCapPage = () => {
  const features = [
    "100% chino cotton twill (except Green Camo: 35% cotton twill, 65% polyester)",
    "Unstructured, low-profile curved visor",
    "6 embroidered eyelets",
    "Crown height: 3 ⅛ inches",
    "Adjustable antique buckle strap",
    "Contains 0% recycled polyester",
    "Contains 0% hazardous substances",
  ];

  const careInstructions = [
    "Hand wash recommended to minimize microfiber release",
    "Do not bleach",
    "Do not tumble dry",
    "Air dry only",
    "Avoid ironing the buckle or embroidered areas",
    "Do not dry clean",
  ];

  return (
    <div className="bg-dark font-body text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display mb-12 text-center text-4xl font-bold md:text-5xl">
          Classic Cap
        </h1>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Product Description */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Product Description
            </h2>
            <p className="text-white/80">
              This classic cap features a relaxed, unstructured fit, a curved
              visor, and an adjustable buckle strap. The perfect blend of
              comfort and style!
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
        </div>
      </div>
    </div>
  );
};

export default ClassicCapPage;
