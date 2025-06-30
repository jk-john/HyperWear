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
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const PasswordResetEmail = ({
  resetLink = `${baseUrl}/password-update`,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your HyperWear password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/hyperwear.png`}
          width="120"
          height="auto"
          alt="HyperWear"
          style={logo}
        />
        <Heading style={heading}>Reset Your Password</Heading>
        <Text style={text}>
          Someone requested a password reset for your HyperWear account. If this
          was you, click the button below to set a new password.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          If you didn&apos;t request a password reset, you can safely ignore
          this email.
        </Text>
        <Hr style={hr} />
        <Link href={baseUrl} style={footer}>
          HyperWear Movement
        </Link>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

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
