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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface LeadMagnetGalleryEmailProps {
  email?: string;
  firstName?: string;
}

export const LeadMagnetGalleryEmail = ({
  email = 'customer@example.com',
  firstName = 'there',
}: LeadMagnetGalleryEmailProps) => {
  const previewText = `See 34+ Stunning AI Pet Portraits for Inspiration`;

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
            <Heading style={h1}>Get Inspired: Our Gallery Showcase 🎨</Heading>

            <Text style={text}>
              Hi {firstName},
            </Text>

            <Text style={text}>
              Now that you know how to capture the perfect pet photo, let me show you what's possible when you
              transform it into AI art.
            </Text>

            <Text style={text}>
              Here are our most popular portrait styles — each one is a museum-quality masterpiece created from
              a simple smartphone photo:
            </Text>

            {/* Gallery Grid */}
            <Section style={gallerySection}>
              <Text style={galleryHeading}>🏛️ Classic & Timeless</Text>
              <Row>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png"
                    width="260"
                    height="260"
                    alt="Renaissance Pet Portrait"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Renaissance Style</Text>
                  <Text style={galleryDescription}>Inspired by Vermeer's "Girl with a Pearl Earring"</Text>
                </Column>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/dog_baroque.png"
                    width="260"
                    height="260"
                    alt="Baroque Pet Portrait"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Baroque Style</Text>
                  <Text style={galleryDescription}>Rich, dramatic lighting & regal composition</Text>
                </Column>
              </Row>

              <Text style={galleryHeading}>🌸 Impressionist & Artistic</Text>
              <Row style={{ marginTop: '16px' }}>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/dog_monet.png"
                    width="260"
                    height="260"
                    alt="Impressionist Pet Portrait"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Impressionist Style</Text>
                  <Text style={galleryDescription}>Monet-inspired soft brushstrokes & light</Text>
                </Column>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/cat_ukiyo-e.png"
                    width="260"
                    height="260"
                    alt="Ukiyo-e Pet Portrait"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Ukiyo-e Style</Text>
                  <Text style={galleryDescription}>Traditional Japanese woodblock print</Text>
                </Column>
              </Row>

              <Text style={galleryHeading}>✨ Modern & Whimsical</Text>
              <Row style={{ marginTop: '16px' }}>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/cat_ghibli.png"
                    width="260"
                    height="260"
                    alt="Studio Ghibli Pet Portrait"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Studio Ghibli Style</Text>
                  <Text style={galleryDescription}>Miyazaki-inspired magical realism</Text>
                </Column>
                <Column style={galleryColumn}>
                  <Img
                    src="https://pawcasso-atelier.vercel.app/gallery/dog_pop_art.png"
                    width="260"
                    height="260"
                    alt="Pop Art Pet Portrait"
                    style={galleryImage}
                  />
                  <Text style={galleryCaption}>Pop Art Style</Text>
                  <Text style={galleryDescription}>Andy Warhol-style bold colors</Text>
                </Column>
              </Row>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href="https://pawcasso-atelier.vercel.app/gallery">
                Explore All 34+ Artworks →
              </Button>
            </Section>

            {/* Style Picker CTA */}
            <Section style={styleBox}>
              <Text style={styleBoxHeading}>Choose from 16+ Art Styles:</Text>
              <Text style={styleList}>
                Renaissance • Baroque • Impressionist • Ukiyo-e • Art Nouveau • Art Deco • Cubist •
                Surrealist • Studio Ghibli • Pop Art • Watercolor • Oil Painting • Charcoal Sketch •
                Digital Neon • Retro Vintage • Medieval Tapestry
              </Text>
              <Section style={buttonContainer}>
                <Button style={buttonSecondary} href="https://pawcasso-atelier.vercel.app/pet-portrait-styles">
                  See All Styles →
                </Button>
              </Section>
            </Section>

            {/* Process */}
            <Section style={processSection}>
              <Text style={processSectionHeading}>How It Works:</Text>
              <div style={processStep}>
                <Text style={processNumber}>1</Text>
                <div>
                  <Text style={processTitle}>Upload Your Pet Photo</Text>
                  <Text style={processDescription}>Use the tips from our guide to get the perfect shot</Text>
                </div>
              </div>
              <div style={processStep}>
                <Text style={processNumber}>2</Text>
                <div>
                  <Text style={processTitle}>Choose Your Art Style</Text>
                  <Text style={processDescription}>Pick from 16+ styles or mix & match</Text>
                </div>
              </div>
              <div style={processStep}>
                <Text style={processNumber}>3</Text>
                <div>
                  <Text style={processTitle}>Get Your Portrait in 24 Hours</Text>
                  <Text style={processDescription}>4000×5000px high-resolution, print-ready file</Text>
                </div>
              </div>
            </Section>

            <Text style={text}>
              In 2 days, I'll share some amazing customer stories and testimonials. Stay tuned!
            </Text>

            <Text style={signature}>
              Creatively yours,<br />
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

export default LeadMagnetGalleryEmail;

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

const gallerySection = {
  margin: '32px 0',
};

const galleryHeading = {
  color: '#C9A96E',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 16px',
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
  color: '#F5F5F7',
  fontSize: '15px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '8px 0 4px',
};

const galleryDescription = {
  color: '#86868b',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
  fontStyle: 'italic',
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

const styleBox = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #C9A96E',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const styleBoxHeading = {
  color: '#F5F5F7',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const styleList = {
  color: '#86868b',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '0 0 16px',
};

const processSection = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const processSectionHeading = {
  color: '#F5F5F7',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const processStep = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '20px',
};

const processNumber = {
  backgroundColor: '#C9A96E',
  color: '#000000',
  fontSize: '18px',
  fontWeight: '700',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
  padding: '0',
  margin: '0',
};

const processTitle = {
  color: '#F5F5F7',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const processDescription = {
  color: '#86868b',
  fontSize: '14px',
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
