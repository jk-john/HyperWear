import { Coffee, HandIcon, Shirt, Smartphone } from "lucide-react";

const careInstructions = [
  {
    category: "Apparel (T-Shirts, Tank Tops, Hoodies)",
    icon: <Shirt className="text-accent h-8 w-8" />,
    instructions: [
      "Washing: Machine wash cold (max 30°C or 90°F), inside-out, on a gentle cycle with mild detergent and similar colors. To avoid any potential color transfer, wash with like-colored garments.",
      "Bleach: Use non-chlorine bleach only when absolutely necessary. Overusing bleach can damage the fabric's integrity and print quality.",
      "Drying: For the longest life, hang-dry in a shaded area. If you must use a machine, tumble dry on a low heat setting. High heat can shrink the fabric and damage the print.",
      "Ironing: If ironing is necessary, cool iron inside-out. Never iron directly on the printed or decorated areas.",
      "Warnings: Do not dry clean. Avoid washing with items that have zippers, buttons, or sharp elements that could snag the fabric.",
    ],
  },
  {
    category: "Embroidered Apparel (Caps)",
    icon: <HandIcon className="text-accent h-8 w-8" />,
    instructions: [
      "Spot Clean: For best results, wipe clean with a damp cloth in the spots where it’s needed. For tougher stains, a small amount of mild soap can be used.",
      "Hand-Wash: If a deeper clean is required, hand-wash in cold water. Do not use brushes, as they can damage the embroidery.",
      "Drying: To maintain the cap’s original shape, stuff the crown with clean tissue paper or a small towel and allow it to air dry in a well-ventilated space away from direct sunlight.",
      "Warnings: Do not machine-wash, bleach, tumble-dry, iron, or dry-clean. Machine washing will distort the shape and embroidery.",
    ],
  },
  {
    category: "Drinkware (Mugs)",
    icon: <Coffee className="text-accent h-8 w-8" />,
    instructions: [
      "Microwave & Dishwasher Safe: Our mugs are designed to be safe for both dishwasher and microwave use.",
      "Longevity Tip: To preserve the vibrancy of the print for years to come, we highly recommend hand-washing with a non-abrasive sponge and mild detergent.",
      "Caution: Avoid using abrasive scouring pads or harsh chemicals on the printed area, as this can cause fading or damage.",
    ],
  },
  {
    category: "Accessories (iPhone Cases)",
    icon: <Smartphone className="text-accent h-8 w-8" />,
    instructions: [
      "Cleaning: First, remove the case from your phone. Use a soft, damp cloth with a touch of mild soap to gently wipe the entire surface.",
      "Rinsing: Lightly rinse with clean water or wipe with a water-dampened cloth to remove any soap residue.",
      "Drying: Ensure the case is completely dry, both inside and out, before placing it back on your phone to prevent moisture trapping.",
      "Warnings: Avoid using harsh chemicals, alcohol-based solutions, or abrasive materials, as they can degrade the case material and damage the printed design.",
    ],
  },
];

const CareInstructionsPage = () => {
  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display mb-6 text-center text-5xl font-bold">
          Care Instructions
        </h1>
        <p className="mb-12 text-center text-lg text-white/70">
          Follow these instructions to keep your HyperWear products looking
          their best.
        </p>

        <div className="space-y-12">
          {careInstructions.map((section) => (
            <div
              key={section.category}
              className="bg-dark1 rounded-xl p-8 shadow-lg"
            >
              <div className="mb-6 flex items-center gap-4">
                {section.icon}
                <h2 className="font-display text-3xl font-bold">
                  {section.category}
                </h2>
              </div>
              <ul className="list-inside list-disc space-y-3 text-white/80">
                {section.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareInstructionsPage;
