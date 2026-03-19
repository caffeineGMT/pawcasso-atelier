import { TIER_CONFIG, type TierId, type TierConfig } from '@/lib/stripe';
import { type TierBadgeConfig } from '@/types/order';

/**
 * Props for TierSelector component
 */
export interface TierSelectorProps {
  /** Currently selected tier */
  selectedTier: TierId;
  /** Callback when tier is selected */
  onSelectTier: (tierId: TierId) => void;
  /** Badge configuration for A/B testing */
  tierBadges: TierBadgeConfig;
  /** Function to get original price for strikethrough */
  getOriginalPrice: (tierId: TierId) => number;
  /** Optional tier configuration override */
  tiers?: TierConfig[];
}

/**
 * Tier selector component displaying pricing packages
 *
 * Shows pricing cards with badges, features, and selection state
 */
export default function TierSelector({
  selectedTier,
  onSelectTier,
  tierBadges,
  getOriginalPrice,
  tiers = TIER_CONFIG,
}: TierSelectorProps) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-text-secondary mb-4 font-medium text-center">
        Choose Your Package
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiers.map((tier) => {
          const badge = tierBadges[tier.id];
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelectTier(tier.id)}
              className={`relative text-left p-4 sm:p-6 rounded-2xl border transition-all flex flex-col min-h-[48px] touch-manipulation ${
                selectedTier === tier.id
                  ? "border-gold bg-gold/10 ring-2 ring-gold/40 shadow-lg shadow-gold/20"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.06]"
              }`}
              aria-pressed={selectedTier === tier.id}
              aria-label={`${tier.name} package: ${tier.priceDisplay}, ${
                badge || ''
              } ${selectedTier === tier.id ? 'selected' : ''}`}
            >
              {badge && (
                <div
                  className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    badge === 'Most Popular'
                      ? 'bg-purple-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {badge}
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-text-primary">{tier.name}</h3>
                <div className="text-left sm:text-right">
                  <div className="line-through text-gray-400 text-xs sm:text-sm">${getOriginalPrice(tier.id)}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-text-primary">{tier.priceDisplay}</div>
                </div>
              </div>
              <ul className="space-y-2 flex-1 mb-4">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-text-secondary">
                    <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {tier.promo && (
                <div className="mt-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
                  <p className="text-purple-200 text-xs font-medium text-center">{tier.promo}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
