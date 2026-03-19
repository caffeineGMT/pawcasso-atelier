import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface AbandonedCart72hrEmailProps {
  tier: string;
  petName: string;
  discountCode: string;
  checkoutUrl: string;
}

export const AbandonedCart72hrEmail = ({
  tier = 'Basic',
  petName = 'Your Pet',
  discountCode = 'CART20-XXXXXXXX',
  checkoutUrl = 'https://pawcasso-atelier.vercel.app/order',
}: AbandonedCart72hrEmailProps) => {
  const previewText = `FINAL OFFER: 20% off ${petName}'s portrait — Last chance!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src="https://pawcasso-atelier.vercel.app/logo.png"
              width="120"
              height="40"
              alt="Pawcasso Atelier"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={urgentBadge}>⚠️ FINAL REMINDER</Text>
            <Heading style={h1}>Last chance: 20% off!</Heading>

            <Text style={text}>
              This is our final email about {petName}'s <strong style={bold}>{tier}</strong> portrait.
            </Text>

            <Text style={text}>
              We don't want you to miss out, so we're offering our <strong style={bold}>absolute best discount: 20% off</strong> — but this is the last offer.
            </Text>

            {/* Discount Code Box */}
            <Section style={discountBox}>
              <Text style={discountLabel}>Your Final Discount Code</Text>
              <Text style={discountCodeText}>{discountCode}</Text>
              <Text style={discountSubtext}>20% off • Expires in 12 hours</Text>
            </Section>

            <Text style={urgentText}>
              🚨 This is our maximum discount. After this, your cart will be permanently removed.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={checkoutUrl}>
                Claim 20% Off — Final Offer →
              </Button>
            </Section>

            <Text style={smallText}>
              Or copy and paste this link into your browser:
              <br />
              <Link href={checkoutUrl} style={link}>
                {checkoutUrl}
              </Link>
            </Text>

            {/* Testimonial Section */}
            <Section style={testimonialSection}>
              <Text style={testimonialQuote}>
                "We were blown away by the quality! My dog Cooper's portrait now hangs in our living room. Everyone asks where we got it."
              </Text>
              <Text style={testimonialAuthor}>
                — Sarah M., Premium Package Customer
              </Text>
            </Section>

            <Text style={text}>
              Have any questions before ordering? Just reply to this email — we're here to help!
            </Text>

            <Text style={signature}>
              — The Pawcasso Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Pawcasso Atelier • AI-Generated Pet Portraits
            </Text>
            <Text style={footerText}>
              <Link href="https://pawcasso-atelier.vercel.app" style={footerLink}>
                Visit Our Gallery
              </Link>
              {' • '}
              <Link href="https://instagram.com/pawcasso.atelier" style={footerLink}>
                Instagram
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href={`${checkoutUrl}?unsubscribe=true`} style={unsubscribeLink}>
                Unsubscribe from marketing emails
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AbandonedCart72hrEmail;

// Styles
const main = {
  backgroundColor: '#000000',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#000000',
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #1d1d1f',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '32px 24px',
};

const urgentBadge = {
  backgroundColor: '#ff3b30',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  padding: '8px 16px',
  borderRadius: '6px',
  textAlign: 'center' as const,
  display: 'inline-block',
  margin: '0 auto 16px',
  width: '100%',
};

const h1 = {
  color: '#F5F5F7',
  fontSize: '32px',
  fontWeight: '600',
  lineHeight: '1.2',
  margin: '0 0 24px',
  textAlign: 'center' as const,
  letterSpacing: '-0.02em',
};

const text = {
  color: '#F5F5F7',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const urgentText = {
  color: '#ff3b30',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '1.6',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const bold = {
  color: '#C9A96E',
  fontWeight: '600',
};

const discountBox = {
  backgroundColor: '#1a1a1a',
  border: '3px solid #ff3b30',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
  textAlign: 'center' as const,
  boxShadow: '0 0 20px rgba(255, 59, 48, 0.3)',
};

const discountLabel = {
  color: '#86868b',
  fontSize: '12px',
  fontWeight: '500',
  letterSpacing: '0.4em',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const discountCodeText = {
  color: '#ff3b30',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '0.05em',
  margin: '0 0 8px',
  fontFamily: 'monospace',
};

const discountSubtext = {
  color: '#ff9500',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#ff3b30',
  borderRadius: '9999px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 48px',
  letterSpacing: '0.02em',
};

const smallText = {
  color: '#86868b',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const link = {
  color: '#C9A96E',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const testimonialSection = {
  backgroundColor: '#111111',
  borderLeft: '4px solid #C9A96E',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
};

const testimonialQuote = {
  color: '#F5F5F7',
  fontSize: '16px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  margin: '0 0 12px',
};

const testimonialAuthor = {
  color: '#86868b',
  fontSize: '14px',
  margin: '0',
};

const signature = {
  color: '#F5F5F7',
  fontSize: '16px',
  fontStyle: 'italic',
  margin: '24px 0 0',
};

const footer = {
  borderTop: '1px solid #1d1d1f',
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#86868b',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const footerLink = {
  color: '#86868b',
  textDecoration: 'underline',
};

const unsubscribeLink = {
  color: '#86868b',
  textDecoration: 'underline',
  fontSize: '11px',
};
