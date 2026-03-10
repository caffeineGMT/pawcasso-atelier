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
        a: "Commissioning a portrait is simple. Upload your favorite photo of your pet, choose from one of our eight curated artistic styles, and our atelier handles the rest. Our artists study your pet\u2019s unique features \u2014 their expression, posture, the way light catches their fur or feathers \u2014 and interpret them through the lens of your chosen tradition. The finished portrait is delivered directly to your inbox as a high-resolution digital file.",
      },
      {
        q: "What kind of photo should I upload?",
        a: "The best portraits come from clear, well-lit photos where your pet\u2019s face and features are visible. Natural light works best. Avoid heavy filters or photos where your pet is mostly in shadow. Close-ups and three-quarter views tend to produce the most striking results, though full-body photos work beautifully for certain styles like Ukiyo-e and Art Nouveau.",
      },
      {
        q: "Can you work with photos of pets who have passed away?",
        a: "Absolutely. Many of our most meaningful commissions are memorial portraits. We treat every one of these with the reverence it deserves. If you have multiple photos of your pet, feel free to include them \u2014 it helps our artists capture their spirit more faithfully.",
      },
      {
        q: "Can I commission a portrait of multiple pets together?",
        a: "Yes. Multi-pet portraits are one of our specialties. Simply upload a photo of each pet and let us know in your order notes that you\u2019d like them composed together. Multi-pet portraits are priced per pet.",
      },
    ],
  },
  {
    category: "Styles & Customization",
    items: [
      {
        q: "What art styles do you offer?",
        a: "We offer eight carefully curated styles: Renaissance, Baroque, Impressionist, Art Nouveau, Ukiyo-e, Pop Art, Ghibli-inspired, and Royal Portrait. Each style has been refined over hundreds of commissions to produce consistently stunning results.",
      },
      {
        q: "Can you match a specific art style or reference?",
        a: "Our eight curated styles cover a wide range of artistic traditions, and each has been optimized for the best possible results. If you have a specific reference painting or aesthetic in mind, include it with your order notes and we\u2019ll do our best to honor the vision within the framework of our available styles.",
      },
      {
        q: "Can I request changes or revisions?",
        a: "Your satisfaction matters more to us than anything else. If your portrait doesn\u2019t feel quite right, reach out within 14 days and we\u2019ll work with you to revise it. We want every portrait to feel like it truly belongs to you and your pet.",
      },
    ],
  },
  {
    category: "Delivery & Files",
    items: [
      {
        q: "How long does it take to receive my portrait?",
        a: "Most portraits are completed and delivered within 24\u201348 hours of your order. During peak seasons \u2014 holidays, for instance \u2014 delivery may take up to 72 hours. You\u2019ll receive an email notification as soon as your portrait is ready for download.",
      },
      {
        q: "What file formats do I receive?",
        a: "Every portrait is delivered as a high-resolution PNG file at 4000\u00D75000 pixels \u2014 large enough for prints up to 13\u00D717 inches at 300 DPI. Our Print-Ready tier includes an additional color-calibrated file specifically optimized for professional printing.",
      },
      {
        q: "Can I get a physical print?",
        a: "We specialize in digital delivery, which gives you complete control over the size, medium, and framing of your portrait. Our Print-Ready tier files are professionally color-calibrated and produce gallery-quality results at any reputable print shop. They look stunning on canvas, metal, acrylic, fine art paper, and more. We recommend services like Shutterfly, Nations Photo Lab, or your local fine art printer.",
      },
      {
        q: "What resolution are the files?",
        a: "All portraits are delivered at 4000\u00D75000 pixels. Print-Ready files are calibrated at 300 DPI, which is the professional standard for high-quality printing. This resolution supports prints up to 13\u00D717 inches with no loss of detail.",
      },
    ],
  },
  {
    category: "Pricing & Refunds",
    items: [
      {
        q: "How much does a portrait cost?",
        a: "We offer two tiers. Our Digital tier is $29 and includes a high-resolution 4000\u00D75000px PNG file. Our Print-Ready tier is $79 and includes a color-calibrated, 300 DPI file optimized for professional printing. No hidden fees, no subscriptions.",
      },
      {
        q: "Do you offer refunds?",
        a: "Yes. If you\u2019re not completely delighted with your portrait, contact us within 14 days of delivery. We\u2019ll either revise the piece to your satisfaction or issue a full refund \u2014 no questions asked. Your happiness is our priority.",
      },
      {
        q: "Do you offer gift cards or gift orders?",
        a: "Not yet, but it\u2019s something we\u2019re working on. In the meantime, many of our customers simply place an order on behalf of someone else and have the download link forwarded. It makes for a truly unforgettable gift.",
      },
    ],
  },
  {
    category: "General",
    items: [
      {
        q: "What animals can you create portraits of?",
        a: "Any animal at all. Dogs, cats, birds, rabbits, horses, reptiles, fish \u2014 we\u2019ve portrayed them all. If it has a face (or a particularly expressive shell), we can turn it into art. Exotic pets are some of our favorite commissions.",
      },
      {
        q: "How do I contact you?",
        a: "You can reach us anytime at hello@pawcasso.art or through our Instagram at @pawcasso.atelier. We typically respond within a few hours during business days.",
      },
      {
        q: "Is this a subscription service?",
        a: "No. Every order is a one-time purchase. You pay once, you receive your portrait, and it\u2019s yours forever. No recurring charges, no hidden fees.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
            Frequently Asked <span className="text-gold">Questions</span>
          </h1>
          <p className="text-text-secondary text-lg font-light">
            Everything you need to know about commissioning your portrait.
          </p>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-16">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-light tracking-wide text-gold mb-8">
                {section.category}
              </h2>
              <div className="space-y-6">
                {section.items.map((faq) => (
                  <div
                    key={faq.q}
                    className="border border-border p-6 hover:border-gold/30 transition-colors"
                  >
                    <h3 className="text-text-primary text-sm font-medium tracking-wide mb-3">
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
        <div className="text-center mt-20 pt-12 border-t border-border">
          <h3 className="text-2xl font-light tracking-wide mb-3">
            Still have <span className="text-gold">questions</span>?
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            Reach out anytime. We&apos;re happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order"
              className="px-8 py-3 bg-gold text-bg font-medium tracking-wider text-sm hover:bg-gold-light transition-colors"
            >
              Commission a Portrait
            </Link>
            <a
              href="mailto:hello@pawcasso.art"
              className="px-8 py-3 border border-gold/40 text-gold text-sm tracking-wider hover:bg-gold/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
