import { getPublicImageUrl, getSiteUrl } from "@/lib/utils";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

const baseUrl = getSiteUrl();

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
            className="mx-auto my-0"
            width={100}
            height={100}
            alt="HyperWear logo"
            src={getPublicImageUrl("hyperwear-public/hyperwear.png")}
          />
          <Section>
            <Heading className="mx-0 my-8 w-full p-0 text-center text-3xl font-bold">
              You&apos;re in! 🐾 Welcome to HyperWear
            </Heading>
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
              <Link
                style={{
                  display: "inline-block",
                  margin: "0 10px",
                }}
                href="https://twitter.com/hyperwear"
              >
                <Img
                  className="mx-auto my-0"
                  width={32}
                  height={32}
                  alt="Twitter"
                  src={getPublicImageUrl("hyperwear-public/twitter.png")}
                />
              </Link>
            </Section>
          </Section>
          <Text className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} HyperWear. All rights reserved.
            <br />
            <Link
              href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`}
              className="text-xs text-gray-500 underline"
            >
              Unsubscribe
            </Link>
          </Text>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
