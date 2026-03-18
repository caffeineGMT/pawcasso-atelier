import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface InstagramShareDiscountProps {
  customerName: string;
  discountCode: string;
  discountPercentage?: number;
}

export default function InstagramShareDiscount({
  customerName = "Sarah",
  discountCode = "SHARE25",
  discountPercentage = 25,
}: InstagramShareDiscountProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for sharing! Here&apos;s your {String(discountPercentage)}% discount code 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>
              <span style={goldText}>Pawcasso</span> Atelier
            </Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Section style={celebrationBadge}>
              <Text style={celebrationEmoji}>🎉</Text>
            </Section>

            <Text style={greeting}>Hi {customerName},</Text>

            <Text style={paragraph}>
              <strong>Thank you for sharing your portrait on Instagram!</strong> We
              absolutely love seeing your beautiful pet featured and we're so grateful
              for your support.
            </Text>

            <Section style={discountBox}>
              <Text style={discountLabel}>Your {discountPercentage}% Discount Code:</Text>
              <Text style={discountCodeText}>{discountCode}</Text>
              <Text style={discountNote}>
                Valid on your next portrait order. No expiration date.
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href="https://pawcasso-atelier.vercel.app/order">
                Order Another Portrait
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={paragraph}>
              <strong>Why not order a few more?</strong>
            </Text>

            <ul style={benefitsList}>
              <li style={benefitsItem}>Gift portraits to friends and family</li>
              <li style={benefitsItem}>Create a collection of your pets in different styles</li>
              <li style={benefitsItem}>Memorialize beloved pets who've passed</li>
            </ul>

            <Text style={footer}>
              Questions? Just reply to this email. We're here to help!
            </Text>

            <Text style={signature}>
              With gratitude,
              <br />
              The Pawcasso Atelier Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#000000",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const h1 = {
  color: "#F5F5F7",
  fontSize: "28px",
  fontWeight: "600",
  margin: "0",
  letterSpacing: "-0.02em",
};

const goldText = {
  background: "linear-gradient(135deg, #C9A96E 0%, #E8D5A8 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const content = {
  backgroundColor: "#111111",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  padding: "40px 32px",
};

const celebrationBadge = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const celebrationEmoji = {
  fontSize: "64px",
  margin: "0",
};

const greeting = {
  color: "#F5F5F7",
  fontSize: "18px",
  fontWeight: "500",
  margin: "0 0 24px 0",
};

const paragraph = {
  color: "#86868b",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const discountBox = {
  backgroundColor: "rgba(201, 169, 110, 0.15)",
  border: "2px solid #C9A96E",
  borderRadius: "12px",
  padding: "32px 24px",
  margin: "32px 0",
  textAlign: "center" as const,
};

const discountLabel = {
  color: "#E8D5A8",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.4em",
  margin: "0 0 16px 0",
};

const discountCodeText = {
  color: "#C9A96E",
  fontSize: "36px",
  fontWeight: "700",
  fontFamily: "monospace",
  letterSpacing: "0.1em",
  margin: "0 0 16px 0",
};

const discountNote = {
  color: "#86868b",
  fontSize: "13px",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#C9A96E",
  borderRadius: "9999px",
  color: "#000000",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const benefitsList = {
  color: "#86868b",
  fontSize: "15px",
  lineHeight: "1.8",
  margin: "0 0 24px 0",
  paddingLeft: "20px",
};

const benefitsItem = {
  marginBottom: "8px",
};

const divider = {
  borderColor: "rgba(255, 255, 255, 0.08)",
  margin: "32px 0",
};

const footer = {
  color: "#86868b",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const signature = {
  color: "#C9A96E",
  fontSize: "15px",
  fontWeight: "500",
  margin: "24px 0 0 0",
};
