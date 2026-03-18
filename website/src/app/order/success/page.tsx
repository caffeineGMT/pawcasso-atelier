import { notFound } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import UpsellModal from "@/components/UpsellModal";
import SuccessPageTracker from "@/components/SuccessPageTracker";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    notFound();
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });

    if (!session) {
      notFound();
    }

    // Extract metadata and order details
    const customerEmail = session.customer_email || 'N/A';
    const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00';
    const petName = session.metadata?.petName || 'Your Pet';
    const style = session.metadata?.style || 'custom';
    const customerName = session.metadata?.customerName || 'Customer';
    const tier = session.metadata?.tier || 'basic';

    return (
      <section className="py-24 px-6">
        {/* Analytics Tracker */}
        <SuccessPageTracker amount={amountTotal} tier={tier} />

        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
              Order <span className="text-gradient">Confirmed!</span>
            </h1>

            <p className="text-text-secondary text-lg max-w-md mx-auto leading-relaxed">
              Thank you, {customerName}! Your portrait of {petName} is in production.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
            <h2 className="text-xs tracking-wider uppercase text-text-secondary mb-6 font-medium">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-text-primary font-medium">Digital Portrait — {style}</p>
                  <p className="text-sm text-text-secondary mt-1">Portrait of {petName}</p>
                </div>
                <p className="text-text-primary font-semibold">${amountTotal}</p>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Email</span>
                  <span className="text-text-primary">{customerEmail}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Session ID</span>
                  <span className="text-text-primary font-mono text-xs">{sessionId.slice(0, 20)}...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gold/5 border border-gold/20 rounded-2xl p-8 mb-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">What Happens Next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold text-sm flex items-center justify-center font-semibold mt-0.5">1</span>
                <p className="text-text-secondary">
                  <strong className="text-text-primary">Check your email</strong> — You&apos;ll receive a confirmation shortly.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold text-sm flex items-center justify-center font-semibold mt-0.5">2</span>
                <p className="text-text-secondary">
                  <strong className="text-text-primary">AI generation begins</strong> — Our system creates your custom portrait.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold text-sm flex items-center justify-center font-semibold mt-0.5">3</span>
                <p className="text-text-secondary">
                  <strong className="text-text-primary">Delivery within 24 hours</strong> — High-res digital file sent to {customerEmail}.
                </p>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-white/[0.06] border border-white/[0.08] text-text-primary font-medium rounded-full hover:bg-white/[0.10] hover:border-white/[0.16] transition-all"
            >
              Back to Gallery
            </a>
          </div>
        </div>

        {/* Upsell Modal */}
        <UpsellModal sessionId={sessionId} />
      </section>
    );
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    notFound();
  }
}
