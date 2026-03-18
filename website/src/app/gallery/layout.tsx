import type { Metadata } from "next";
import { artworks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our collection of AI-generated pet portraits. 14 curated pieces featuring Renaissance, Pixar 3D, Needle Felt, and more artistic styles.",
  openGraph: {
    title: "Gallery | Pawcasso Atelier",
    description:
      "Browse our collection of AI-generated pet portraits in multiple artistic styles.",
    type: "website",
    images: artworks.slice(0, 6).map((artwork) => ({
      url: artwork.imageUrl,
      width: artwork.width,
      height: artwork.height,
      alt: artwork.title,
    })),
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Pawcasso Atelier",
    description:
      "Browse our collection of AI-generated pet portraits in multiple artistic styles.",
    images: [artworks[0].imageUrl],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
