import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Cards",
  description: "Give the gift of beautiful AI-generated pet portraits. Perfect for pet lovers, available in $25, $50, $100, or custom amounts.",
  openGraph: {
    title: "Pawcasso Gift Cards - The Perfect Gift for Pet Lovers",
    description: "Delight pet lovers with a beautiful AI-generated portrait gift card. Choose from $25, $50, $100 or custom amounts. Digital delivery, 1-year validity.",
    images: ["/gift-card-preview.svg"],
  },
};

export default function GiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
