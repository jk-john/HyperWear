import {
  Body,
  Column,
  Container,
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
    <Head />
    <Preview>Hyperwear Order Confirmation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="120"
            height="auto"
            alt="Hyperwear"
          />
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
          Hyperwear, The Place To House All HyperLiquid Fans.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const logoContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const h1 = {
  color: "#1d1c2d",
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  padding: "0 20px",
};

const box = {
  padding: "20px",
  margin: "0 20px",
  border: "1px solid #e5e5e5",
  borderRadius: "5px",
};

const paragraph = {
  color: "#444",
  fontSize: "14px",
  lineHeight: "22px",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "20px 0",
};

const itemTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
};

const itemDetails = {
  fontSize: "14px",
  color: "#666",
};

const itemPrice = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
  textAlign: "right" as const,
};

const totalText = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
};

const totalPrice = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1d1c2d",
  textAlign: "right" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
