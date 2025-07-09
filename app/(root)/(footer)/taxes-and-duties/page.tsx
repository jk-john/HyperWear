const TaxesAndDutiesPage = () => {
  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display mb-6 text-center text-5xl font-bold">
          Taxes & Duties
        </h1>
        <div className="prose prose-invert prose-p:text-white/70 prose-strong:text-white mx-auto max-w-none">
          <p>
            At <strong>HyperWear</strong>, our priority is not just delivering
            high-quality products — but also offering a{" "}
            <strong>smooth, worry-free shopping experience</strong>.
          </p>
          <p>
            ✅ In most countries,{" "}
            <strong>we cover local taxes and customs duties</strong>, meaning
            you <strong>won’t have to pay anything extra upon delivery</strong>.
          </p>
          <p>
            However, please note that{" "}
            <strong>some regions may still apply import fees or VAT</strong>,
            depending on their local regulations. These fees are{" "}
            <strong>collected by customs authorities</strong> and are{" "}
            <strong>not controlled or covered by HyperWear</strong>.
          </p>
          <p>
            That said, we’ve done our best to{" "}
            <strong>absorb most of these costs</strong>, especially for
            customers in the <strong>European Union</strong>, the{" "}
            <strong>United States</strong>, and other key regions — so{" "}
            <strong>extra fees are rare</strong>.
          </p>
          <p>
            To help you plan with peace of mind, the table below outlines{" "}
            <strong>whether your country applies delivery charges</strong>, and
            what to expect if so.
          </p>
          <blockquote>
            <p>🕊️ Transparency first — no surprises at your doorstep.</p>
          </blockquote>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-dark1">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                  🌍 Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                  📬 Delivery Fees?
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                  💰 Estimated Charges
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                  📝 Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark2 divide-y divide-white/10">
              {fees.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.fees}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.charges}
                  </td>
                  <td className="px-6 py-4">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const fees = [
  {
    country: "🇫🇷 France (EU)",
    fees: "❌ No",
    charges: "$0",
    notes: "No taxes or duties in EU.",
  },
  {
    country: "🇩🇪 Germany (EU)",
    fees: "❌ No",
    charges: "$0",
    notes: "Same as France.",
  },
  {
    country: "🇪🇸 Spain (EU)",
    fees: "❌ No",
    charges: "$0",
    notes: "No import fees.",
  },
  {
    country: "🇮🇹 Italy (EU)",
    fees: "❌ No",
    charges: "$0",
    notes: "Duty-free in EU.",
  },
  {
    country: "🇳🇱 Netherlands (EU)",
    fees: "❌ No",
    charges: "$0",
    notes: "No customs fees.",
  },
  {
    country: "🇵🇱 Poland (EU)",
    fees: "❌ No",
    charges: "$0",
    notes: "EU shipments = free of fees.",
  },
  {
    country: "🇸🇪 Sweden (EU)",
    fees: "❌ No",
    charges: "$0",
    notes: "No additional charges.",
  },
  {
    country: "🇧🇪 Belgium (EU)",
    fees: "❌ No",
    charges: "$0",
    notes: "No import costs.",
  },
  {
    country: "🇬🇧 United Kingdom",
    fees: "✅ Over £135",
    charges: "~£25–£40",
    notes: "VAT & customs apply.",
  },
  {
    country: "🇺🇸 United States",
    fees: "❌ Under $800",
    charges: "$0",
    notes: "Duty-free under $800.",
  },
  {
    country: "🇨🇦 Canada",
    fees: "✅ Over 20 CAD",
    charges: "~5–15% + duties",
    notes: "Import taxes above 20 CAD.",
  },
  {
    country: "🇦🇺 Australia",
    fees: "✅ Over 1000 AUD",
    charges: "~10% + customs fees",
    notes: "Higher orders may be taxed.",
  },
  {
    country: "🇳🇿 New Zealand",
    fees: "✅ Over 400 NZD",
    charges: "~15% + customs fees",
    notes: "Duty threshold at 400 NZD.",
  },
  {
    country: "🇯🇵 Japan",
    fees: "✅ Yes",
    charges: "~10% + customs",
    notes: "Most orders taxed.",
  },
  {
    country: "🇸🇬 Singapore",
    fees: "✅ Over 400 SGD",
    charges: "~S$40–60",
    notes: "GST applies above 400 SGD.",
  },
  {
    country: "🇦🇪 UAE",
    fees: "✅ Always",
    charges: "~5% + 20–30 AED",
    notes: "All imports taxed.",
  },
  {
    country: "🇧🇷 Brazil",
    fees: "✅ Always",
    charges: "~60% import tax",
    notes: "Very high import fees.",
  },
  {
    country: "🇲🇽 Mexico",
    fees: "✅ Usually",
    charges: "~16% + customs",
    notes: "Most goods are taxed.",
  },
  {
    country: "🇮🇳 India",
    fees: "✅ Usually",
    charges: "~18% + customs",
    notes: "Taxes commonly apply.",
  },
  {
    country: "🇨🇭 Switzerland",
    fees: "✅ Usually",
    charges: "~7.7% + customs",
    notes: "Most imports are taxed.",
  },
  {
    country: "🇳🇴 Norway",
    fees: "✅ Usually",
    charges: "~25% VAT + customs",
    notes: "High tax rates.",
  },
  {
    country: "🇨🇳 China",
    fees: "✅ Usually",
    charges: "~13% VAT + customs",
    notes: "Import duties often apply.",
  },
  {
    country: "🇰🇷 South Korea",
    fees: "✅ Usually",
    charges: "~10% VAT + customs",
    notes: "Fees are common.",
  },
  {
    country: "🇿🇦 South Africa",
    fees: "✅ Usually",
    charges: "~15% VAT + customs",
    notes: "Imports are taxed.",
  },
  {
    country: "🇸🇦 Saudi Arabia",
    fees: "✅ Always",
    charges: "~15% VAT + customs",
    notes: "All products are taxed.",
  },
  {
    country: "🇨🇱 Chile",
    fees: "✅ Over ~$30",
    charges: "~19% VAT + customs",
    notes: "Low fee threshold.",
  },
  {
    country: "🇦🇷 Argentina",
    fees: "✅ Usually",
    charges: "~21% VAT + customs",
    notes: "Most items are taxed.",
  },
  {
    country: "🇨🇴 Colombia",
    fees: "✅ Over ~$200",
    charges: "~19% VAT + customs",
    notes: "Orders over $200 taxed.",
  },
  {
    country: "🇵🇪 Peru",
    fees: "✅ Usually",
    charges: "~18% VAT + customs",
    notes: "Duties likely.",
  },
  {
    country: "🇻🇪 Venezuela",
    fees: "✅ Usually",
    charges: "Varies",
    notes: "Varies by product.",
  },
  {
    country: "🇹🇭 Thailand",
    fees: "✅ Usually",
    charges: "~7% VAT + customs",
    notes: "Most orders taxed.",
  },
  {
    country: "🇹🇼 Taiwan",
    fees: "✅ Usually",
    charges: "~5% VAT + customs",
    notes: "Import taxes often apply.",
  },
  {
    country: "🇷🇺 Russia",
    fees: "✅ Usually",
    charges: "~20% VAT + customs",
    notes: "Duties apply at delivery.",
  },
];

export default TaxesAndDutiesPage;
