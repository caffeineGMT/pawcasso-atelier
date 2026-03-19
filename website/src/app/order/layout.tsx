import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Custom Portrait",
  description:
    "Order your custom AI pet portrait for $9. Upload a photo, choose from 17 art styles, and receive your masterpiece within 24 hours.",
  openGraph: {
    title: "Order Custom Portrait | Pawcasso Atelier",
    description:
      "Order your custom AI pet portrait for $9. Choose from 17 art styles including Renaissance, Baroque, Ghibli, and more.",
    type: "website",
    images: [
      {
        url: "/gallery/cat_vermeer.webp",
        width: 2048,
        height: 2048,
        alt: "Example pet portrait - Cat with a Pearl Earring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Custom Portrait | Pawcasso Atelier",
    description:
      "Order your custom AI pet portrait for $9. Choose from 17 art styles.",
    images: ["/gallery/cat_vermeer.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom AI Pet Portrait",
  description: "Personalized AI-generated pet portrait in your choice of 17 artistic styles",
  image: "https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.webp",
  brand: {
    "@type": "Brand",
    name: "Pawcasso Atelier",
  },
  offers: {
    "@type": "Offer",
    price: "9.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://pawcasso-atelier.vercel.app/order",
  },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
