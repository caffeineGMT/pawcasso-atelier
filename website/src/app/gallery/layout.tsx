import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Pawcasso Atelier",
  description: "Browse our collection of bespoke animal portraits across 18 art styles — Renaissance, Ghibli, Pixar 3D, Cyberpunk, and more.",
  openGraph: {
    title: "Gallery | Pawcasso Atelier",
    description: "Browse our collection of bespoke animal portraits across 18 art styles.",
    images: ["https://pawcasso-atelier.vercel.app/gallery/golden_retriever_ghibli.png"],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
