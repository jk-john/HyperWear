const ReturnsAndRefundsPolicyPage = () => {
  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display mb-6 text-center text-5xl font-bold">
          Returns & Refunds Policy
        </h1>
        <div className="prose prose-invert prose-p:text-white/70 prose-strong:text-white mx-auto max-w-none">
          <p>
            Due to the made-to-order nature of our products, we have a limited
            return policy. However, your satisfaction is our priority, and we
            are committed to resolving any issues.
          </p>

          <h2 className="font-display text-3xl font-bold">
            Damaged or Defective Items
          </h2>
          <p>
            If your order arrives damaged, defective, or you receive the wrong
            item, please contact our support team within 14 days of delivery. We
            will arrange for a replacement or a full refund at no extra cost to
            you.
          </p>

          <h2 className="font-display text-3xl font-bold">
            Order Not Received
          </h2>
          <p>
            If your order does not arrive within the maximum estimated delivery
            time, we will either refund you in full or resend the order as soon
            as possible.
          </p>

          <h2 className="font-display text-3xl font-bold">Contact Us</h2>
          <p>
            For any issues, please reach out to our customer support with your
            order number and a description of the problem. We are here to help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsAndRefundsPolicyPage;
