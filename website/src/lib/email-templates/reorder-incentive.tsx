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

interface ReorderIncentiveProps {
  customerName: string;
  petName: string;
  discountCode: string;
  discountPercent?: number;
  expiryDays?: number;
}

export default function ReorderIncentive({
  customerName = "Sarah",
  petName = "Duke",
  discountCode = "COMEBACK20",
  discountPercent = 20,
  expiryDays = 90,
}: ReorderIncentiveProps) {
  const orderUrl = `https://pawcasso-atelier.vercel.app/order?discount=${discountCode}`;

  return (
    <Html>
      <Head />
      <Preview>
        We miss {petName}! Here's {String(discountPercent)}% off your next portrait.
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
              It's been a month since we created {petName}'s portrait, and we've been
              thinking about you! We hope {petName} is enjoying their artwork as much as
              we enjoyed creating it.
            </Text>

            <Text style={paragraph}>
              As a thank you for being a valued Pawcasso customer, we'd love to offer
              you something special:
            </Text>

            {/* Discount Box */}
            <Section style={discountBox}>
              <Text style={discountBadge}>EXCLUSIVE REPEAT CUSTOMER OFFER</Text>
              <Text style={discountAmount}>{discountPercent}% OFF</Text>
              <Text style={discountSubtext}>Your Next Portrait</Text>

              <Section style={codeBox}>
                <Text style={codeLabel}>Discount Code:</Text>
                <Text style={code}>{discountCode}</Text>
              </Section>

              <Text style={expiryText}>
                Valid for {String(expiryDays)} days • Use as many times as you like!
              </Text>
            </Section>

            {/* Ideas Section */}
            <Section style={ideasBox}>
              <Text style={ideasHeading}>💡 Ideas for Your Next Portrait</Text>

              <Section style={ideaCard}>
                <Text style={ideaTitle}>Try a Different Art Style</Text>
                <Text style={ideaDesc}>
                  Renaissance, Pop Art, Watercolor, Anime... See {petName} in a whole
                  new light!
                </Text>
              </Section>

              <Section style={ideaCard}>
                <Text style={ideaTitle}>Gift for a Fellow Pet Parent</Text>
                <Text style={ideaDesc}>
                  Know someone who'd love a portrait of their fur baby? The perfect
                  gift that keeps on giving.
                </Text>
              </Section>

              <Section style={ideaCard}>
                <Text style={ideaTitle}>Create a Gallery Wall</Text>
                <Text style={ideaDesc}>
                  Multiple styles of {petName} make an amazing gallery wall display.
                  Mix and match!
                </Text>
              </Section>

              <Section style={ideaCard}>
                <Text style={ideaTitle}>Seasonal or Holiday Portrait</Text>
                <Text style={ideaDesc}>
                  {petName} in a holiday, birthday, or seasonal themed portrait. Perfect
                  for greeting cards!
                </Text>
              </Section>

              <Section style={ideaCard}>
                <Text style={ideaTitle}>Memorialize a Special Moment</Text>
                <Text style={ideaDesc}>
                  Capture a favorite memory, a silly expression, or that time {petName}{" "}
                  did something unforgettable.
                </Text>
              </Section>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button style={button} href={orderUrl}>
                Order Another Portrait
              </Button>
            </Section>

            {/* Loyalty Program Hint */}
            <Section style={loyaltyBox}>
              <Text style={loyaltyHeading}>🏆 Loyalty Perks Unlocked</Text>
              <Text style={loyaltyText}>
                Did you know? As a repeat customer, you're automatically enrolled in our
                loyalty program. Every order earns you:
              </Text>
              <ul style={loyaltyList}>
                <li>Priority support</li>
                <li>Early access to new styles</li>
                <li>Birthday portrait reminders for {petName}</li>
                <li>Exclusive discounts</li>
              </ul>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Text style={footer}>
              Questions about this offer? Just reply to this email. We're always happy
              to hear from you!
            </Text>

            <Text style={signature}>
              We miss you!
              <br />
              The Pawcasso Atelier Team
            </Text>

            <Text style={psFooter}>
              P.S. Know someone who'd love a custom pet portrait? Forward this email and
              they'll get 20% off too!
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

const discountBox = {
  backgroundColor: "rgba(201, 169, 110, 0.1)",
  border: "2px solid rgba(201, 169, 110, 0.3)",
  borderRadius: "16px",
  padding: "40px 32px",
  margin: "32px 0",
  textAlign: "center" as const,
};

const discountBadge = {
  display: "inline-block",
  backgroundColor: "rgba(201, 169, 110, 0.2)",
  borderRadius: "9999px",
  color: "#C9A96E",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  textTransform: "uppercase" as const,
  padding: "6px 16px",
  margin: "0 0 16px 0",
};

const discountAmount = {
  color: "#C9A96E",
  fontSize: "56px",
  fontWeight: "800",
  margin: "16px 0",
  letterSpacing: "-0.02em",
};

const discountSubtext = {
  color: "#86868b",
  fontSize: "18px",
  margin: "0 0 24px 0",
};

const codeBox = {
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  border: "1px dashed rgba(201, 169, 110, 0.4)",
  borderRadius: "12px",
  padding: "20px",
  margin: "24px 0",
};

const codeLabel = {
  color: "#86868b",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 8px 0",
};

const code = {
  color: "#C9A96E",
  fontSize: "24px",
  fontWeight: "700",
  fontFamily: "monospace",
  letterSpacing: "3px",
  margin: "0",
};

const expiryText = {
  color: "#86868b",
  fontSize: "13px",
  margin: "16px 0 0 0",
};

const ideasBox = {
  margin: "32px 0",
};

const ideasHeading = {
  color: "#F5F5F7",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 24px 0",
};

const ideaCard = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "12px",
  padding: "20px",
  margin: "0 0 12px 0",
};

const ideaTitle = {
  color: "#C9A96E",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const ideaDesc = {
  color: "#86868b",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const loyaltyBox = {
  backgroundColor: "rgba(201, 169, 110, 0.05)",
  borderLeft: "3px solid #C9A96E",
  padding: "20px 24px",
  margin: "32px 0",
};

const loyaltyHeading = {
  color: "#C9A96E",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const loyaltyText = {
  color: "#86868b",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};

const loyaltyList = {
  color: "#86868b",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
  paddingLeft: "20px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
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
  margin: "24px 0 16px 0",
};

const psFooter = {
  color: "#86868b",
  fontSize: "13px",
  fontStyle: "italic",
  margin: "24px 0 0 0",
  paddingTop: "24px",
  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
};
