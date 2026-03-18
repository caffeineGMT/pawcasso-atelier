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

interface WelcomeEmail03Props {
  discountCode?: string;
}

export const WelcomeEmail03 = ({
  discountCode = 'FIRST15',
}: WelcomeEmail03Props) => {
  const previewText = `See What Pet Parents Are Saying About Pawcasso`;

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
            <Heading style={h1}>What Pet Parents Are Saying</Heading>

            <Text style={text}>
              Don't just take our word for it. Here's what our community of happy pet parents has to say about their Pawcasso portraits:
            </Text>

            {/* Testimonial 1 */}
            <Section style={testimonialBox}>
              <div style={stars}>⭐⭐⭐⭐⭐</div>
              <Text style={testimonialText}>
                "I was skeptical at first, but WOW. The Renaissance portrait of my Golden Retriever looks like it belongs in a museum. I've ordered 3 more for family gifts!"
              </Text>
              <Text style={testimonialAuthor}>
                — Sarah M., Dog Mom
              </Text>
            </Section>

            {/* Testimonial 2 */}
            <Section style={testimonialBox}>
              <div style={stars}>⭐⭐⭐⭐⭐</div>
              <Text style={testimonialText}>
                "We lost our cat last year and wanted to honor her memory. The Studio Ghibli portrait brought tears to my eyes — it captured her spirit perfectly. Thank you for this gift."
              </Text>
              <Text style={testimonialAuthor}>
                — Michael T., Cat Dad
              </Text>
            </Section>

            {/* Testimonial 3 */}
            <Section style={testimonialBox}>
              <div style={stars}>⭐⭐⭐⭐⭐</div>
              <Text style={testimonialText}>
                "For $9?! I expected a quick AI gimmick but got actual ART. The impressionist style of my Border Collie now hangs in my living room. Best $9 I've ever spent."
              </Text>
              <Text style={testimonialAuthor}>
                — Jessica L., Pet Parent
              </Text>
            </Section>

            {/* Testimonial 4 */}
            <Section style={testimonialBox}>
              <div style={stars}>⭐⭐⭐⭐⭐</div>
              <Text style={testimonialText}>
                "The customer service is incredible. They did 2 revisions to get the portrait just right, no questions asked. The final result is stunning — Pop Art style of my French Bulldog!"
              </Text>
              <Text style={testimonialAuthor}>
                — David R., Frenchie Owner
              </Text>
            </Section>

            {/* Stats Section */}
            <Section style={statsSection}>
              <Text style={statsHeading}>By The Numbers</Text>
              <div style={statRow}>
                <div style={statBox}>
                  <Text style={statNumber}>2,400+</Text>
                  <Text style={statLabel}>Happy Customers</Text>
                </div>
                <div style={statBox}>
                  <Text style={statNumber}>4.9/5</Text>
                  <Text style={statLabel}>Average Rating</Text>
                </div>
                <div style={statBox}>
                  <Text style={statNumber}>98%</Text>
                  <Text style={statLabel}>Would Recommend</Text>
                </div>
              </div>
            </Section>

            {/* Instagram Gallery Section */}
            <Text style={sectionHeading}>📸 See Us On Instagram</Text>
            <Text style={text}>
              Follow <Link href="https://instagram.com/pawcasso.atelier" style={link}>@pawcasso.atelier</Link> for daily pet portrait inspiration, behind-the-scenes content, and customer features. Tag us in your posts for a chance to be featured!
            </Text>

            <Section style={instagramSection}>
              <Text style={instagramHandle}>@pawcasso.atelier</Text>
              <Section style={buttonContainer}>
                <Button style={buttonSecondary} href="https://instagram.com/pawcasso.atelier">
                  Follow Us on Instagram →
                </Button>
              </Section>
            </Section>

            {/* CTA */}
            <Section style={ctaBox}>
              <Text style={ctaHeading}>Ready to Join Our Happy Customers?</Text>
              <Text style={ctaText}>
                Your 15% discount is still active. Use code <strong style={{color: '#C9A96E'}}>{discountCode}</strong> at checkout.
              </Text>
              <Section style={buttonContainer}>
                <Button style={button} href={`https://pawcasso-atelier.vercel.app/order?discount=${discountCode}`}>
                  Order Your Portrait Now →
                </Button>
              </Section>
              <Text style={ctaSubtext}>
                ⏰ Code expires in 3 days • 24-hour delivery • Satisfaction guaranteed
              </Text>
            </Section>

            <Text style={text}>
              Questions? We're here to help — just hit reply!
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

export default WelcomeEmail03;

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

const link = {
  color: '#C9A96E',
  textDecoration: 'underline',
};

const sectionHeading = {
  color: '#C9A96E',
  fontSize: '20px',
  fontWeight: '600',
  margin: '32px 0 16px',
  textAlign: 'center' as const,
};

const testimonialBox = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 16px',
  borderLeft: '3px solid #C9A96E',
};

const stars = {
  color: '#C9A96E',
  fontSize: '16px',
  marginBottom: '12px',
};

const testimonialText = {
  color: '#F5F5F7',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 12px',
  fontStyle: 'italic',
};

const testimonialAuthor = {
  color: '#86868b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const statsSection = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #C9A96E',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const statsHeading = {
  color: '#F5F5F7',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 24px',
};

const statRow = {
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap' as const,
};

const statBox = {
  flex: '1',
  minWidth: '120px',
  padding: '8px',
};

const statNumber = {
  color: '#C9A96E',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const statLabel = {
  color: '#86868b',
  fontSize: '13px',
  margin: '0',
};

const instagramSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const instagramHandle = {
  color: '#C9A96E',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '16px 0',
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

const ctaBox = {
  backgroundColor: '#1a1a1a',
  border: '2px solid #C9A96E',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const ctaHeading = {
  color: '#F5F5F7',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const ctaText = {
  color: '#F5F5F7',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const ctaSubtext = {
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
