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

interface WelcomeEmail05Props {
  email?: string;
}

export const WelcomeEmail05 = ({
  email = 'customer@example.com',
}: WelcomeEmail05Props) => {
  const previewText = `Still thinking about it? Here's what makes Pawcasso different`;

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
            <Heading style={h1}>Still Thinking About It?</Heading>

            <Text style={text}>
              We noticed you haven't ordered your pet portrait yet. That's okay — choosing the perfect art for your furry friend is an important decision!
            </Text>

            <Text style={text}>
              We wanted to reach out one last time to share what makes Pawcasso Atelier different from other custom portrait services:
            </Text>

            {/* Comparison Section */}
            <Section style={comparisonSection}>
              <Text style={comparisonHeading}>Why Choose Pawcasso?</Text>

              <div style={comparisonRow}>
                <div style={comparisonLabel}>Traditional Artists:</div>
                <div style={comparisonValue}>$50-$200, 2-6 weeks wait</div>
              </div>

              <div style={comparisonRow}>
                <div style={comparisonLabel}>Print-on-Demand:</div>
                <div style={comparisonValue}>$25-$50, generic templates</div>
              </div>

              <div style={comparisonRow}>
                <div style={comparisonLabel}>Pawcasso Atelier:</div>
                <div style={comparisonValueHighlight}>$9, 24 hours, 100% custom</div>
              </div>
            </Section>

            {/* What Makes Us Different */}
            <Text style={sectionHeading}>What Makes Us Different</Text>

            <Section style={differentiatorBox}>
              <Text style={differentiatorTitle}>🎨 Museum-Quality AI Art</Text>
              <Text style={differentiatorText}>
                We don't use generic filters or templates. Each portrait is crafted by our custom-trained AI artist that understands composition, lighting, and the nuances of fine art. The result? Art that looks like it belongs in a gallery.
              </Text>
            </Section>

            <Section style={differentiatorBox}>
              <Text style={differentiatorTitle}>💰 Unbeatable Value</Text>
              <Text style={differentiatorText}>
                At $9, we're 80-95% cheaper than traditional commissioned artwork or print-on-demand services. You get the same quality without the markup. Perfect for creating multiple portraits or gifting to family members.
              </Text>
            </Section>

            <Section style={differentiatorBox}>
              <Text style={differentiatorTitle}>⚡ Lightning Fast Delivery</Text>
              <Text style={differentiatorText}>
                While traditional artists take weeks, we deliver in 24 hours. Upload your pet's photo today, have your portrait tomorrow. Need it faster? Some portraits are ready in as little as 2-4 hours.
              </Text>
            </Section>

            <Section style={differentiatorBox}>
              <Text style={differentiatorTitle}>🎯 Perfect for Every Occasion</Text>
              <Text style={differentiatorText}>
                Birthdays, holidays, memorials, or "just because" — our portraits make meaningful gifts. Frame it, print it on canvas, or keep it digital. The high-resolution file is yours forever.
              </Text>
            </Section>

            <Section style={differentiatorBox}>
              <Text style={differentiatorTitle}>💯 Risk-Free Guarantee</Text>
              <Text style={differentiatorText}>
                Not happy? We offer up to 3 free revisions. Still not satisfied? We'll issue a full refund, no questions asked. Your satisfaction is our only goal.
              </Text>
            </Section>

            {/* Customer Story */}
            <Section style={storyBox}>
              <Text style={storyHeading}>A Recent Customer Story</Text>
              <Text style={storyQuote}>
                "I hesitated for weeks before ordering. I thought 'it's probably too good to be true for $9.' But I took the leap and ordered a Renaissance portrait of my cat. When I opened the email, I literally gasped. It was STUNNING. I've now ordered 5 more for friends and family. Best investment ever."
              </Text>
              <Text style={storyAuthor}>— Emily S., Cat Mom of 2</Text>
            </Section>

            {/* Gallery Showcase */}
            <Text style={sectionHeading}>See What's Possible</Text>
            <Text style={text}>
              Here are just a few examples from our portfolio of 34+ artworks:
            </Text>

            <Section style={gallerySection}>
              <Row>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png"
                    width="180"
                    height="180"
                    alt="Renaissance Cat"
                    style={galleryImage}
                  />
                </Column>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/dog_monet.png"
                    width="180"
                    height="180"
                    alt="Impressionist Dog"
                    style={galleryImage}
                  />
                </Column>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/cat_ghibli.png"
                    width="180"
                    height="180"
                    alt="Ghibli Cat"
                    style={galleryImage}
                  />
                </Column>
              </Row>
            </Section>

            <Section style={buttonContainer}>
              <Button style={buttonSecondary} href="https://pawcasso-atelier.vercel.app/gallery">
                View Full Gallery →
              </Button>
            </Section>

            {/* Final CTA */}
            <Section style={finalCtaBox}>
              <Text style={finalCtaHeading}>Ready to Get Started?</Text>
              <Text style={finalCtaText}>
                Your pet deserves to be immortalized as art. At just $9 and delivered in 24 hours, there's never been a better time to order.
              </Text>
              <Section style={buttonContainer}>
                <Button style={button} href="https://pawcasso-atelier.vercel.app/order">
                  Order Your Portrait Now — $9 →
                </Button>
              </Section>
              <Text style={finalCtaSubtext}>
                24-hour delivery • 100% satisfaction guaranteed • No subscriptions
              </Text>
            </Section>

            <Text style={text}>
              If you have any questions or concerns holding you back, just reply to this email. We're here to help!
            </Text>

            <Text style={signature}>
              We'd love to create art for you,<br />
              The Pawcasso Team
            </Text>

            <Text style={psText}>
              P.S. — This is the last email you'll receive from us about getting started. We don't want to spam you! If you change your mind later, you can always visit our website anytime. ❤️
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

export default WelcomeEmail05;

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
  fontSize: '22px',
  fontWeight: '600',
  margin: '32px 0 16px',
  textAlign: 'center' as const,
};

const comparisonSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const comparisonHeading = {
  color: '#F5F5F7',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const comparisonRow = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid #1d1d1f',
};

const comparisonLabel = {
  color: '#86868b',
  fontSize: '15px',
};

const comparisonValue = {
  color: '#F5F5F7',
  fontSize: '15px',
  textAlign: 'right' as const,
};

const comparisonValueHighlight = {
  color: '#C9A96E',
  fontSize: '15px',
  fontWeight: '600',
  textAlign: 'right' as const,
};

const differentiatorBox = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '20px',
  margin: '0 0 16px',
  borderLeft: '3px solid #C9A96E',
};

const differentiatorTitle = {
  color: '#F5F5F7',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const differentiatorText = {
  color: '#86868b',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
};

const storyBox = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #C9A96E',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const storyHeading = {
  color: '#C9A96E',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
  textAlign: 'center' as const,
};

const storyQuote = {
  color: '#F5F5F7',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 12px',
  fontStyle: 'italic',
};

const storyAuthor = {
  color: '#86868b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
  textAlign: 'right' as const,
};

const gallerySection = {
  margin: '24px 0',
};

const galleryColumn = {
  padding: '0 4px',
};

const galleryImage = {
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #1d1d1f',
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

const finalCtaBox = {
  backgroundColor: '#1a1a1a',
  border: '2px solid #C9A96E',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const finalCtaHeading = {
  color: '#F5F5F7',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const finalCtaText = {
  color: '#F5F5F7',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const finalCtaSubtext = {
  color: '#86868b',
  fontSize: '14px',
  margin: '16px 0 0',
};

const signature = {
  color: '#F5F5F7',
  fontSize: '16px',
  fontStyle: 'italic',
  margin: '32px 0 0',
  lineHeight: '1.6',
};

const psText = {
  color: '#86868b',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '24px 0 0',
  fontStyle: 'italic',
  borderTop: '1px solid #1d1d1f',
  paddingTop: '16px',
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
