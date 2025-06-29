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

interface PasswordChangeConfirmationEmailProps {
  customerName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_URL}`
  : "http://localhost:3000";

export const PasswordChangeConfirmationEmail = ({
  customerName,
}: PasswordChangeConfirmationEmailProps) => (
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
    <Preview>Your HyperWear password was changed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://jhxxuhisdypknlvhaklm.supabase.co/storage/v1/object/public/hyperwear-public/hyperwear.png"
            width="180"
            alt="HyperWear"
          />
        </Section>
        <Heading style={h1}>Password Changed Successfully</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          We&apos;re writing to confirm that your password for your HyperWear
          account has been changed.
        </Text>
        <Section style={{ textAlign: "center", marginTop: "2rem" }}>
          <Button style={button} href={`${baseUrl}/sign-in`}>
            Sign In to Your Account
          </Button>
        </Section>
        <Text style={text}>
          If you did not make this change, please contact our support team
          immediately to secure your account.
        </Text>
        <Text style={footer}>
          You&apos;re receiving this email because you interacted with
          HyperWear.io. For support, contact : contact@hyperwear.io.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordChangeConfirmationEmail;

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
