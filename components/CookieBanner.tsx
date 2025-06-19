"use client";

import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="hyperwearCookieConsent"
      style={{
        background: "var(--color-white)",
        color: "var(--color-primary)",
        borderTop: "1px solid hsl(var(--border))",
        padding: "1rem",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      buttonStyle={{
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        fontSize: "14px",
        borderRadius: "var(--radius)",
        padding: "10px 20px",
      }}
      expires={150}
      declineButtonText="Decline"
      declineButtonStyle={{
        background: "hsl(var(--secondary))",
        color: "hsl(var(--secondary-foreground))",
        fontSize: "14px",
        borderRadius: "var(--radius)",
        padding: "10px 20px",
      }}
      enableDeclineButton
      onAccept={() => {
        console.log("Accepted essential cookies. Banner will be hidden.");
      }}
      onDecline={() => {
        console.log(
          "Declined, but essential cookies are necessary for site function. Hiding banner.",
        );
      }}
    >
      <div className="max-w-prose">
        <p className="text-sm font-medium">We Value Your Privacy 🍪</p>
        <p className="text-muted-foreground mt-1 text-sm">
          We use cookies to improve your experience, and show personalized
          content. By clicking &quot;Accept&quot;, you consent to the use of
          cookies. You can read more in our{" "}
          <a href="/privacy-policy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </CookieConsent>
  );
}
