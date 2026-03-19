'use client';

import { useState } from 'react';

export const PricingComparison = () => {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const TIERS = [
    { name: 'Basic', price: 9, originalPrice: 15, popular: false },
    { name: 'Premium', price: 29, originalPrice: 49, popular: true },
    { name: 'Deluxe', price: 49, originalPrice: 89, popular: false }, // Price anchoring: $89 → $49 Launch Special
    { name: 'Bundle', price: 79, originalPrice: 132, popular: false },
  ];

  const FEATURES = [
    {
      label: 'Number of portraits',
      values: ['1', '1 + 2 variations', '3', '5'],
      tooltip: 'Get multiple artistic variations to choose from'
    },
    {
      label: 'Delivery time',
      values: ['24hr', '12hr', '6hr', 'Instant'],
      tooltip: 'Faster delivery means you get your portrait sooner'
    },
    {
      label: 'Resolution',
      values: ['Standard', 'High-res', 'Ultra HD', 'Ultra HD'],
      tooltip: 'Higher resolution allows for larger prints'
    },
    {
      label: 'File formats',
      values: ['JPG', 'JPG, PNG', 'JPG, PNG, TIFF', 'All formats'],
      tooltip: 'More formats give you flexibility for different uses'
    },
    {
      label: 'Revisions included',
      values: ['1', '2', '3', 'Unlimited'],
      tooltip: 'Free revisions to ensure you love your portrait'
    },
    {
      label: 'Commercial use',
      values: ['✗', '✗', '✗', '✓'],
      tooltip: 'Use your portrait for business purposes'
    },
    {
      label: 'Print-ready files',
      values: ['✗', '✗', '✓', '✓'],
      tooltip: 'Perfect for printing up to 24x36 inches'
    },
  ];

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[640px] border-collapse">
        <thead className="sticky top-0 z-10 bg-bg">
          <tr>
            <th className="text-left p-4 text-xs tracking-wider uppercase text-text-secondary font-medium border-b border-white/[0.08]">
              Features
            </th>
            {TIERS.map((tier) => (
              <th
                key={tier.name}
                className={`relative p-4 text-center border-b ${
                  tier.popular
                    ? 'border-2 border-purple-500 bg-purple-500/5 animate-pulse-border'
                    : 'border-white/[0.08]'
                }`}
                style={tier.popular ? {
                  animation: 'pulse-border 3s ease-in-out infinite'
                } : undefined}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="text-lg font-semibold text-text-primary mt-2">{tier.name}</div>
                <div className="mt-2">
                  <div className="line-through text-gray-400 text-sm">${tier.originalPrice}</div>
                  <span className="text-2xl font-bold text-gradient">${tier.price}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((feature, idx) => (
            <tr key={feature.label} className={idx % 2 === 0 ? 'bg-white/[0.02]' : ''}>
              <td className="p-4 text-sm text-text-secondary border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span>{feature.label}</span>
                  <div
                    className="relative inline-block"
                    onMouseEnter={() => setHoveredTooltip(feature.label)}
                    onMouseLeave={() => setHoveredTooltip(null)}
                  >
                    <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {hoveredTooltip === feature.label && (
                      <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-black/90 text-white text-xs rounded-lg shadow-lg z-20">
                        {feature.tooltip}
                        <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/90"></div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              {feature.values.map((value, colIdx) => (
                <td
                  key={colIdx}
                  className={`p-4 text-center text-sm border-b ${
                    TIERS[colIdx].popular
                      ? 'border-2 border-l-2 border-r-2 border-purple-500 bg-purple-500/5'
                      : 'border-white/[0.06]'
                  } ${
                    value === '✓'
                      ? 'text-green-600 font-semibold text-lg'
                      : value === '✗'
                      ? 'text-gray-400 font-semibold text-lg'
                      : 'text-text-primary'
                  }`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgb(168 85 247 / 0.5);
            box-shadow: 0 0 0 0 rgb(168 85 247 / 0.2);
          }
          50% {
            border-color: rgb(168 85 247 / 0.8);
            box-shadow: 0 0 20px 0 rgb(168 85 247 / 0.3);
          }
        }
      `}</style>
    </div>
  );
};
