import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts, getFeaturedPosts } from "@/lib/blog-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Portrait Blog - AI Art Guides & Tips",
  description: "Expert guides on AI pet portraits, custom dog art, memorial gifts, and photo-to-painting transformation. Learn how to create stunning pet art for under $10.",
  keywords: ["ai pet portrait blog", "dog portrait tips", "pet memorial guides", "custom pet art"],
  openGraph: {
    title: "Pet Portrait Blog | Pawcasso Atelier",
    description: "Expert guides on AI pet portraits, custom dog art, and photo transformation",
    type: "website",
  },
};

export default function BlogPage() {
  const allPosts = getAllBlogPosts();
  const featuredPosts = getFeaturedPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            Pet Portrait <span className="text-gold">Insights</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Expert guides on AI pet portraits, custom dog art, memorial gifts, and transforming photos into paintings. Everything you need to know about creating stunning pet art.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-background-card border border-border rounded-lg overflow-hidden hover:border-gold/50 transition-all duration-300"
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={post.heroImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                      <span className="px-2 py-1 bg-gold/10 text-gold rounded">{post.category}</span>
                      <span>{post.readTime}</span>
                      <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">All Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {allPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-background-card border border-border rounded-lg overflow-hidden hover:border-gold/50 transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={post.heroImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
                    <span className="px-2 py-0.5 bg-gold/10 text-gold rounded text-[10px]">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Create Your Pet Portrait?</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Transform your pet's photo into stunning AI-generated art in 16+ styles. Professional quality, delivered in 24 hours for just $9.
          </p>
          <Link
            href="/order"
            className="inline-block px-8 py-3 bg-gold text-background font-medium rounded-full hover:bg-gold-light transition-colors"
          >
            Order Your Portrait - $9
          </Link>
        </div>
      </section>
    </div>
  );
}
