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

interface WelcomeEmail02Props {
  discountCode?: string;
}

export const WelcomeEmail02 = ({
  discountCode = 'FIRST15',
}: WelcomeEmail02Props) => {
  const previewText = `How Pawcasso Works: 3 Simple Steps to Your Pet Portrait`;

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
            <Heading style={h1}>How It Works</Heading>

            <Text style={text}>
              Creating your custom pet portrait is simple. Here's exactly what happens after you place your order:
            </Text>

            {/* Step 1 */}
            <Section style={stepSection}>
              <div style={stepNumber}>1</div>
              <Text style={stepTitle}>Upload Your Pet's Photo</Text>
              <Text style={stepText}>
                Send us your favorite photo of your pet. Any angle, any lighting — we make it work. The clearer the photo, the better the portrait, but our AI is trained to work with all types of images.
              </Text>
              <Text style={stepTip}>
                <strong>💡 Pro Tip:</strong> Photos with good lighting and your pet facing the camera work best, but candid shots create unique, personality-filled portraits too!
              </Text>
            </Section>

            {/* Step 2 */}
            <Section style={stepSection}>
              <div style={stepNumber}>2</div>
              <Text style={stepTitle}>Choose Your Art Style</Text>
              <Text style={stepText}>
                Pick from 16+ curated art styles including Renaissance, Baroque, Impressionist, Studio Ghibli, Ukiyo-e, Pop Art, and more. Not sure which style? Send us a reference image and we'll match it perfectly.
              </Text>
              <Text style={stepTip}>
                <strong>🎨 Popular Styles:</strong> Renaissance (regal & classical), Ghibli (whimsical & charming), Impressionist (dreamy & painterly), Pop Art (bold & colorful)
              </Text>
            </Section>

            {/* Step 3 */}
            <Section style={stepSection}>
              <div style={stepNumber}>3</div>
              <Text style={stepTitle}>Receive Your Masterpiece</Text>
              <Text style={stepText}>
                Within 24 hours, you'll receive a stunning high-resolution digital portrait (4000×5000px) delivered straight to your inbox. Print it, frame it, share it — it's yours to enjoy forever.
              </Text>
              <Text style={stepTip}>
                <strong>📦 What You Get:</strong> Museum-quality PNG file, perfect for printing at any size up to 16×20 inches or larger. Plus unlimited revisions within 14 days if you want any changes!
              </Text>
            </Section>

            {/* CTA */}
            <Section style={ctaBox}>
              <Text style={ctaText}>
                Ready to get started? Your 15% discount is waiting:
              </Text>
              <Text style={ctaCode}>{discountCode}</Text>
              <Section style={buttonContainer}>
                <Button style={button} href={`https://pawcasso-atelier.vercel.app/order?discount=${discountCode}`}>
                  Order Your Portrait Now →
                </Button>
              </Section>
            </Section>

            {/* FAQ Section */}
            <Text style={sectionHeading}>Frequently Asked Questions</Text>

            <Section style={faqItem}>
              <Text style={faqQuestion}>Q: What file format do I receive?</Text>
              <Text style={faqAnswer}>
                A: You'll receive a high-resolution PNG file (4000×5000 pixels) — perfect for printing at sizes up to 16×20" or larger. The file is optimized for both digital sharing and professional printing.
              </Text>
            </Section>

            <Section style={faqItem}>
              <Text style={faqQuestion}>Q: How long does it really take?</Text>
              <Text style={faqAnswer}>
                A: Most portraits are delivered within 24 hours. During busy periods, it may take up to 48 hours. You'll receive an email as soon as your portrait is ready.
              </Text>
            </Section>

            <Section style={faqItem}>
              <Text style={faqQuestion}>Q: What if I'm not happy with the result?</Text>
              <Text style={faqAnswer}>
                A: We offer up to 3 free revisions within 14 days of delivery. Want a different style? Different pose? Just let us know and we'll make it right. Your satisfaction is our priority.
              </Text>
            </Section>

            <Section style={faqItem}>
              <Text style={faqQuestion}>Q: Can you work from old or blurry photos?</Text>
              <Text style={faqAnswer}>
                A: Yes! Our AI is trained to work with all types of photos. While clearer photos produce better results, we can create beautiful portraits from vintage photos, phone snapshots, and even slightly blurry images.
              </Text>
            </Section>

            <Section style={faqItem}>
              <Text style={faqQuestion}>Q: Do you work with all types of pets?</Text>
              <Text style={faqAnswer}>
                A: Absolutely! Dogs, cats, rabbits, birds, hamsters, horses — if you love them, we'll paint them. Each portrait is customized to capture your pet's unique personality.
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={buttonSecondary} href="https://pawcasso-atelier.vercel.app/faq">
                View All FAQs →
              </Button>
            </Section>

            <Text style={text}>
              Still have questions? Just hit reply — we're here to help!
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

export default WelcomeEmail02;

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

const stepSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 20px',
  borderLeft: '3px solid #C9A96E',
};

const stepNumber = {
  display: 'inline-block',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#C9A96E',
  color: '#000000',
  fontSize: '20px',
  fontWeight: '700',
  textAlign: 'center' as const,
  lineHeight: '40px',
  marginBottom: '16px',
};

const stepTitle = {
  color: '#F5F5F7',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const stepText = {
  color: '#F5F5F7',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 12px',
};

const stepTip = {
  color: '#86868b',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  fontStyle: 'italic',
};

const ctaBox = {
  backgroundColor: '#1a1a1a',
  border: '2px solid #C9A96E',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const ctaText = {
  color: '#F5F5F7',
  fontSize: '16px',
  margin: '0 0 12px',
};

const ctaCode = {
  color: '#C9A96E',
  fontSize: '28px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  margin: '0 0 24px',
  fontFamily: 'monospace',
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

const faqItem = {
  margin: '0 0 20px',
  paddingBottom: '20px',
  borderBottom: '1px solid #1d1d1f',
};

const faqQuestion = {
  color: '#F5F5F7',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const faqAnswer = {
  color: '#86868b',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
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
