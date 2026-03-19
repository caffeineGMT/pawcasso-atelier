import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import SessionProvider from "@/components/SessionProvider";
import PromotionBanner from "@/components/PromotionBanner";
import WebVitals from "@/components/WebVitals";
import BrowserCompat from "@/components/BrowserCompat";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ToastProvider";
import { NetworkStatus } from "@/components/NetworkStatus";
import { FunnelTracker } from "@/components/FunnelTracker";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "./globals.css";
import "./mobile-enhancements.css";
import "./toast.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    template: "%s | Pawcasso Atelier",
    default: "Pawcasso Atelier - Custom AI Pet Portraits",
  },
  description:
    "Transform your pet into stunning AI-generated art. Custom portraits for $9. Renaissance, Baroque, Impressionist, Ghibli, and 12+ other art styles.",
  keywords: ["pet portrait", "animal painting", "custom pet art", "pet gift", "AI pet portrait", "pet commission", "custom dog portrait", "custom cat portrait", "affordable pet portrait"],
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://pawcasso-atelier.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pawcasso-atelier.vercel.app",
    siteName: "Pawcasso Atelier",
    title: "Pawcasso Atelier - Custom AI Pet Portraits",
    description:
      "Transform your pet into stunning AI-generated art for $9. Choose from 16+ art styles including Renaissance, Baroque, Impressionist, Ghibli, Pixar 3D, and Needle Felt.",
    images: [
      {
        url: "/gallery/cat_vermeer.webp",
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
      "Transform your pet into stunning AI-generated art for $9. 16+ artistic styles, 24-hour delivery.",
    images: ["/gallery/cat_vermeer.webp"],
  },
  other: {
    // Pinterest Rich Pin metadata
    "pinterest-rich-pin": "true",
    "og:type": "product",
    "og:price:amount": "9.00",
    "og:price:currency": "USD",
    "og:availability": "instock",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Pawcasso Atelier",
  description: "Custom AI-generated pet portraits in 16+ curated art styles. Transform your pet into stunning art for $9.",
  url: "https://pawcasso-atelier.vercel.app",
  image: "https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.webp",
  priceRange: "$9",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  sameAs: [
    "https://instagram.com/pawcasso.atelier",
    "https://tiktok.com/@pawcasso.atelier",
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
    <html lang="en" className={inter.variable}>
      <head>
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://s.pinimg.com" />

        {/* PWA & Mobile Optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pawcasso" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics 4 - Deferred for better FID */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Meta Pixel - Deferred for better FID */}
        <Script id="meta-pixel" strategy="lazyOnload">
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
            alt="Meta Pixel tracking"
          />
        </noscript>

        {/* Pinterest Tag - Deferred for better FID */}
        <Script id="pinterest-tag" strategy="lazyOnload">
          {`
            !function(e){if(!window.pintrk){window.pintrk = function () {
            window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
              n=window.pintrk;n.queue=[],n.version="3.0";var
              t=document.createElement("script");t.async=!0,t.src=e;var
              r=document.getElementsByTagName("script")[0];
              r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
            pintrk('load', '${process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || ""}', {em: '<user_email_address>'});
            pintrk('page');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt="Pinterest tracking"
            src={`https://ct.pinterest.com/v3/?event=init&tid=${process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || ""}&noscript=1`}
          />
        </noscript>

        {/* Pinterest Domain Verification */}
        <meta name="p:domain_verify" content="PINTEREST_VERIFICATION_CODE_HERE" />

        {/* Google Ads Conversion Tracking - Deferred for better FID */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-ads-config" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID}');
          `}
        </Script>

        {/* Microsoft Clarity - Heatmaps, Session Recordings, Funnel Analysis */}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}
      </head>
      <body className={`min-h-screen flex flex-col antialiased ${inter.className}`}>
        <ServiceWorkerRegistration />
        <WebVitals />
        <BrowserCompat />
        <ErrorBoundary>
          <SessionProvider>
            <FunnelTracker />
            <NetworkStatus />
            <ToastProvider />
            <PromotionBanner />
            <Header />
            <main className="flex-1 pt-[73px]">{children}</main>
            <Footer />
            <EmailCaptureModal />
          </SessionProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
