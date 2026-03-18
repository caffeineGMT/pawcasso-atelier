import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog-data";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // FAQ Schema for Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://pawcasso-atelier.vercel.app${post.heroImage}`,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pawcasso Atelier",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pawcasso-atelier.vercel.app/favicon.svg"
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate
  };

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author],
      images: [
        {
          url: post.heroImage,
          width: 2048,
          height: 2048,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.heroImage],
    },
    other: {
      "article:published_time": post.publishDate,
      "article:author": post.author,
      "article:section": post.category,
    },
    alternates: {
      canonical: `https://pawcasso-atelier.vercel.app/blog/${post.slug}`,
    },
    // Add structured data as JSON-LD
    ...(typeof window === 'undefined' && {
      __structuredData: [faqSchema, articleSchema],
    }),
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // FAQ Schema for Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://pawcasso-atelier.vercel.app${post.heroImage}`,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pawcasso Atelier",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pawcasso-atelier.vercel.app/favicon.svg"
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pawcasso-atelier.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://pawcasso-atelier.vercel.app/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://pawcasso-atelier.vercel.app/blog/${post.slug}`
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <nav className="pt-20 pb-6 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-text-primary">{post.category}</span>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <header className="pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-sm text-text-secondary mb-4">
              <span className="px-3 py-1 bg-gold/10 text-gold rounded">{post.category}</span>
              <span>{post.readTime}</span>
              <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              {post.description}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-text-secondary">By {post.author}</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden border border-border">
              <Image
                src={post.heroImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-semibold prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-text-secondary prose-p:leading-relaxed
                prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-text-primary prose-strong:font-semibold
                prose-ul:text-text-secondary prose-ol:text-text-secondary
                prose-li:my-1
                prose-table:border-collapse prose-table:w-full
                prose-th:bg-background-elevated prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-border
                prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-border
                prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:pl-4 prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />
          </div>
        </div>

        {/* FAQ Section */}
        {post.faqs.length > 0 && (
          <section className="pb-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faqs.map((faq, index) => (
                  <div key={index} className="bg-background-card border border-border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 text-text-primary">
                      {faq.question}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-24 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-semibold mb-4">Create Your AI Pet Portrait</h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Transform your pet's photo into stunning artwork in 24 hours. Choose from 16+ professional art styles for just $9.
            </p>
            <Link
              href="/order"
              className="inline-block px-8 py-3 bg-gold text-background font-medium rounded-full hover:bg-gold-light transition-colors"
            >
              Order Now - $9
            </Link>
          </div>
        </section>

        {/* Related Posts */}
        <section className="pb-24 px-6 border-t border-border pt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8">Continue Reading</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {getAllBlogPosts()
                .filter(p => p.slug !== post.slug)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block bg-background-card border border-border rounded-lg overflow-hidden hover:border-gold/50 transition-all"
                  >
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <Image
                        src={relatedPost.heroImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
                        <span className="px-2 py-0.5 bg-gold/10 text-gold rounded text-[10px]">{relatedPost.category}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-gold transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
