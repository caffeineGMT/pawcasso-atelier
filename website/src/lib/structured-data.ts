/**
 * Structured Data (JSON-LD) Helper for SEO
 * Generates schema.org markup for rich search results
 */

export interface ProductSchemaInput {
  name: string;
  price: number;
  priceCurrency?: string;
  image: string;
  description: string;
  availability?: string;
  brand?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Generate Product schema (JSON-LD) for Google Rich Results
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */
export function generateProductSchema(input: ProductSchemaInput) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    image: input.image,
    description: input.description,
    brand: {
      "@type": "Brand",
      name: input.brand || "Pawcasso Atelier",
    },
    offers: {
      "@type": "Offer",
      price: input.price.toString(),
      priceCurrency: input.priceCurrency || "USD",
      availability: input.availability || "https://schema.org/InStock",
      url: "https://pawcasso-atelier.vercel.app/order",
    },
  };

  // Only include aggregateRating if provided
  if (input.aggregateRating) {
    (schema as any).aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.aggregateRating.ratingValue,
      reviewCount: input.aggregateRating.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate LocalBusiness schema for the company
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://pawcasso-atelier.vercel.app",
    name: "Pawcasso Atelier",
    description:
      "AI-powered custom pet portraits in 17 artistic styles. Professional quality, affordable pricing, 24-hour delivery.",
    url: "https://pawcasso-atelier.vercel.app",
    logo: "https://pawcasso-atelier.vercel.app/pawcasso_profile.png",
    image: "https://pawcasso-atelier.vercel.app/pawcasso_profile.png",
    priceRange: "$9-$79",
    telephone: "",
    email: "hello@pawcassoatelier.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    sameAs: [
      "https://www.instagram.com/pawcasso.atelier",
    ],
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQPage schema for FAQ content
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Render JSON-LD script tag (for use in Next.js components)
 */
export function renderStructuredData(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}
