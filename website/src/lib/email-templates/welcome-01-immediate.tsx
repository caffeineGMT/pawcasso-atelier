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
  Column,
  Row,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmail01Props {
  email?: string;
  discountCode?: string;
}

export const WelcomeEmail01 = ({
  email = 'customer@example.com',
  discountCode = 'FIRST15',
}: WelcomeEmail01Props) => {
  const previewText = `Welcome to Pawcasso! Here's your 15% discount code`;

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
            <Heading style={h1}>Welcome to Pawcasso Atelier! 🎨</Heading>

            <Text style={text}>
              Thank you for joining our community of pet lovers who appreciate art as much as they love their furry friends.
            </Text>

            <Text style={text}>
              As promised, here's your exclusive 15% discount code. It's valid for your first portrait order:
            </Text>

            {/* Discount Code Box */}
            <Section style={discountBox}>
              <Text style={discountLabel}>Your Exclusive Discount Code</Text>
              <Text style={discountCodeText}>{discountCode}</Text>
              <Text style={discountSubtext}>15% off your first portrait • Valid for 7 days</Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={`https://pawcasso-atelier.vercel.app/order?discount=${discountCode}`}>
                Order Your Portrait Now →
              </Button>
            </Section>

            <Text style={sectionHeading}>✨ Featured Gallery Showcase</Text>
            <Text style={text}>
              Get inspired by our most popular pet portraits. Each one is a unique masterpiece created by our AI artist:
            </Text>

            {/* Gallery Grid */}
            <Section style={gallerySection}>
              <Row>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png"
                    width="260"
                    height="260"
                    alt="Cat with a Pearl Earring - Renaissance"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Renaissance Style</Text>
                </Column>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/dog_monet.png"
                    width="260"
                    height="260"
                    alt="Dog in Monet's Garden - Impressionist"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Impressionist Style</Text>
                </Column>
              </Row>
              <Row style={{ marginTop: '16px' }}>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/cat_ghibli.png"
                    width="260"
                    height="260"
                    alt="Cat in Studio Ghibli Style"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Studio Ghibli Style</Text>
                </Column>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/dog_pop_art.png"
                    width="260"
                    height="260"
                    alt="Dog in Pop Art Style"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Pop Art Style</Text>
                </Column>
              </Row>
            </Section>

            <Section style={buttonContainer}>
              <Button style={buttonSecondary} href="https://pawcasso-atelier.vercel.app/gallery">
                View Full Gallery (34+ Artworks) →
              </Button>
            </Section>

            {/* Why Choose Section */}
            <Section style={featuresSection}>
              <Text style={featuresHeading}>Why Pet Parents Choose Pawcasso:</Text>
              <Text style={featureItem}>🎨 <strong>16+ Art Styles:</strong> Renaissance, Baroque, Impressionist, Ghibli, Ukiyo-e, Pop Art & more</Text>
              <Text style={featureItem}>⚡ <strong>24-Hour Delivery:</strong> Get your high-resolution portrait in just one day</Text>
              <Text style={featureItem}>💎 <strong>Museum Quality:</strong> 4000×5000px resolution, perfect for printing & framing</Text>
              <Text style={featureItem}>💯 <strong>Satisfaction Guaranteed:</strong> Up to 3 free revisions within 14 days</Text>
              <Text style={featureItem}>💰 <strong>Just $9:</strong> No subscriptions, no hidden fees. One portrait, one price.</Text>
            </Section>

            <Text style={text}>
              Questions? Just reply to this email — we're here to help!
            </Text>

            <Text style={signature}>
              Artfully yours,<br />
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

export default WelcomeEmail01;

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

const sectionHeading = {
  color: '#C9A96E',
  fontSize: '20px',
  fontWeight: '600',
  margin: '32px 0 16px',
  textAlign: 'center' as const,
};

const discountBox = {
  backgroundColor: '#1a1a1a',
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

const buttonSecondary = {
  backgroundColor: 'transparent',
  border: '1px solid #C9A96E',
  borderRadius: '9999px',
  color: '#C9A96E',
  fontSize: '15px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const gallerySection = {
  margin: '24px 0',
};

const galleryColumn = {
  padding: '0 8px',
};

const galleryImage = {
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #1d1d1f',
};

const galleryCaption = {
  color: '#86868b',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '8px 0 0',
};

const featuresSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const featuresHeading = {
  color: '#F5F5F7',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const featureItem = {
  color: '#F5F5F7',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 0 12px',
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
