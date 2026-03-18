export const PricingComparison = () => {
  const TIERS = [
    { name: 'Basic', price: 9, popular: false },
    { name: 'Premium', price: 29, popular: true },
    { name: 'Deluxe', price: 49, popular: false },
    { name: 'Bundle', price: 79, popular: false },
  ];

  const FEATURES = [
    { label: 'Number of portraits', values: ['1', '1 + 2 variations', '3', '5'] },
    { label: 'Delivery time', values: ['24hr', '12hr', '6hr', 'Instant'] },
    { label: 'Resolution', values: ['Standard', 'High-res', 'Ultra HD', 'Ultra HD'] },
    { label: 'File formats', values: ['JPG', 'JPG, PNG', 'JPG, PNG, TIFF', 'All formats'] },
    { label: 'Revisions included', values: ['1', '2', '3', 'Unlimited'] },
    { label: 'Commercial use', values: ['✗', '✗', '✗', '✓'] },
    { label: 'Print-ready files', values: ['✗', '✗', '✓', '✓'] },
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
                    ? 'border-2 border-purple-500 bg-purple-500/5'
                    : 'border-white/[0.08]'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="text-lg font-semibold text-text-primary mt-2">{tier.name}</div>
                <div className="mt-2">
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
                {feature.label}
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
    </div>
  );
};
