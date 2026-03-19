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

interface LeadMagnetGuideEmailProps {
  email?: string;
  firstName?: string;
}

export const LeadMagnetGuideEmail = ({
  email = 'customer@example.com',
  firstName = 'there',
}: LeadMagnetGuideEmailProps) => {
  const previewText = `Your Free Pet Photo Guide + 10 Pro Tips Inside`;

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
            <Heading style={h1}>Your Free Pet Photo Guide is Here! 📸</Heading>

            <Text style={text}>
              Hi {firstName},
            </Text>

            <Text style={text}>
              Thank you for requesting our guide! You're about to discover the exact smartphone photography techniques
              that professional pet photographers use to capture stunning portraits.
            </Text>

            {/* Guide CTA Box */}
            <Section style={guideBox}>
              <Text style={guideTitle}>🎁 Free Download</Text>
              <Heading style={guideHeading}>How to Take the Perfect Pet Photo for Portraits</Heading>
              <Text style={guideSubtitle}>10 Pro Tips for Smartphone Photography</Text>

              <Section style={buttonContainer}>
                <Button style={button} href="https://pawcasso-atelier.vercel.app/guide/pet-photo-tips">
                  Read the Guide Now →
                </Button>
              </Section>

              <Text style={guideNote}>
                💡 Bookmark this page — you'll want to reference it every time you photograph your pet
              </Text>
            </Section>

            {/* What You'll Learn */}
            <Section style={featuresSection}>
              <Text style={featuresHeading}>What You'll Learn:</Text>
              <Text style={featureItem}>📸 <strong>Lighting Secrets:</strong> How to use natural light for magazine-quality photos</Text>
              <Text style={featureItem}>👁️ <strong>Perfect Angles:</strong> The one angle that makes every pet look amazing</Text>
              <Text style={featureItem}>🎯 <strong>Focus Techniques:</strong> How to get tack-sharp eyes every time</Text>
              <Text style={featureItem}>✨ <strong>Personality Capture:</strong> Bring out your pet's unique character</Text>
              <Text style={featureItem}>⏰ <strong>Timing Tips:</strong> When (and when NOT) to shoot</Text>
            </Section>

            <Text style={text}>
              Once you've captured the perfect photo, we can transform it into a museum-quality AI portrait in
              16+ art styles — Renaissance, Impressionist, Studio Ghibli, Pop Art, and more.
            </Text>

            {/* Sample Gallery */}
            <Text style={sectionHeading}>✨ See What's Possible</Text>
            <Section style={galleryPreview}>
              <Img
                src="https://pawcasso-atelier.vercel.app/gallery/dog_monet.png"
                width="520"
                height="260"
                alt="Sample AI Pet Portrait - Impressionist Style"
                style={sampleImage}
              />
              <Text style={galleryCaption}>
                From smartphone photo → AI masterpiece in 24 hours
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={buttonSecondary} href="https://pawcasso-atelier.vercel.app/gallery">
                View Full Gallery (34+ Artworks) →
              </Button>
            </Section>

            {/* Why Choose Pawcasso */}
            <Section style={whySection}>
              <Text style={whySectionHeading}>Why 1,200+ Pet Parents Choose Pawcasso:</Text>
              <Text style={featureItem}>🎨 16+ Art Styles (Renaissance, Baroque, Impressionist, Ghibli, Ukiyo-e, Pop Art)</Text>
              <Text style={featureItem}>⚡ 24-Hour Delivery (your portrait ready tomorrow)</Text>
              <Text style={featureItem}>💎 Museum Quality (4000×5000px resolution)</Text>
              <Text style={featureItem}>💯 Satisfaction Guaranteed (up to 3 free revisions)</Text>
              <Text style={featureItem}>💰 Just $9 (no subscriptions, no hidden fees)</Text>
            </Section>

            <Text style={text}>
              Over the next week, I'll be sharing gallery examples, customer stories, and a special discount code.
              Keep an eye on your inbox!
            </Text>

            <Text style={signature}>
              Happy photographing,<br />
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
              You're receiving this because you requested our pet photo guide.
            </Text>
            <Text style={footerText}>
              <Link href="https://pawcasso-atelier.vercel.app/unsubscribe?email={{email}}" style={unsubscribeLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default LeadMagnetGuideEmail;

// Styles
const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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

const guideBox = {
  backgroundColor: '#1a1a1a',
  border: '2px solid #C9A96E',
  borderRadius: '12px',
  padding: '32px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const guideTitle = {
  color: '#C9A96E',
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
};

const guideHeading = {
  color: '#F5F5F7',
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 8px',
};

const guideSubtitle = {
  color: '#86868b',
  fontSize: '16px',
  margin: '0 0 24px',
};

const guideNote = {
  color: '#86868b',
  fontSize: '13px',
  fontStyle: 'italic',
  margin: '16px 0 0',
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

const sectionHeading = {
  color: '#C9A96E',
  fontSize: '20px',
  fontWeight: '600',
  margin: '32px 0 16px',
  textAlign: 'center' as const,
};

const featuresSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
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

const galleryPreview = {
  margin: '24px 0',
  textAlign: 'center' as const,
};

const sampleImage = {
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #1d1d1f',
};

const galleryCaption = {
  color: '#86868b',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '12px 0 0',
  fontStyle: 'italic',
};

const whySection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const whySectionHeading = {
  color: '#F5F5F7',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
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
