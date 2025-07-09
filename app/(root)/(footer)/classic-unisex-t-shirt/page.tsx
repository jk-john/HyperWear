import Image from "next/image";

const ClassicUnisexTShirtPage = () => {
  const sizeGuide = [
    { size: "S", length: 71, width: 45.7, sleeve: 39.7 },
    { size: "M", length: 73.7, width: 50.8, sleeve: 43.2 },
    { size: "L", length: 76.2, width: 56, sleeve: 47 },
    { size: "XL", length: 78.7, width: 61, sleeve: 50.8 },
    { size: "2XL", length: 81.3, width: 66, sleeve: 54.6 },
    { size: "3XL", length: 83.8, width: 71, sleeve: 58 },
    { size: "4XL", length: 86.4, width: 76.2, sleeve: 61.5 },
    { size: "5XL", length: 89, width: 81.3, sleeve: 64.3 },
  ];

  const features = [
    "100% cotton (exceptions for some colors: Sport Grey 90% cotton / 10% polyester, Ash Grey 99% cotton / 1% polyester, Heather 50% cotton / 50% polyester)",
    "Fabric weight: 170–180 g/m²",
    "Pre-shrunk jersey knit, tubular construction",
    "Neck and shoulder taping",
    "Double stitching on sleeves and bottom hem",
  ];

  const careInstructions = [
    "Machine wash cold at max 30 °C, gentle cycle",
    "Do not bleach",
    "Iron at medium temperature, avoid ironing on prints",
    "Do not tumble dry; air dry recommended",
    "Do not dry clean",
  ];

  return (
    <div className="bg-dark font-body text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display mb-12 text-center text-4xl font-bold md:text-5xl">
          Classic Unisex T-Shirt
        </h1>

        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          {/* Left Column: Image and Size Guide Tip */}
          <div className="space-y-8">
            <div className="bg-dark2 rounded-lg p-6">
              <Image
                src="/t-shirts-instructions.png"
                alt="T-shirt measurement instructions"
                width={800}
                height={600}
                className="rounded-md"
              />
            </div>
            <div className="bg-dark2 rounded-lg p-8">
              <h3 className="font-display mb-4 text-2xl font-bold">
                Tip for choosing the right size
              </h3>
              <p className="mb-4 text-white/80">
                Measure a t-shirt you already own following the guidelines below
                and compare it with this chart.
              </p>
              <ul className="list-inside list-disc space-y-2 text-white/80">
                <li>
                  <span className="font-bold">Length (A):</span> from the top of
                  the collar (shoulder) down to the bottom of the shirt
                </li>
                <li>
                  <span className="font-bold">Width (B):</span> from one
                  underarm seam to the other
                </li>
                <li>
                  <span className="font-bold">Sleeve Length (C):</span> from the
                  center back of the collar along the shoulder seam to the end
                  of the sleeve
                </li>
              </ul>
            </div>
          </div>
          {/* Right Column: Size Guide, Composition, Care */}
          <div className="space-y-8">
            {/* Size Guide Table */}
            <div className="bg-dark2 rounded-lg p-8">
              <h2 className="font-display mb-6 text-3xl font-bold">
                Size Guide (in cm)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-left">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="p-4">Size</th>
                      <th className="p-4">Length (A)</th>
                      <th className="p-4">Width (B)</th>
                      <th className="p-4">Sleeve (C)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.map((row) => (
                      <tr key={row.size} className="border-b border-white/10">
                        <td className="p-4 font-bold">{row.size}</td>
                        <td className="p-4">{row.length}</td>
                        <td className="p-4">{row.width}</td>
                        <td className="p-4">{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Composition */}
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
    </div>
  );
};

export default ClassicUnisexTShirtPage;
