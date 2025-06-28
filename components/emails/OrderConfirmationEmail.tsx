import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  orderDate: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

const baseUrl = process.env.NEXT_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_URL}`
  : "";

export const OrderConfirmationEmail = ({
  customerName,
  orderId,
  orderDate,
  items,
  total,
}: OrderConfirmationEmailProps) => (
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
    <Preview>Hyperwear Order Confirmation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img src={`${baseUrl}/logo.svg`} width="180" alt="Hyperwear" />
        </Section>
        <Heading style={h1}>Thanks for your order!</Heading>
        <Text style={text}>
          Hi {customerName}, we&apos;re getting your order ready to be shipped.
          We will notify you when it has been sent.
        </Text>
        <Section style={box}>
          <Text style={paragraph}>
            <strong>Order ID:</strong> {orderId}
            <br />
            <strong>Order Date:</strong> {orderDate}
          </Text>
          <hr style={hr} />
          {items.map((item, index) => (
            <Row key={index} style={{ marginBottom: "10px" }}>
              <Column>
                <Text style={itemTitle}>{item.name}</Text>
                <Text style={itemDetails}>Quantity: {item.quantity}</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </Column>
            </Row>
          ))}
          <hr style={hr} />
          <Row>
            <Column>
              <Text style={totalText}>Total</Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text style={totalPrice}>${total.toFixed(2)}</Text>
            </Column>
          </Row>
        </Section>
        <Text style={footer}>
          You&apos;re receiving this email because you interacted with
          HyperWear.io. For support, contact support@hyperwear.io.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

const main = {
  backgroundColor: "#0f3933",
  fontFamily: '"Inter", "Arial", sans-serif',
  color: "#edfffc",
};

const container = {
  backgroundColor: "#0f3933",
  border: "1px solid #97fce4",
  margin: "0 auto",
  padding: "20px 48px 48px 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(151, 252, 228, 0.1)",
  maxWidth: "480px",
};

const logoContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const h1 = {
  color: "#edfffc",
  fontFamily: '"Teodor", "Arial", sans-serif',
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#edfffc",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  padding: "0",
};

const box = {
  padding: "20px",
  margin: "2rem 0",
  border: "1px solid #97fce4",
  borderRadius: "5px",
  backgroundColor: "#1A4A44",
};

const paragraph = {
  color: "#edfffc",
  fontSize: "16px",
  lineHeight: "22px",
};

const hr = {
  borderColor: "#97fce4",
  margin: "20px 0",
};

const itemTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#edfffc",
};

const itemDetails = {
  fontSize: "14px",
  color: "#bbf5e8",
};

const itemPrice = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#edfffc",
  textAlign: "right" as const,
};

const totalText = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#edfffc",
};

const totalPrice = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#97fce4",
  textAlign: "right" as const,
};

const footer = {
  color: "#bbf5e8",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "2rem",
};
