import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawcasso Atelier | Bespoke Animal Portraits",
  description:
    "Bespoke animal portraits crafted in the tradition of the Old Masters. Renaissance, Baroque, Impressionist, Ghibli, and more. Commission your masterpiece today.",
  keywords: ["pet portrait", "animal painting", "custom pet art", "pet gift", "bespoke portrait", "pet commission"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Pawcasso Atelier | Bespoke Animal Portraits",
    description:
      "Where every pet becomes a masterpiece. Bespoke animal portraits crafted in the tradition of the Old Masters.",
    type: "website",
    siteName: "Pawcasso Atelier",
    locale: "en_US",
    images: [
      {
        url: "https://pawcasso-atelier.vercel.app/gallery/lion_portrait.png",
        width: 2048,
        height: 2048,
        alt: "Pawcasso Atelier - Sovereign Light",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pawcasso Atelier | Bespoke Animal Portraits",
    description:
      "Where every pet becomes a masterpiece. Bespoke animal portraits crafted in the tradition of the Old Masters.",
    images: ["https://pawcasso-atelier.vercel.app/gallery/lion_portrait.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Pawcasso Atelier",
  description: "Bespoke animal portraits crafted in the tradition of the Old Masters. 16 curated art styles.",
  url: "https://pawcasso-atelier.vercel.app",
  image: "https://pawcasso-atelier.vercel.app/gallery/lion_portrait.png",
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
    name: "Digital Pet Portrait",
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
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 pt-[73px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
