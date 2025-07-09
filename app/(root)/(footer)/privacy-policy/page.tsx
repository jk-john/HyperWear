const privacySections = [
  {
    title: "Information We Collect",
    content: [
      "We collect information that you provide to us directly, such as when you create an account, place an order, or contact us for support. This may include your name, email address, shipping address, and payment information.",
      "We also collect some information automatically, such as your IP address, browser type, and information about your use of our website. We use cookies to collect some of this information.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use the information we collect to:",
      [
        "Process your orders and provide you with our services.",
        "Communicate with you about your account and our services.",
        "Improve and personalize your experience on our website.",
        "For security purposes and to prevent fraud.",
      ],
    ],
  },
  {
    title: "Cookies",
    content: [
      "We use necessary cookies for the functionality of our website, such as keeping you logged in and maintaining your shopping cart. We may also use cookies for analytics purposes to understand how our website is used and to improve it.",
    ],
  },
  {
    title: "Your Choices",
    content: [
      "You can choose to disable cookies in your browser settings, but this may affect the functionality of our website.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have any questions about our privacy policy, please contact us at support@hyperwear.com.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="font-display mb-6 text-5xl font-bold">
            Privacy Policy
          </h1>
          <p className="mb-12 text-lg text-white/70">
            Your privacy is important to us. Here&apos;s how we handle your
            information.
          </p>
        </div>

        <div className="space-y-8">
          {privacySections.map((section) => (
            <div
              key={section.title}
              className="bg-dark1 rounded-xl p-8 shadow-lg"
            >
              <h2 className="font-display mb-6 text-3xl font-bold">
                {section.title}
              </h2>
              <div className="space-y-4 text-white/80">
                {section.content.map((item, index) => {
                  if (Array.isArray(item)) {
                    return (
                      <ul
                        key={index}
                        className="list-inside list-disc space-y-2 pl-2"
                      >
                        {item.map((subItem, subIndex) => (
                          <li key={subIndex}>{subItem}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={index}>{item}</p>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
