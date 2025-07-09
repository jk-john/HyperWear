const IphoneCasePage = () => {
  const features = [
    "Hybrid material: thermoplastic polyurethane (TPU) and polycarbonate (PC)",
    "Solid, durable polycarbonate back",
    "Flexible, secure TPU sides",
    "Raised front frame to protect the screen",
    "Precisely aligned port openings",
    "Easy to put on and remove",
    "Wireless charging compatible",
    "UV-printed designs with smooth matte finish",
    "Blank product sourced from China",
  ];

  const importantNotes = [
    "Designs with fine lines may reveal white underlayers on edges.",
    "Print quality of semi-transparent designs may vary by production location.",
    "The case may include an internal protective film that must be removed before use.",
    "iPhone 15 and 16 series cases cannot be shipped to South Korea, Hong Kong, Taiwan, Japan, or Singapore. Please inform customers in these regions accordingly.",
  ];

  const careInstructions = [
    "Clean the case with a soft, damp cloth",
    "Avoid abrasive or chemical cleaners",
    "Remove the case to clean your phone",
    "Do not expose to extreme temperatures",
  ];

  return (
    <div className="bg-dark font-body text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display mb-12 text-center text-4xl font-bold md:text-5xl">
          iPhone Case
        </h1>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Product Description */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Product Description
            </h2>
            <p className="text-white/80">
              This slim yet durable case provides solid protection against
              scratches, dust, oil, and dirt while perfectly fitting your phone.
              Its smooth finish makes it elegant and comfortable to hold.
            </p>
          </div>

          {/* Compatibility */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Compatibility
            </h2>
            <p className="text-white/80">
              Available for iPhone models from iPhone 7 up to iPhone 16 Pro Max.
            </p>
          </div>

          {/* Composition & Features */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Composition & Features
            </h2>
            <ul className="mb-6 list-inside list-disc space-y-2 text-white/80">
              {features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3 className="font-display mb-3 text-xl font-bold">
              Important Notes:
            </h3>
            <ul className="list-inside list-disc space-y-2 text-white/80">
              {importantNotes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* MagSafe Compatibility */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              MagSafe® Compatibility
            </h2>
            <p className="text-white/80">
              Apple® recommends using MagSafe® accessories, including their
              silicone phone cases and chargers, but other cases may also be
              compatible. MagSafe® compatibility is not guaranteed.
            </p>
          </div>

          {/* Legal Information */}
          <div className="bg-dark2 rounded-lg p-8">
            <h2 className="font-display mb-4 text-3xl font-bold">
              Legal Information
            </h2>
            <p className="text-white/80">
              iPhone® is a registered trademark of Apple Inc., registered in
              the U.S. and other countries and regions.
            </p>
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

export default IphoneCasePage;
