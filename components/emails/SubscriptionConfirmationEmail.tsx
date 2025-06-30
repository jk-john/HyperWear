import { getURL } from "@/lib/utils";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const baseUrl = getURL();

export default function SubscriptionConfirmationEmail({
  email,
  fullName,
}: {
  email: string;
  fullName?: string | null;
}) {
  const welcomeMessage = `Hey ${fullName || email},`;
  return (
    <Html>
      <Head />
      <Preview className="text-primary text-center font-bold">
        Welcome to HyperWear
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://jhxxuhisdypknlvhaklm.supabase.co/storage/v1/object/public/hyperwear-public/hyperwear.png"
            alt="Welcome to HyperWear"
            width="120"
            height="auto"
            style={{
              marginBottom: "20px",
              borderRadius: "100%",
              maxWidth: "100%",
            }}
          />
          <Section>
            <Text style={heading}>You&apos;re in! 🐾 Welcome to HyperWear</Text>
            <Text style={text}>{welcomeMessage}</Text>
            <Text style={text}>
              Thanks for subscribing. You&apos;re now part of the HyperWear
              movement.
            </Text>
            <Text style={text}>Wear the culture. Follow the mission.</Text>
            <Text
              style={{ fontSize: "12px", color: "#999", marginTop: "40px" }}
            >
              Don&apos;t want to hear from us again?{" "}
              <Link
                href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(
                  email,
                )}`}
                style={{ color: "#0f3933" }}
              >
                Unsubscribe
              </Link>
            </Text>
            <Section style={{ textAlign: "center", marginTop: "20px" }}>
              <a
                href="https://x.com/wear_hyper"
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: "0 10px" }}
              >
                <Img
                  src="https://jhxxuhisdypknlvhaklm.supabase.co/storage/v1/object/public/hyperwear-public/twitter.png"
                  alt="X"
                  width="32"
                  height="32"
                  style={{ display: "inline-block" }}
                />
              </a>
              <a
                href="https://www.instagram.com/hyperwear_off/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: "0 10px" }}
              >
                <Img
                  src="https://jhxxuhisdypknlvhaklm.supabase.co/storage/v1/object/public/hyperwear-public/Instagram_Glyph_Gradient.png"
                  alt="Instagram"
                  width="32"
                  height="32"
                  style={{ display: "inline-block" }}
                />
              </a>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles (can be moved to external file if needed)
const main = {
  backgroundColor: "#f5fefd",
  padding: "40px 0",
  fontFamily: "Inter, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  maxWidth: "600px",
  margin: "auto",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "12px",
  color: "#0f3933",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#193833",
};
