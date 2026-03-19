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

interface LeadMagnetTestimonialsEmailProps {
  email?: string;
  firstName?: string;
}

export const LeadMagnetTestimonialsEmail = ({
  email = 'customer@example.com',
  firstName = 'there',
}: LeadMagnetTestimonialsEmailProps) => {
  const previewText = `Real Stories from Pet Parents Who Love Their Portraits`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
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
            <Heading style={h1}>What Pet Parents Are Saying ❤️</Heading>

            <Text style={text}>
              Hi {firstName},
            </Text>

            <Text style={text}>
              Don't just take our word for it. Here's what real customers have to say about their Pawcasso portraits:
            </Text>

            {/* Testimonial 1 */}
            <Section style={testimonialCard}>
              <Text style={testimonialQuote}>
                "I ordered a Renaissance-style portrait of my Golden Retriever, Max, and I literally cried when I saw it.
                It captured his gentle soul perfectly. Now it's framed above my fireplace and every guest asks about it!"
              </Text>
              <div style={testimonialAuthor}>
                <Img
                  src="https://pawcasso-atelier.vercel.app/testimonials/sarah-avatar.jpg"
                  width="48"
                  height="48"
                  alt="Sarah M."
                  style={authorAvatar}
                />
                <div>
                  <Text style={authorName}>Sarah M.</Text>
                  <Text style={authorLocation}>Seattle, WA</Text>
                </div>
              </div>
              <div style={testimonialRating}>⭐⭐⭐⭐⭐</div>
            </Section>

            {/* Testimonial 2 */}
            <Section style={testimonialCard}>
              <Text style={testimonialQuote}>
                "We lost our cat Luna last year, and I wanted a special way to remember her. The Studio Ghibli portrait
                is absolutely magical — it's like she's still with us. Worth every penny. Thank you, Pawcasso!"
              </Text>
              <div style={testimonialAuthor}>
                <Img
                  src="https://pawcasso-atelier.vercel.app/testimonials/mike-avatar.jpg"
                  width="48"
                  height="48"
                  alt="Mike & Jessica T."
                  style={authorAvatar}
                />
                <div>
                  <Text style={authorName}>Mike & Jessica T.</Text>
                  <Text style={authorLocation}>Austin, TX</Text>
                </div>
              </div>
              <div style={testimonialRating}>⭐⭐⭐⭐⭐</div>
            </Section>

            {/* Testimonial 3 */}
            <Section style={testimonialCard}>
              <Text style={testimonialQuote}>
                "I ordered 5 portraits (one for each family member) as Christmas gifts. The Pop Art style was PERFECT.
                Everyone loved them, and the quality was outstanding. Already planning to order more!"
              </Text>
              <div style={testimonialAuthor}>
                <Img
                  src="https://pawcasso-atelier.vercel.app/testimonials/amanda-avatar.jpg"
                  width="48"
                  height="48"
                  alt="Amanda R."
                  style={authorAvatar}
                />
                <div>
                  <Text style={authorName}>Amanda R.</Text>
                  <Text style={authorLocation}>Boston, MA</Text>
                </div>
              </div>
              <div style={testimonialRating}>⭐⭐⭐⭐⭐</div>
            </Section>

            {/* Stats Section */}
            <Section style={statsSection}>
              <Text style={statsSectionHeading}>Trusted by 1,200+ Pet Parents</Text>
              <div style={statsGrid}>
                <div style={statItem}>
                  <Text style={statNumber}>4.9/5</Text>
                  <Text style={statLabel}>Average Rating</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>1,200+</Text>
                  <Text style={statLabel}>Happy Customers</Text>
                </div>
                <div style={statItem}>
                  <Text style={statNumber}>98%</Text>
                  <Text style={statLabel}>Would Recommend</Text>
                </div>
              </div>
            </Section>

            {/* Why They Love It */}
            <Section style={featuresSection}>
              <Text style={featuresHeading}>Why Pet Parents Love Pawcasso:</Text>
              <Text style={featureItem}>💎 <strong>Museum-Quality Art:</strong> 4000×5000px high-resolution files</Text>
              <Text style={featureItem}>⚡ <strong>Fast Delivery:</strong> 24-hour turnaround (not 2-3 weeks like competitors)</Text>
              <Text style={featureItem}>🎨 <strong>16+ Art Styles:</strong> From Renaissance to Studio Ghibli</Text>
              <Text style={featureItem}>💯 <strong>Risk-Free:</strong> Up to 3 free revisions within 14 days</Text>
              <Text style={featureItem}>💰 <strong>Affordable:</strong> Just $9 (vs $50-$200 for custom artists)</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href="https://pawcasso-atelier.vercel.app/gallery/customer-reviews">
                Read More Reviews (47+) →
              </Button>
            </Section>

            <Text style={text}>
              Tomorrow, I'll be sending you an exclusive discount code as a thank you for being part of our community.
              Keep an eye on your inbox! 🎁
            </Text>

            <Text style={signature}>
              With gratitude,<br />
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

export default LeadMagnetTestimonialsEmail;

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

const testimonialCard = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 20px',
};

const testimonialQuote = {
  color: '#F5F5F7',
  fontSize: '15px',
  lineHeight: '1.7',
  fontStyle: 'italic',
  margin: '0 0 16px',
};

const testimonialAuthor = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
};

const authorAvatar = {
  borderRadius: '50%',
  border: '2px solid #C9A96E',
};

const authorName = {
  color: '#F5F5F7',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const authorLocation = {
  color: '#86868b',
  fontSize: '13px',
  margin: '0',
};

const testimonialRating = {
  color: '#C9A96E',
  fontSize: '14px',
};

const statsSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const statsSectionHeading = {
  color: '#C9A96E',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 24px',
};

const statsGrid = {
  display: 'flex',
  justifyContent: 'space-around',
  gap: '20px',
};

const statItem = {
  textAlign: 'center' as const,
};

const statNumber = {
  color: '#C9A96E',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const statLabel = {
  color: '#86868b',
  fontSize: '13px',
  margin: '0',
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
