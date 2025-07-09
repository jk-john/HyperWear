import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqContent = [
  {
    question: "1. What payment methods do you accept?",
    answer:
      "We accept payments via credit card, PayPal, and cryptocurrencies for a secure and flexible experience.",
  },
  {
    question: "2. What are the delivery times?",
    answer: (
      <>
        Delivery times vary depending on the product and destination. Please
        check our{" "}
        <Link href="/shipping-info" className="text-accent underline">
          Delivery Times page
        </Link>{" "}
        for exact details.
      </>
    ),
  },
  {
    question: "3. Are there customs fees or taxes?",
    answer:
      "Customs fees or local taxes may apply depending on the destination. These fees are set by local authorities and are not covered by HyperWear unless otherwise stated. Please see our dedicated page for more information.",
  },
  {
    question:
      "4. What if my order doesn’t arrive within the maximum delivery time?",
    answer: (
      <>
        If your order exceeds the maximum estimated delivery time and you
        haven’t received it, HyperWear will either:
        <ul className="mt-2 list-disc pl-6">
          <li>Refund you in full, or</li>
          <li>Resend your order as soon as possible.</li>
        </ul>
      </>
    ),
  },
  {
    question: "5. Can I return or exchange a product?",
    answer:
      "As our products are made-to-order, returns and exchanges are limited. For any questions or issues, please contact our customer support.",
  },
  {
    question: "6. How can I contact customer support?",
    answer: (
      <>
        You can reach us via:
        <ul className="mt-2 list-disc pl-6">
          <li>
            Twitter:{" "}
            <a
              href="https://twitter.com/wear_hyper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              @wear_hyper
            </a>
          </li>
          <li>
            Integrated messaging on our{" "}
            <Link href="/support" className="text-accent underline">
              website
            </Link>
          </li>
          <li>
            Email:{" "}
            <a
              href="mailto:contact@hyperWear.io"
              className="text-accent underline"
            >
              contact@hyperWear.io
            </a>
          </li>
        </ul>
        We’ll get back to you as soon as possible.
      </>
    ),
  },
  {
    question: "7. How should I care for my HyperWear products?",
    answer: (
      <>
        For detailed care instructions, please visit our{" "}
        <Link href="/care-instructions" className="text-accent underline">
          Care Instructions page
        </Link>
        .
      </>
    ),
  },
  {
    question: "8. What materials do you use?",
    answer: (
      <>
        Detailed information on materials for each product is available on our{" "}
        <Link href="/materials" className="text-accent underline">
          Materials page.
        </Link>
      </>
    ),
  },
  {
    question: "9. Do you accept cryptocurrency payments?",
    answer:
      "Yes! We accept cryptocurrencies to provide you with flexible payment options.",
  },
  {
    question: "10. What should I do if I have an issue with my payment?",
    answer:
      "Please contact our customer support via the channels listed above for prompt assistance.",
  },
];

const FAQPage = () => {
  return (
    <div className="bg-dark2 min-h-screen text-white">
      <div className="container mx-auto px-6 py-16">
        <h1 className="font-display mb-12 text-center text-4xl font-bold">
          Frequently Asked Questions
        </h1>
        <div className="mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="w-full">
            {faqContent.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left text-lg hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
