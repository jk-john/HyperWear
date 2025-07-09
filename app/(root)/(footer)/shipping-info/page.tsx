const shippingData = [
  {
    productGroup: "T-Shirts (All Editions)",
    emoji: "🟦",
    times: [
      { country: "France", min: 5, max: 6 },
      { country: "USA", min: 5, max: 7 },
      { country: "UK", min: 4, max: 7 },
      { country: "Singapore", min: 11, max: 21 },
      { country: "UAE", min: 13, max: 16 },
      { country: "Canada", min: 6, max: 8 },
      { country: "Australia", min: 12, max: 18 },
      { country: "Germany", min: 5, max: 7 },
      { country: "Italy", min: 5, max: 7 },
      { country: "Spain", min: 5, max: 7 },
      { country: "Netherlands", min: 5, max: 7 },
      { country: "Brazil", min: 15, max: 25 },
      { country: "Mexico", min: 10, max: 18 },
      { country: "South Africa", min: 15, max: 25 },
      { country: "Japan", min: 12, max: 20 },
      { country: "South Korea", min: 12, max: 20 },
      { country: "Argentina", min: 18, max: 28 },
      { country: "New Zealand", min: 14, max: 22 },
      { country: "Russia", min: 15, max: 25 },
      { country: "Turkey", min: 8, max: 14 },
      { country: "Saudi Arabia", min: 13, max: 16 },
      { country: "Nigeria", min: 20, max: 30 },
      { country: "Egypt", min: 18, max: 28 },
      { country: "Poland", min: 5, max: 8 },
      { country: "Sweden", min: 5, max: 8 },
      { country: "Switzerland", min: 5, max: 8 },
    ],
  },
  {
    productGroup: "Men’s and Women’s Tank Tops",
    emoji: "🟩",
    times: [
      { country: "France", min: 19, max: 22 },
      { country: "USA", min: 6, max: 8 },
      { country: "UK", min: 9, max: 12 },
      { country: "Singapore", min: 16, max: 19 },
      { country: "UAE", min: 12, max: 22 },
      { country: "Canada", min: 8, max: 12 },
      { country: "Australia", min: 18, max: 23 },
      { country: "Germany", min: 15, max: 20 },
      { country: "Italy", min: 15, max: 20 },
      { country: "Spain", min: 15, max: 20 },
      { country: "Netherlands", min: 15, max: 20 },
      { country: "Brazil", min: 20, max: 30 },
      { country: "Mexico", min: 15, max: 25 },
      { country: "South Africa", min: 20, max: 30 },
      { country: "Japan", min: 16, max: 22 },
      { country: "South Korea", min: 16, max: 22 },
      { country: "Argentina", min: 22, max: 32 },
      { country: "New Zealand", min: 20, max: 28 },
      { country: "Russia", min: 20, max: 28 },
      { country: "Turkey", min: 12, max: 18 },
      { country: "Saudi Arabia", min: 12, max: 22 },
      { country: "Nigeria", min: 25, max: 35 },
      { country: "Egypt", min: 22, max: 32 },
      { country: "Poland", min: 9, max: 14 },
      { country: "Sweden", min: 9, max: 14 },
      { country: "Switzerland", min: 9, max: 14 },
    ],
  },
  {
    productGroup: "Caps (Embroidered & No-Embroidery)",
    emoji: "🟧",
    times: [
      { country: "France", min: 12, max: 27 },
      { country: "USA", min: 6, max: 8 },
      { country: "UK", min: 9, max: 12 },
      { country: "Singapore", min: 12, max: 27 },
      { country: "UAE", min: 12, max: 27 },
      { country: "Canada", min: 8, max: 12 },
      { country: "Australia", min: 18, max: 27 },
      { country: "Germany", min: 15, max: 25 },
      { country: "Italy", min: 15, max: 25 },
      { country: "Spain", min: 15, max: 25 },
      { country: "Netherlands", min: 15, max: 25 },
      { country: "Brazil", min: 20, max: 35 },
      { country: "Mexico", min: 15, max: 30 },
      { country: "South Africa", min: 20, max: 35 },
      { country: "Japan", min: 16, max: 27 },
      { country: "South Korea", min: 16, max: 27 },
      { country: "Argentina", min: 22, max: 35 },
      { country: "New Zealand", min: 20, max: 30 },
      { country: "Russia", min: 20, max: 30 },
      { country: "Turkey", min: 12, max: 22 },
      { country: "Saudi Arabia", min: 12, max: 27 },
      { country: "Nigeria", min: 25, max: 40 },
      { country: "Egypt", min: 22, max: 35 },
      { country: "Poland", min: 9, max: 15 },
      { country: "Sweden", min: 9, max: 15 },
      { country: "Switzerland", min: 9, max: 15 },
    ],
  },
  {
    productGroup: "Mugs",
    emoji: "🟪",
    times: [
      { country: "France", min: 3, max: 4 },
      { country: "USA", min: 6, max: 9 },
      { country: "UK", min: 5, max: 6 },
      { country: "Singapore", min: 11, max: 14 },
      { country: "UAE", min: 11, max: 21 },
      { country: "Canada", min: 6, max: 10 },
      { country: "Australia", min: 10, max: 15 },
      { country: "Germany", min: 7, max: 10 },
      { country: "Italy", min: 7, max: 10 },
      { country: "Spain", min: 7, max: 10 },
      { country: "Netherlands", min: 7, max: 10 },
      { country: "Brazil", min: 15, max: 25 },
      { country: "Mexico", min: 12, max: 20 },
      { country: "South Africa", min: 15, max: 25 },
      { country: "Japan", min: 12, max: 18 },
      { country: "South Korea", min: 12, max: 18 },
      { country: "Argentina", min: 18, max: 28 },
      { country: "New Zealand", min: 14, max: 22 },
      { country: "Russia", min: 15, max: 25 },
      { country: "Turkey", min: 8, max: 14 },
      { country: "Saudi Arabia", min: 11, max: 21 },
      { country: "Nigeria", min: 20, max: 30 },
      { country: "Egypt", min: 18, max: 28 },
      { country: "Poland", min: 6, max: 10 },
      { country: "Sweden", min: 6, max: 10 },
      { country: "Switzerland", min: 6, max: 10 },
    ],
  },
  {
    productGroup: "iPhone Cases",
    emoji: "🟫",
    times: [
      { country: "France", min: 4, max: 7 },
      { country: "USA", min: 7, max: 10 },
      { country: "UK", min: 8, max: 14 },
      { country: "Singapore", min: 0, max: 0 },
      { country: "UAE", min: 13, max: 23 },
      { country: "Canada", min: 7, max: 12 },
      { country: "Australia", min: 12, max: 20 },
      { country: "Germany", min: 8, max: 14 },
      { country: "Italy", min: 8, max: 14 },
      { country: "Spain", min: 8, max: 14 },
      { country: "Netherlands", min: 8, max: 14 },
      { country: "Brazil", min: 18, max: 28 },
      { country: "Mexico", min: 13, max: 22 },
      { country: "South Africa", min: 18, max: 28 },
      { country: "Japan", min: 13, max: 20 },
      { country: "South Korea", min: 13, max: 20 },
      { country: "Argentina", min: 20, max: 30 },
      { country: "New Zealand", min: 18, max: 25 },
      { country: "Russia", min: 18, max: 25 },
      { country: "Turkey", min: 12, max: 20 },
      { country: "Saudi Arabia", min: 13, max: 23 },
      { country: "Nigeria", min: 25, max: 35 },
      { country: "Egypt", min: 22, max: 32 },
      { country: "Poland", min: 9, max: 15 },
      { country: "Sweden", min: 9, max: 15 },
      { country: "Switzerland", min: 9, max: 15 },
    ],
  },
];

const ShippingInfoPage = () => {
  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display mb-6 text-center text-5xl font-bold">
          Delivery Times
        </h1>
        <p className="mb-12 text-center text-lg text-white/70">
          Estimated delivery times for our products.
        </p>

        <div className="space-y-16">
          {shippingData.map((group) => (
            <div key={group.productGroup}>
              <h2 className="font-display mb-6 text-3xl font-bold">
                {group.emoji} {group.productGroup}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-dark1">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                        Country / Region
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                        Min Delivery (days)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                        Max Delivery (days)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark2 divide-y divide-white/10">
                    {group.times.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.min}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.max}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="prose prose-invert prose-p:text-white/70 mx-auto mt-16 max-w-none">
          <h3 className="font-display text-2xl font-bold">Notes</h3>
          <ul>
            <li>Delivery times are estimated in business days.</li>
            <li>Shipping delays may vary due to customs and logistics.</li>
            <li>Countries not listed follow regional averages.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;
