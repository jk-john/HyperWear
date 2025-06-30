import { getPublicImageUrl } from "@/lib/utils";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface SignUpConfirmationEmailProps {
  customerName?: string | null;
  confirmationLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const SignUpConfirmationEmail = ({
  customerName,
  confirmationLink = `${baseUrl}/(auth)/sign-in`,
}: SignUpConfirmationEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Welcome to HyperWear!</Preview>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 w-full max-w-[465px] rounded border border-solid border-gray-200 p-5">
            <Section className="text-center">
              <Img
                className="mx-auto my-0"
                width={100}
                height={100}
                alt="HyperWear logo"
                src={getPublicImageUrl("hyperwear-public/hyperwear.png")}
              />
            </Section>
            <Heading className="mx-0 my-8 w-full p-0 text-center text-3xl font-bold">
              Welcome to HyperWear!
            </Heading>
            <Text className="text-base leading-6">Hi {customerName},</Text>
            <Text className="text-base leading-6">
              Thanks for signing up. Please click the button below to confirm
              your email address.
            </Text>
            <Button
              className="rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white no-underline"
              href={confirmationLink}
            >
              Confirm Email
            </Button>
            <Text className="text-base leading-6">
              Best,
              <br />
              The HyperWear Team
            </Text>
            <Hr className="my-6 w-full border border-solid border-gray-200" />
            <Text className="text-xs text-gray-500">
              HyperWear.io. For support, contact: contact@hyperwear.io.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default SignUpConfirmationEmail;

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
  border: "1px solid #eaeaea",
  borderRadius: "4px",
};

const logo = {
  margin: "0 auto",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const text = {
  color: "#333",
  fontSize: "14px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 20px",
};

const hr = {
  borderColor: "#eaeaea",
  margin: "28px 0",
};

const footer = {
  color: "#666666",
  fontSize: "12px",
  lineHeight: "24px",
  textAlign: "center" as const,
};
