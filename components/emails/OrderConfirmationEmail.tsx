import { getPublicImageUrl, getSiteUrl } from "@/lib/utils";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const baseUrl = getSiteUrl();

type OrderConfirmationEmailProps = {
  customerName: string;
  orderId: string;
  orderDate: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

const OrderConfirmationEmail = ({
  customerName,
  orderId,
  orderDate,
  items,
  total,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your HyperWear Order Confirmation</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto my-10 max-w-2xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <Section className="text-center">
            <Img
              className="mx-auto my-0"
              width={100}
              height={100}
              alt="HyperWear logo"
              src={getPublicImageUrl("hyperwear-public/hyperwear.png")}
            />
            <Heading className="mt-4 text-2xl font-bold text-gray-800">
              Thanks for your order, {customerName}!
            </Heading>
            <Text className="text-gray-600">
              We&apos;re getting your order ready. We&apos;ll let you know once
              it has shipped.
            </Text>
          </Section>

          <Hr className="my-6 border-t border-gray-200" />

          <Section>
            <Heading as="h2" className="text-xl font-semibold text-gray-700">
              Order Details
            </Heading>
            <Text className="text-gray-600">
              <strong>Order ID:</strong> {orderId}
            </Text>
            <Text className="text-gray-600">
              <strong>Order Date:</strong> {orderDate}
            </Text>
          </Section>

          <Hr className="my-6 border-t border-gray-200" />

          <Section>
            <Heading
              as="h2"
              className="mb-4 text-xl font-semibold text-gray-700"
            >
              Items Ordered
            </Heading>
            {items.map((item, index) => (
              <Section key={index} className="mb-4">
                <Text className="font-medium text-gray-800">{item.name}</Text>
                <Text className="text-gray-600">Quantity: {item.quantity}</Text>
                <Text className="text-gray-600">
                  Price: ${item.price.toFixed(2)}
                </Text>
              </Section>
            ))}
          </Section>

          <Hr className="my-6 border-t border-gray-200" />

          <Section className="text-right">
            <Text className="text-xl font-bold text-gray-800">
              Total: ${total.toFixed(2)}
            </Text>
          </Section>

          <Hr className="my-6 border-t border-gray-200" />

          <Section className="text-center text-sm text-gray-500">
            <Text>
              If you have any questions, please contact our support team.
            </Text>
            <Row>
              <Column>
                <Link
                  href={getSiteUrl()}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  hyperwear.io
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default OrderConfirmationEmail;
