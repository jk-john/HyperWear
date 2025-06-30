import { getPublicImageUrl, getSiteUrl } from "@/lib/utils";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  customerName: string;
  resetLink: string;
}

const PasswordResetEmail = ({
  customerName,
  resetLink,
}: PasswordResetEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>HyperWear - Reset Your Password</Preview>
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
              Reset Your Password
            </Heading>
            <Text className="text-base leading-6">Hi {customerName},</Text>
            <Text className="text-base leading-6">
              Someone recently requested a password change for your HyperWear
              account. If this was you, you can set a new password here:
            </Text>
            <Button
              className="rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white no-underline"
              href={resetLink}
            >
              Reset Password
            </Button>
            <Text className="text-base leading-6">
              If you don&apos;t want to change your password, just ignore this
              message.
            </Text>
            <Text className="text-base leading-6">
              Best,
              <br />
              The HyperWear Team
            </Text>
            <Hr className="my-6 w-full border border-solid border-gray-200" />
            <Text className="text-xs text-gray-500">
              HyperWear.io. For support, contact: contact@hyperwear.io.
            </Text>
            <Section className="pb-8 text-center">
              <Text className="text-lg">
                <Link
                  className="text-lg text-blue-600"
                  href={`${getSiteUrl()}`}
                >
                  Visit our website
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default PasswordResetEmail;
