const cookieSections = [
  {
    title: "What Are Cookies?",
    content: [
      "Cookies are small text files stored on your device that help us remember your preferences and understand how you use our site. They are essential for providing a personalized and efficient user experience.",
    ],
  },
  {
    title: "How We Use Cookies",
    content: [
      "We use cookies for several key purposes:",
      [
        "Essential Functionality: To manage your shopping cart, maintain your session, and remember your preferences.",
        "Performance and Analytics: To gather anonymous data on how our website is used, which helps us improve its performance and your experience.",
        "Security: To help detect and prevent security risks.",
      ],
    ],
  },
  {
    title: "Your Choices",
    content: [
      "You have full control over your cookie preferences. You can choose to disable cookies through your browser settings, but please be aware that this may affect the functionality of the website and limit your ability to use certain features.",
    ],
  },
];

const CookiePolicyPage = () => {
  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="font-display mb-6 text-5xl font-bold">
            Cookie Policy
          </h1>
          <p className="mb-12 text-lg text-white/70">
            We use cookies to enhance your browsing experience.
          </p>
        </div>

        <div className="space-y-8">
          {cookieSections.map((section) => (
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
};

export default CookiePolicyPage;
