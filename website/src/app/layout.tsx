import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawcasso Atelier | AI-Powered Pet Portraits",
  description:
    "Transform your beloved pets into stunning artistic masterpieces. Renaissance, Baroque, Impressionist and more styles powered by AI.",
  keywords: ["pet portrait", "AI art", "animal painting", "custom pet art", "pet gift"],
  openGraph: {
    title: "Pawcasso Atelier | Where Art Meets Animal",
    description: "AI-powered artistic animal portraits. Turn your pet into a masterpiece.",
    type: "website",
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
