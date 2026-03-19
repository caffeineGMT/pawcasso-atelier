import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

interface ReferralPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: ReferralPageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Get 20% Off Your First AI Pet Portrait | Pawcasso Atelier`,
    description: `Your friend invited you to Pawcasso Atelier! Use referral code ${code} for 20% off your first custom AI pet portrait. Starting at just $7.20.`,
    openGraph: {
      title: "Get 20% Off Your First AI Pet Portrait",
      description: "Your friend invited you! Get 20% off a stunning custom AI portrait of your pet. 16+ art styles, instant delivery.",
      images: [{ url: "/gallery/cat_vermeer.webp", width: 2048, height: 2048, alt: "Pawcasso Atelier - AI Pet Portraits" }],
    },
  };
}

export default async function ReferralLandingPage({ params }: ReferralPageProps) {
  const { code } = await params;

  // Validate referral code
  const referrer = await prisma.customer.findUnique({
    where: { referralCode: code },
  });

  if (!referrer) {
    redirect("/order");
  }

  // Track the click
  await prisma.referral.create({
    data: {
      referrerEmail: referrer.email,
      referredEmail: "pending@click.track",
      referralCode: code,
      clickedAt: new Date(),
      status: "clicked",
    },
  }).catch(() => {
    // Ignore duplicate tracking errors
  });

  const referrerFirstName = referrer.name?.split(" ")[0] || "Your friend";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(224,122,95,0.15),_transparent)]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Referral Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E07A5F]/10 border border-[#E07A5F]/20 rounded-full px-5 py-2 mb-8">
            <svg className="w-4 h-4 text-[#E07A5F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-[#E07A5F] text-sm font-medium">
              {referrerFirstName} invited you
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[0.95] mb-6 text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Get <span className="text-[#E07A5F]">20% Off</span> Your First
            <br />AI Pet Portrait
          </h1>

          <p className="text-[#86868b] text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
            Transform your pet into stunning museum-quality art in 60 seconds.
            Your friend already has one - now it&apos;s your turn.
          </p>

          {/* Price Display */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="text-center">
              <span className="text-[#86868b] line-through text-lg">$9.00</span>
            </div>
            <div className="text-center">
              <span className="text-[#E07A5F] text-4xl font-bold">$7.20</span>
              <span className="text-[#86868b] text-sm block">with your referral discount</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/order?ref=${code}`}
            className="inline-flex items-center gap-2 bg-[#E07A5F] hover:bg-[#D06A4F] text-white px-10 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg shadow-[#E07A5F]/25"
          >
            Create My Portrait - 20% Off
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="text-[#86868b] text-xs mt-4">
            Referral code <strong className="text-white">{code}</strong> auto-applied at checkout
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2
          className="text-3xl font-semibold text-white text-center mb-12"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E07A5F]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#E07A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">1. Upload a Photo</h3>
            <p className="text-[#86868b] text-sm">
              Upload any clear photo of your pet. Works with dogs, cats, and more.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E07A5F]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#E07A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">2. Choose a Style</h3>
            <p className="text-[#86868b] text-sm">
              Pick from 16+ art styles: Renaissance, Ghibli, Pixar 3D, Pop Art, and more.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E07A5F]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#E07A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">3. Download Instantly</h3>
            <p className="text-[#86868b] text-sm">
              Get your high-resolution portrait in 60 seconds. Ready to print or share.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-8 text-center">
          <div className="grid grid-cols-3 gap-8 mb-6">
            <div>
              <div className="text-3xl font-bold text-[#E07A5F]">10,000+</div>
              <div className="text-[#86868b] text-sm">Portraits Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#E07A5F]">4.9/5</div>
              <div className="text-[#86868b] text-sm">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#E07A5F]">16+</div>
              <div className="text-[#86868b] text-sm">Art Styles</div>
            </div>
          </div>
          <p className="text-[#86868b] text-sm italic">
            &quot;I was blown away by how accurate the portrait was. My golden retriever looks like a Renaissance king!&quot;
            <br />
            <span className="text-white font-medium">- Sarah M., verified customer</span>
          </p>
        </div>
      </section>

      {/* Referral Benefit */}
      <section className="max-w-4xl mx-auto px-6 py-12 pb-20">
        <div className="bg-gradient-to-br from-[#E07A5F]/10 to-[#F4A261]/10 border border-[#E07A5F]/20 rounded-2xl p-8 text-center">
          <h3
            className="text-2xl font-semibold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            You Both Win
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto mb-8">
            <div className="bg-[#0a0a0a] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#06D6A0] mb-1">20% Off</div>
              <div className="text-[#86868b] text-sm">Your first portrait</div>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#06D6A0] mb-1">$5 Credit</div>
              <div className="text-[#86868b] text-sm">For {referrerFirstName}</div>
            </div>
          </div>
          <Link
            href={`/order?ref=${code}`}
            className="inline-flex items-center gap-2 bg-[#E07A5F] hover:bg-[#D06A4F] text-white px-8 py-3.5 rounded-full font-semibold transition-colors"
          >
            Claim Your 20% Discount
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
