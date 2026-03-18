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

interface AbandonedCartEmailProps {
  tier: string;
  petName: string;
  discountCode: string;
  checkoutUrl: string;
}

export const AbandonedCartEmail = ({
  tier = 'Basic',
  petName = 'Your Pet',
  discountCode = 'CART10-XXXXXXXX',
  checkoutUrl = 'https://pawcasso-atelier.vercel.app/order',
}: AbandonedCartEmailProps) => {
  const previewText = `Complete your ${tier} portrait order for ${petName} — 10% off inside!`;

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
            <Heading style={h1}>Your pet portrait is waiting!</Heading>

            <Text style={text}>
              We noticed you were interested in a <strong style={bold}>{tier}</strong> portrait for <strong style={bold}>{petName}</strong>.
            </Text>

            <Text style={text}>
              We saved your selection! To help you finish your order, here's a special discount code just for you:
            </Text>

            {/* Discount Code Box */}
            <Section style={discountBox}>
              <Text style={discountLabel}>Your Exclusive Discount Code</Text>
              <Text style={discountCodeText}>{discountCode}</Text>
              <Text style={discountSubtext}>10% off • Expires in 48 hours</Text>
            </Section>

            <Text style={text}>
              This code will be automatically applied when you click the button below:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={checkoutUrl}>
                Complete Your Order →
              </Button>
            </Section>

            <Text style={smallText}>
              Or copy and paste this link into your browser:
              <br />
              <Link href={checkoutUrl} style={link}>
                {checkoutUrl}
              </Link>
            </Text>

            {/* Why Choose Pawcasso Section */}
            <Section style={featuresSection}>
              <Text style={featuresHeading}>Why pet parents love Pawcasso:</Text>
              <Text style={featureItem}>✨ Museum-quality AI artwork in 17+ styles</Text>
              <Text style={featureItem}>⚡ Fast delivery (as quick as instant)</Text>
              <Text style={featureItem}>💯 100% satisfaction guaranteed</Text>
            </Section>

            <Text style={text}>
              Have questions? Just reply to this email — we're here to help!
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

export default AbandonedCartEmail;

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

const bold = {
  color: '#C9A96E',
  fontWeight: '600',
};

const discountBox = {
  backgroundColor: '#1a1a1a',
  border: '2px solid #C9A96E',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
  textAlign: 'center' as const,
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
  color: '#C9A96E',
  fontSize: '28px',
  fontWeight: '700',
  letterSpacing: '0.05em',
  margin: '0 0 8px',
  fontFamily: 'monospace',
};

const discountSubtext = {
  color: '#86868b',
  fontSize: '14px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#ffffff',
  borderRadius: '9999px',
  color: '#000000',
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

const featuresSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const featuresHeading = {
  color: '#F5F5F7',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const featureItem = {
  color: '#F5F5F7',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 8px',
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
