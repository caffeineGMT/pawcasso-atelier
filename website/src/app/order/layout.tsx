import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order a Portrait | Pawcasso Atelier",
  description: "Commission a bespoke pet portrait for just $9. Choose from 18 art styles. High-resolution digital delivery within 24 hours.",
  openGraph: {
    title: "Order a Portrait | Pawcasso Atelier — $9",
    description: "Commission a bespoke pet portrait. Choose from 18 art styles. Delivered in 24 hours.",
    images: ["https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png"],
  },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
