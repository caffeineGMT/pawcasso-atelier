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

interface ShippingNotificationProps {
  customerName: string;
  petName: string;
  style: string;
  trackingInfo?: string;
  estimatedArrival?: string;
}

export default function ShippingNotification({
  customerName = "Sarah",
  petName = "Duke",
  style = "Renaissance",
  trackingInfo,
  estimatedArrival = "within 6 hours",
}: ShippingNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Good news! {petName}'s portrait is on its way to you.
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
            {/* Status Badge */}
            <Section style={statusBadge}>
              <Text style={statusText}>📦 Order Shipped</Text>
            </Section>

            <Text style={greeting}>Hi {customerName},</Text>

            <Text style={paragraph}>
              Exciting news! {petName}'s beautiful {style} portrait has been completed
              and is now on its way to your inbox.
            </Text>

            {/* Delivery Info */}
            <Section style={deliveryBox}>
              <Text style={deliveryHeading}>Delivery Details</Text>
              <Hr style={deliveryDivider} />

              <table style={deliveryTable}>
                <tbody>
                  <tr>
                    <td style={deliveryLabel}>Pet</td>
                    <td style={deliveryValue}>{petName}</td>
                  </tr>
                  <tr>
                    <td style={deliveryLabel}>Style</td>
                    <td style={deliveryValue}>{style}</td>
                  </tr>
                  {trackingInfo && (
                    <tr>
                      <td style={deliveryLabel}>Tracking</td>
                      <td style={deliveryValueMono}>{trackingInfo}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={deliveryLabel}>Expected</td>
                    <td style={deliveryValueBold}>{estimatedArrival}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* What to Expect */}
            <Section style={tipsBox}>
              <Text style={tipsHeading}>What to Expect</Text>
              <ul style={tipsList}>
                <li style={tipsItem}>
                  <strong>High-Resolution Files:</strong> You'll receive print-ready files
                  perfect for framing
                </li>
                <li style={tipsItem}>
                  <strong>Multiple Formats:</strong> PNG, JPG, and TIFF formats for
                  flexibility
                </li>
                <li style={tipsItem}>
                  <strong>Unlimited Revisions:</strong> Not 100% happy? We'll make it
                  perfect
                </li>
                <li style={tipsItem}>
                  <strong>Download Forever:</strong> Keep your files safe with lifetime
                  access
                </li>
              </ul>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Text style={noteText}>
                You'll receive another email with download links as soon as your portrait
                arrives!
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Text style={footer}>
              Can't wait to see your portrait? Check your inbox in the next few hours!
              Questions? Just reply to this email.
            </Text>

            <Text style={signature}>
              Almost there!
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

const statusBadge = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const statusText = {
  display: "inline-block",
  backgroundColor: "rgba(201, 169, 110, 0.15)",
  border: "1px solid rgba(201, 169, 110, 0.3)",
  borderRadius: "9999px",
  color: "#C9A96E",
  fontSize: "14px",
  fontWeight: "600",
  padding: "8px 20px",
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

const deliveryBox = {
  backgroundColor: "rgba(201, 169, 110, 0.05)",
  border: "1px solid rgba(201, 169, 110, 0.2)",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const deliveryHeading = {
  color: "#C9A96E",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const deliveryDivider = {
  borderColor: "rgba(201, 169, 110, 0.2)",
  margin: "16px 0",
};

const deliveryTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const deliveryLabel = {
  color: "#86868b",
  fontSize: "14px",
  padding: "8px 0",
  width: "40%",
};

const deliveryValue = {
  color: "#F5F5F7",
  fontSize: "14px",
  padding: "8px 0",
  textAlign: "right" as const,
};

const deliveryValueBold = {
  color: "#C9A96E",
  fontSize: "15px",
  fontWeight: "600",
  padding: "8px 0",
  textAlign: "right" as const,
};

const deliveryValueMono = {
  color: "#86868b",
  fontSize: "12px",
  padding: "8px 0",
  textAlign: "right" as const,
  fontFamily: "monospace",
};

const tipsBox = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const tipsHeading = {
  color: "#F5F5F7",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const tipsList = {
  color: "#86868b",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
  paddingLeft: "20px",
};

const tipsItem = {
  marginBottom: "12px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const noteText = {
  color: "#C9A96E",
  fontSize: "15px",
  fontWeight: "500",
  textAlign: "center" as const,
  margin: "0",
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
