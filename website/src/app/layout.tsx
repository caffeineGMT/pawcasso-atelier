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
  },
  twitter: {
    card: "summary_large_image",
    title: "Pawcasso Atelier | Bespoke Animal Portraits",
    description:
      "Where every pet becomes a masterpiece. Bespoke animal portraits crafted in the tradition of the Old Masters.",
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
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 pt-[73px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
