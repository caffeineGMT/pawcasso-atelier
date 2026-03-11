import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Pawcasso Atelier",
  description:
    "Frequently asked questions about Pawcasso Atelier — our process, pricing, delivery, and more.",
};

const faqs = [
  {
    category: "The Process",
    items: [
      {
        q: "How does it work?",
        a: "Upload your favorite photo of your pet, choose from one of our 16 curated artistic styles, and we handle the rest. Your pet\u2019s unique features are studied and interpreted through the lens of your chosen tradition. The finished portrait is delivered directly to your inbox as a high-resolution digital file.",
      },
      {
        q: "What kind of photo should I upload?",
        a: "Clear, well-lit photos where your pet\u2019s face and features are visible. Natural light works best. Close-ups and three-quarter views produce the most striking results, though full-body photos work beautifully for certain styles like Ukiyo-e and Art Nouveau.",
      },
      {
        q: "Can you work with photos of pets who have passed away?",
        a: "Absolutely. Many of our most meaningful commissions are memorial portraits. We treat every one with the reverence it deserves. If you have multiple photos, include them \u2014 it helps capture their spirit more faithfully.",
      },
      {
        q: "Can I commission a portrait of multiple pets?",
        a: "Yes. Multi-pet portraits are one of our specialties. Upload a photo of each pet and note in your order that you\u2019d like them composed together. Multi-pet portraits are priced per pet.",
      },
    ],
  },
  {
    category: "Styles & Customization",
    items: [
      {
        q: "What art styles do you offer?",
        a: "We offer 16 styles: Renaissance, Baroque, Impressionist, Art Nouveau, Ukiyo-e, Pop Art, Ghibli, Watercolor, Cyberpunk Neon, Pixel Art, Surrealist, Dark Fantasy, Minimalist Line Art, Hyperrealism, Pixar 3D Chunky, and Needle Felt. Each has been refined for consistently stunning results.",
      },
      {
        q: "Can you match a specific art style or reference?",
        a: "Our styles cover a wide range of artistic traditions. If you have a specific reference painting or aesthetic in mind, include it with your order notes and we\u2019ll do our best to honor the vision.",
      },
      {
        q: "Can I request revisions?",
        a: "If your portrait doesn\u2019t feel quite right, reach out within 14 days and we\u2019ll revise it. We want every portrait to feel like it truly belongs to you and your pet.",
      },
    ],
  },
  {
    category: "Delivery & Files",
    items: [
      {
        q: "How long does delivery take?",
        a: "Most portraits are completed within 24 hours. During peak seasons, delivery may take up to 48 hours. You\u2019ll receive an email as soon as your portrait is ready.",
      },
      {
        q: "What file do I receive?",
        a: "A high-resolution PNG at 4000\u00D75000 pixels \u2014 large enough for prints up to 13\u00D717 inches at 300 DPI. Perfect for digital use or professional printing at any print shop.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        q: "How much does a portrait cost?",
        a: "$9 per portrait. High-resolution digital file, delivered within 24 hours. No hidden fees, no subscriptions.",
      },
      {
        q: "Can I request revisions?",
        a: "If your portrait doesn\u2019t feel quite right, reach out within 14 days and we\u2019ll revise it \u2014 up to 3 revisions included. We want every portrait to feel perfect.",
      },
    ],
  },
  {
    category: "General",
    items: [
      {
        q: "What animals can you create portraits of?",
        a: "Any animal. Dogs, cats, birds, rabbits, horses, reptiles, fish \u2014 we\u2019ve portrayed them all. Exotic pets are some of our favorite commissions.",
      },
      {
        q: "How do I contact you?",
        a: "DM us on Instagram at @pawcasso.atelier or email hello@pawcasso.art. We typically respond within a few hours.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Everything you need to know.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-16">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-semibold tracking-tight text-text-primary mb-6">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((faq) => (
                  <div
                    key={faq.q}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
                  >
                    <h3 className="text-text-primary text-[15px] font-medium mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <div className="section-divider mb-16" />
          <h3 className="text-3xl font-semibold tracking-tight mb-4">
            Still have <span className="text-gradient">questions</span>?
          </h3>
          <p className="text-text-secondary text-sm mb-8">
            Reach out anytime. We&apos;re happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order"
              className="px-8 py-3 bg-white text-black font-medium tracking-wide text-sm rounded-full hover:bg-white/90 transition-all"
            >
              Commission a Portrait
            </Link>
            <a
              href="mailto:hello@pawcasso.art"
              className="px-8 py-3 bg-white/[0.06] border border-white/[0.08] text-text-primary text-sm tracking-wide rounded-full hover:bg-white/[0.1] transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
