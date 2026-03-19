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

export interface ReviewInput {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished?: string;
}

/**
 * Generate Review schema for customer testimonials
 * @see https://developers.google.com/search/docs/appearance/structured-data/review-snippet
 */
export function generateReviewSchema(reviews: ReviewInput[], productName: string = "Custom Pet Portrait") {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished || new Date().toISOString().split('T')[0],
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

/**
 * Generate HowTo schema for step-by-step guides
 * @see https://developers.google.com/search/docs/appearance/structured-data/how-to
 */
export function generateHowToSchema(input: {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration (e.g., "PT10M" for 10 minutes)
  steps: HowToStep[];
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    image: input.image ? {
      "@type": "ImageObject",
      url: input.image,
    } : undefined,
    totalTime: input.totalTime,
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image ? {
        "@type": "ImageObject",
        url: step.image,
      } : undefined,
    })),
  };
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}

/**
 * Generate Article schema for blog posts
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
export function generateArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    image: input.image,
    author: {
      "@type": "Person",
      name: input.author || "Pawcasso Atelier",
    },
    publisher: {
      "@type": "Organization",
      name: "Pawcasso Atelier",
      logo: {
        "@type": "ImageObject",
        url: "https://pawcasso-atelier.vercel.app/pawcasso_profile.png",
      },
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
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
