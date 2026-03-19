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

interface OrderConfirmationProps {
  customerName: string;
  petName: string;
  tier: string;
  tierName: string;
  amount: number;
  orderId: string;
  style: string;
  estimatedDelivery?: string;
}

export default function OrderConfirmation({
  customerName = "Sarah",
  petName = "Duke",
  tier = "premium",
  tierName = "Premium",
  amount = 29.0,
  orderId = "cs_test_123",
  style = "Renaissance",
  estimatedDelivery = "12 hours",
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your {petName} portrait order is confirmed! Arriving in {estimatedDelivery}.
      </Preview>
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
              <strong style={{ color: "#C9A96E" }}>Your order is confirmed!</strong> We're
              thrilled to create a stunning {style} portrait of {petName}.
            </Text>

            {/* Order Summary */}
            <Section style={orderBox}>
              <Text style={orderHeading}>Order Summary</Text>
              <Hr style={orderDivider} />

              <table style={orderTable}>
                <tbody>
                  <tr>
                    <td style={orderLabel}>Pet Name</td>
                    <td style={orderValue}>{petName}</td>
                  </tr>
                  <tr>
                    <td style={orderLabel}>Art Style</td>
                    <td style={orderValue}>{style}</td>
                  </tr>
                  <tr>
                    <td style={orderLabel}>Tier</td>
                    <td style={orderValue}>{tierName}</td>
                  </tr>
                  <tr>
                    <td style={orderLabel}>Total</td>
                    <td style={orderValueBold}>${amount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={orderLabel}>Order ID</td>
                    <td style={orderValueSmall}>{orderId.slice(0, 20)}...</td>
                  </tr>
                </tbody>
              </table>

              <Hr style={orderDivider} />

              <Text style={estimatedText}>
                ⚡ Estimated Delivery: <strong>{estimatedDelivery}</strong>
              </Text>
            </Section>

            {/* What's Next */}
            <Section style={stepsBox}>
              <Text style={stepsHeading}>What Happens Next?</Text>
              <ul style={stepsList}>
                <li style={stepsItem}>
                  <strong>1. Creation:</strong> Our AI artists are already working on {petName}'s portrait
                </li>
                <li style={stepsItem}>
                  <strong>2. Quality Check:</strong> We'll ensure every detail is perfect
                </li>
                <li style={stepsItem}>
                  <strong>3. Delivery:</strong> You'll receive your portrait via email within {estimatedDelivery}
                </li>
                <li style={stepsItem}>
                  <strong>4. Revisions:</strong> Not happy? We offer unlimited revisions!
                </li>
              </ul>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button
                style={button}
                href="https://pawcasso-atelier.vercel.app/gallery"
              >
                View Sample Gallery
              </Button>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Text style={footer}>
              Questions? Just reply to this email or reach out via our live chat.
              We're here to help!
            </Text>

            <Text style={signature}>
              With excitement,
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
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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

const orderBox = {
  backgroundColor: "rgba(201, 169, 110, 0.05)",
  border: "1px solid rgba(201, 169, 110, 0.2)",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const orderHeading = {
  color: "#C9A96E",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const orderDivider = {
  borderColor: "rgba(201, 169, 110, 0.2)",
  margin: "16px 0",
};

const orderTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const orderLabel = {
  color: "#86868b",
  fontSize: "14px",
  padding: "8px 0",
  width: "40%",
};

const orderValue = {
  color: "#F5F5F7",
  fontSize: "14px",
  padding: "8px 0",
  textAlign: "right" as const,
};

const orderValueBold = {
  color: "#C9A96E",
  fontSize: "16px",
  fontWeight: "600",
  padding: "8px 0",
  textAlign: "right" as const,
};

const orderValueSmall = {
  color: "#86868b",
  fontSize: "12px",
  padding: "8px 0",
  textAlign: "right" as const,
  fontFamily: "monospace",
};

const estimatedText = {
  color: "#C9A96E",
  fontSize: "15px",
  textAlign: "center" as const,
  margin: "16px 0 0 0",
};

const stepsBox = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const stepsHeading = {
  color: "#F5F5F7",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const stepsList = {
  color: "#86868b",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
  paddingLeft: "20px",
};

const stepsItem = {
  marginBottom: "12px",
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
