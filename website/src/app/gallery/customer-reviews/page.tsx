import { Metadata } from "next";
import CustomerReviewsContent from "./CustomerReviewsContent";

export const metadata: Metadata = {
  title: "Customer Reviews & Stories | Pawcasso Atelier",
  description: "Real pet portraits and 5-star reviews from happy customers. See how we've transformed beloved pets into stunning artwork.",
  openGraph: {
    title: "Customer Reviews & Stories | Pawcasso Atelier",
    description: "Real pet portraits and 5-star reviews from happy customers. See how we've transformed beloved pets into stunning artwork.",
    images: ["/gallery/cat_vermeer.webp"],
  },
};

export default function CustomerReviewsPage() {
  return <CustomerReviewsContent />;
}
