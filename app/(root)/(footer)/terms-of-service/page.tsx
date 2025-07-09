const termsSections = [
  {
    title: "Introduction",
    content: [
      "Welcome to HyperWear. These terms and conditions outline the rules and regulations for the use of our website and the purchase of our products. By accessing this website, we assume you accept these terms and conditions. Do not continue to use HyperWear if you do not agree to all of the terms and conditions stated on this page.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "HyperWear is an independent community project inspired by HyperLiquid. It is not affiliated with or endorsed by HyperLiquid. All designs, logos, and content are created for the community and are the property of HyperWear unless otherwise stated. Unauthorized use of our intellectual property is prohibited.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Our liability for any products purchased is limited to the purchase price of the product. We are not liable for any indirect, incidental, or consequential damages arising from the use of our products or website. We make no warranties, expressed or implied, regarding the products sold on this site.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These terms will be governed by and interpreted in accordance with the laws of the jurisdiction in which our company is registered. You agree to submit to the personal jurisdiction of the courts located in that jurisdiction for the purpose of litigating all such claims or disputes.",
    ],
  },
];

const TermsOfServicePage = () => {
  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="font-display mb-6 text-5xl font-bold">
            Terms of Service
          </h1>
          <p className="mb-12 text-lg text-white/70">
            Please read our terms and conditions carefully before using our
            services.
          </p>
        </div>

        <div className="space-y-8">
          {termsSections.map((section) => (
            <div
              key={section.title}
              className="bg-dark1 rounded-xl p-8 shadow-lg"
            >
              <h2 className="font-display mb-6 text-3xl font-bold">
                {section.title}
              </h2>
              <div className="space-y-4 text-white/80">
                {section.content.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
