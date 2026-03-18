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

interface WelcomeEmail04Props {
  discountCode?: string;
}

export const WelcomeEmail04 = ({
  discountCode = 'FIRST15',
}: WelcomeEmail04Props) => {
  const previewText = `⏰ Your 15% discount expires in 24 hours!`;

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
            {/* Urgency Badge */}
            <Section style={urgencyBadge}>
              <Text style={urgencyText}>⏰ EXPIRES IN 24 HOURS</Text>
            </Section>

            <Heading style={h1}>Your 15% Discount is Expiring Soon!</Heading>

            <Text style={text}>
              Hi there! Just a friendly reminder that your exclusive welcome discount code is about to expire.
            </Text>

            {/* Countdown-style section */}
            <Section style={countdownBox}>
              <Text style={countdownLabel}>TIME REMAINING</Text>
              <Text style={countdownTime}>24 HOURS</Text>
              <Text style={countdownSubtext}>After that, this offer disappears forever</Text>
            </Section>

            <Text style={text}>
              We'd hate for you to miss out on this opportunity to get a beautiful AI portrait of your pet for <strong style={{color: '#C9A96E'}}>15% off</strong>.
            </Text>

            {/* Discount Code Box */}
            <Section style={discountBox}>
              <Text style={discountLabel}>Your Expiring Discount Code</Text>
              <Text style={discountCodeText}>{discountCode}</Text>
              <Text style={discountSubtext}>15% off • Expires in 24 hours</Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={`https://pawcasso-atelier.vercel.app/order?discount=${discountCode}`}>
                Claim Your Discount Now →
              </Button>
            </Section>

            {/* Why Act Now Section */}
            <Section style={benefitsSection}>
              <Text style={benefitsHeading}>Why Pet Parents Love Pawcasso:</Text>
              <Text style={benefitItem}>💰 <strong>Just $9</strong> — even cheaper with your 15% discount ($7.65!)</Text>
              <Text style={benefitItem}>⚡ <strong>24-Hour Delivery</strong> — Your portrait arrives tomorrow</Text>
              <Text style={benefitItem}>🎨 <strong>16+ Art Styles</strong> — Renaissance, Ghibli, Impressionist & more</Text>
              <Text style={benefitItem}>💎 <strong>Museum Quality</strong> — 4000×5000px, perfect for printing</Text>
              <Text style={benefitItem}>💯 <strong>Satisfaction Guaranteed</strong> — Up to 3 free revisions</Text>
            </Section>

            <Text style={highlightText}>
              At this price, you can order portraits for all your pets, create unique gifts for family members, or even create a gallery wall of your furry friend in different styles!
            </Text>

            {/* Last Chance CTA */}
            <Section style={lastChanceBox}>
              <Text style={lastChanceHeading}>🔥 Last Chance</Text>
              <Text style={lastChanceText}>
                Don't let this opportunity slip away. Order now and receive your stunning pet portrait within 24 hours.
              </Text>
              <Section style={buttonContainer}>
                <Button style={buttonUrgent} href={`https://pawcasso-atelier.vercel.app/order?discount=${discountCode}`}>
                  Order Before It's Too Late →
                </Button>
              </Section>
            </Section>

            <Text style={smallText}>
              After your discount expires, you'll still be able to order portraits — but they'll be at the regular price of $9. Use your code now to save!
            </Text>

            <Text style={signature}>
              Don't miss out!<br />
              The Pawcasso Team
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
              {' • '}
              <Link href="https://pawcasso-atelier.vercel.app/faq" style={footerLink}>
                FAQ
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href="*|UNSUB|*" style={unsubscribeLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail04;

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

const urgencyBadge = {
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

const urgencyText = {
  display: 'inline-block',
  backgroundColor: '#ff6b6b',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  padding: '8px 16px',
  borderRadius: '4px',
  margin: '0',
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

const highlightText = {
  color: '#F5F5F7',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  backgroundColor: '#1a1a1a',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '3px solid #C9A96E',
};

const smallText = {
  color: '#86868b',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '24px 0 16px',
  textAlign: 'center' as const,
};

const countdownBox = {
  backgroundColor: '#1a1a1a',
  border: '2px solid #ff6b6b',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const countdownLabel = {
  color: '#86868b',
  fontSize: '12px',
  fontWeight: '500',
  letterSpacing: '0.4em',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const countdownTime = {
  color: '#ff6b6b',
  fontSize: '48px',
  fontWeight: '700',
  letterSpacing: '0.05em',
  margin: '0 0 8px',
};

const countdownSubtext = {
  color: '#86868b',
  fontSize: '14px',
  margin: '0',
};

const discountBox = {
  backgroundColor: '#111111',
  border: '2px solid #C9A96E',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
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
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '0.1em',
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
  margin: '24px 0',
};

const button = {
  backgroundColor: '#C9A96E',
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

const buttonUrgent = {
  backgroundColor: '#ff6b6b',
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

const benefitsSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const benefitsHeading = {
  color: '#F5F5F7',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const benefitItem = {
  color: '#F5F5F7',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 0 12px',
};

const lastChanceBox = {
  backgroundColor: '#1a1a1a',
  border: '2px solid #ff6b6b',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const lastChanceHeading = {
  color: '#ff6b6b',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 16px',
};

const lastChanceText = {
  color: '#F5F5F7',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const signature = {
  color: '#F5F5F7',
  fontSize: '16px',
  fontStyle: 'italic',
  margin: '32px 0 0',
  lineHeight: '1.6',
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
