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

interface DeliveryConfirmationProps {
  customerName: string;
  petName: string;
  style: string;
  downloadUrl: string;
  portraitUrls?: string[];
}

export default function DeliveryConfirmation({
  customerName = "Sarah",
  petName = "Duke",
  style = "Renaissance",
  downloadUrl = "https://pawcasso-atelier.vercel.app/download/abc123",
  portraitUrls = [],
}: DeliveryConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        🎨 {petName}'s portrait has arrived! Download your masterpiece now.
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
              <Text style={statusText}>✨ Portrait Delivered</Text>
            </Section>

            <Text style={greeting}>Hi {customerName},</Text>

            <Text style={paragraphBold}>
              Your {petName} {style} portrait is ready! 🎉
            </Text>

            <Text style={paragraph}>
              We're so excited to share this beautiful artwork with you. Our AI artists
              have crafted something truly special.
            </Text>

            {/* Download CTA */}
            <Section style={downloadBox}>
              <Text style={downloadHeading}>Your Portrait is Ready</Text>
              <Text style={downloadSubtext}>
                High-resolution files in multiple formats
              </Text>

              <Section style={buttonContainer}>
                <Button style={button} href={downloadUrl}>
                  Download Your Portrait
                </Button>
              </Section>

              <Text style={downloadNote}>
                Available in PNG, JPG, and TIFF formats • Print-ready quality
              </Text>
            </Section>

            {/* Next Steps */}
            <Section style={stepsBox}>
              <Text style={stepsHeading}>What You Can Do Next</Text>
              <ul style={stepsList}>
                <li style={stepsItem}>
                  <strong>Frame It:</strong> Print at your local shop or use an online
                  service like Printful
                </li>
                <li style={stepsItem}>
                  <strong>Share It:</strong> Post on Instagram and tag{" "}
                  <span style={{ color: "#C9A96E" }}>@pawcasso.atelier</span> for 25%
                  off your next order
                </li>
                <li style={stepsItem}>
                  <strong>Need Changes?:</strong> Not 100% satisfied? Reply to this
                  email for unlimited revisions
                </li>
                <li style={stepsItem}>
                  <strong>Gift It:</strong> Forward this email to a fellow pet parent who
                  might love one too!
                </li>
              </ul>
            </Section>

            {/* Social Proof */}
            <Section style={reviewBox}>
              <Text style={reviewHeading}>❤️ Join 10,000+ Happy Pet Parents</Text>
              <Text style={reviewQuote}>
                "I cried when I saw my dog's portrait. It's absolutely stunning and
                captures her personality perfectly. Worth every penny!"
              </Text>
              <Text style={reviewAuthor}>— Jessica M., San Francisco</Text>
            </Section>

            {/* Secondary CTA */}
            <Section style={buttonContainer}>
              <Button
                style={secondaryButton}
                href="https://pawcasso-atelier.vercel.app/order"
              >
                Order Another Portrait
              </Button>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Text style={footer}>
              Love your portrait? We'd be thrilled if you shared it on social media! Tag
              us @pawcasso.atelier for a chance to be featured.
            </Text>

            <Text style={signature}>
              Made with love,
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

const paragraphBold = {
  color: "#F5F5F7",
  fontSize: "20px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0 0 16px 0",
};

const downloadBox = {
  backgroundColor: "rgba(201, 169, 110, 0.1)",
  border: "2px solid rgba(201, 169, 110, 0.3)",
  borderRadius: "16px",
  padding: "32px",
  margin: "32px 0",
  textAlign: "center" as const,
};

const downloadHeading = {
  color: "#C9A96E",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const downloadSubtext = {
  color: "#86868b",
  fontSize: "14px",
  margin: "0 0 24px 0",
};

const downloadNote = {
  color: "#86868b",
  fontSize: "12px",
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

const reviewBox = {
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderLeft: "3px solid #C9A96E",
  padding: "20px 24px",
  margin: "24px 0",
};

const reviewHeading = {
  color: "#C9A96E",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const reviewQuote = {
  color: "#F5F5F7",
  fontSize: "15px",
  fontStyle: "italic",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};

const reviewAuthor = {
  color: "#86868b",
  fontSize: "13px",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#C9A96E",
  borderRadius: "9999px",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 40px",
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
