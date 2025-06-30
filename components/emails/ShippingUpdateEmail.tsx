import { getPublicImageUrl } from "@/lib/utils";
import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ShippingUpdateEmailProps {
  customerName: string;
  trackingNumber: string;
  carrier: string;
}

export const ShippingUpdateEmail = ({
  customerName,
  trackingNumber,
  carrier,
}: ShippingUpdateEmailProps) => (
  <Html>
    <Head>
      <Font
        fontFamily="Inter"
        fallbackFontFamily="Arial"
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="Teodor"
        fallbackFontFamily="Arial"
        webFont={{
          url: "https://db.onlinewebfonts.com/t/35a513c38156d430e56e7085731c054c.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>Your HyperWear Order Has Shipped!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            className="mx-auto my-0"
            width={100}
            height={100}
            alt="HyperWear logo"
            src={getPublicImageUrl("hyperwear-public/hyperwear.png")}
          />
        </Section>
        <Heading className="mx-0 my-8 w-full p-0 text-center text-3xl font-bold">
          Your Order Has Shipped!
        </Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          Good news! Your order has shipped and is heading your way. Here are
          the tracking details:
        </Text>
        <Section style={box}>
          <Text style={paragraph}>
            <strong>Carrier:</strong> {carrier}
            <br />
            <strong>Tracking Number:</strong> {trackingNumber}
          </Text>
        </Section>
        <Section style={{ textAlign: "center", marginTop: "2rem" }}>
          <Button
            style={button}
            href={`https://www.swiship.com/track?id=${trackingNumber}`}
          >
            Track Your Package
          </Button>
        </Section>
        <Text style={footer}>
          You&apos;re receiving this email because you interacted with
          HyperWear.io. For support, contact support@hyperwear.io.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ShippingUpdateEmail;

const main = {
  backgroundColor: "#edfffc",
  fontFamily: '"Inter", "Arial", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 48px 48px 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "480px",
};

const logoContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const h1 = {
  color: "#0f3933",
  fontFamily: '"Teodor", "Arial", sans-serif',
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#193833",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const box = {
  padding: "20px",
  margin: "2rem 0",
  border: "1px solid #e5e5e5",
  borderRadius: "5px",
  backgroundColor: "#fafafa",
};

const paragraph = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
};

const button = {
  backgroundColor: "#0f3933",
  color: "#ffffff",
  fontFamily: '"Inter", "Arial", sans-serif',
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
  borderRadius: "8px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "2rem",
};
