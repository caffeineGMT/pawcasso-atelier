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

interface PostDeliveryReviewRequestProps {
  customerName: string;
  petName: string;
  reviewUrl: string;
  instagramHandle?: string;
}

export default function PostDeliveryReviewRequest({
  customerName = "Sarah",
  petName = "Duke",
  reviewUrl = "https://pawcasso-atelier.vercel.app/submit-review?email=sarah@example.com",
  instagramHandle = "@pawcasso.atelier",
}: PostDeliveryReviewRequestProps) {
  return (
    <Html>
      <Head />
      <Preview>Love your {petName} portrait? Share it with us!</Preview>
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
            <Text style={greeting}>Hi {customerName},</Text>

            <Text style={paragraph}>
              We hope you absolutely <strong>love</strong> your custom {petName} portrait!
              It was an honor to create this artwork for you.
            </Text>

            <Text style={paragraph}>
              We have a special request: would you mind sharing your portrait
              on Instagram and tagging us at <strong>{instagramHandle}</strong>?
            </Text>

            <Section style={benefitsBox}>
              <Text style={benefitsHeading}>🎁 Share & Get Rewarded:</Text>
              <ul style={benefitsList}>
                <li style={benefitsItem}>
                  <strong>25% off</strong> your next order
                </li>
                <li style={benefitsItem}>
                  Get <strong>featured</strong> on our Instagram feed
                </li>
                <li style={benefitsItem}>
                  Help other pet parents discover us
                </li>
              </ul>
            </Section>

            <Text style={paragraph}>
              Just post your portrait, tag {instagramHandle}, and we'll send
              you a 25% discount code within 24 hours!
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={reviewUrl}>
                Leave a Review
              </Button>
            </Section>

            <Text style={paragraph}>
              Or share directly on Instagram:
            </Text>

            <Section style={buttonContainer}>
              <Button style={secondaryButton} href={`https://instagram.com/pawcasso.atelier`}>
                Follow Us on Instagram
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={footer}>
              Thank you for being an amazing customer! If you have any questions
              or need revisions, just reply to this email.
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

const benefitsBox = {
  backgroundColor: "rgba(201, 169, 110, 0.1)",
  border: "1px solid rgba(201, 169, 110, 0.3)",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const benefitsHeading = {
  color: "#C9A96E",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const benefitsList = {
  color: "#F5F5F7",
  fontSize: "15px",
  lineHeight: "1.8",
  margin: "0",
  paddingLeft: "20px",
};

const benefitsItem = {
  marginBottom: "8px",
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

const secondaryButton = {
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "9999px",
  color: "#F5F5F7",
  fontSize: "15px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
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
