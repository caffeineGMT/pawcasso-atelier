import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Pawcasso Atelier",
    default: "Pawcasso Atelier - Custom AI Pet Portraits",
  },
  description:
    "Transform your pet into stunning AI-generated art. Custom portraits for $9. Renaissance, Baroque, Impressionist, Ghibli, and 12+ other art styles.",
  keywords: ["pet portrait", "animal painting", "custom pet art", "pet gift", "AI pet portrait", "pet commission"],
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://pawcasso-atelier.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pawcasso-atelier.vercel.app",
    siteName: "Pawcasso Atelier",
    title: "Pawcasso Atelier - Custom AI Pet Portraits",
    description:
      "Transform your pet into stunning AI-generated art for $9. Choose from 16+ art styles.",
    images: [
      {
        url: "/gallery/cat_vermeer.png",
        width: 2048,
        height: 2048,
        alt: "Cat with a Pearl Earring - Renaissance pet portrait by Pawcasso Atelier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pawcasso Atelier - Custom AI Pet Portraits",
    description:
      "Transform your pet into stunning AI-generated art for $9",
    images: ["/gallery/cat_vermeer.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Pawcasso Atelier",
  description: "Custom AI-generated pet portraits in 16+ curated art styles. Transform your pet into stunning art for $9.",
  url: "https://pawcasso-atelier.vercel.app",
  image: "https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png",
  priceRange: "$9",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  sameAs: [
    "https://instagram.com/pawcasso.atelier",
  ],
  offers: {
    "@type": "Offer",
    name: "Custom AI Pet Portrait",
    price: "9.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 pt-[73px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
