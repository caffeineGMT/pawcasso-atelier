export interface Promotion {
  id: string;
  name: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;   // ISO date string YYYY-MM-DD
  discountPercent: number;
  bannerText: string;
  ctaText: string;
  couponCode?: string; // Optional Stripe coupon code
  bundleSlug?: string; // Link to themed bundle page
  theme: {
    emoji: string;
    primaryColor: string;
    accentColor: string;
  };
}

export const PROMOTIONS: Promotion[] = [
  {
    id: 'valentines',
    name: "Valentine's Day Special",
    startDate: '2026-02-01',
    endDate: '2026-02-14',
    discountPercent: 25,
    bannerText: "💝 Valentine's Day Special: 25% off Couples Bundle (2 portraits)",
    ctaText: "Shop Valentine's Sale",
    couponCode: 'VALENTINE25',
    bundleSlug: 'valentines',
    theme: {
      emoji: '💝',
      primaryColor: '#ff6b9d',
      accentColor: '#c9184a',
    },
  },
  {
    id: 'mothers-day',
    name: "Mother's Day Special",
    startDate: '2026-05-01',
    endDate: '2026-05-10',
    discountPercent: 20,
    bannerText: "🌷 Mother's Day: 20% off Family Bundle (3+ portraits)",
    ctaText: "Shop Mother's Day",
    couponCode: 'MOM20',
    bundleSlug: 'mothers-day',
    theme: {
      emoji: '🌷',
      primaryColor: '#ffb3d9',
      accentColor: '#ff66b3',
    },
  },
  {
    id: 'summer',
    name: 'Summer Flash Sale',
    startDate: '2026-07-01',
    endDate: '2026-07-07',
    discountPercent: 30,
    bannerText: '☀️ Summer Flash Sale: 30% off all Premium & Deluxe packages',
    ctaText: 'Shop Summer Sale',
    couponCode: 'SUMMER30',
    theme: {
      emoji: '☀️',
      primaryColor: '#ffd93d',
      accentColor: '#f4a261',
    },
  },
  {
    id: 'halloween',
    name: 'Halloween Spooky Portraits',
    startDate: '2026-10-15',
    endDate: '2026-10-31',
    discountPercent: 20,
    bannerText: '🎃 Halloween Special: 20% off Dark Fantasy & Gothic styles',
    ctaText: 'Shop Halloween Collection',
    couponCode: 'SPOOKY20',
    bundleSlug: 'halloween',
    theme: {
      emoji: '🎃',
      primaryColor: '#ff6d00',
      accentColor: '#5f0f40',
    },
  },
  {
    id: 'black-friday',
    name: 'Black Friday Mega Sale',
    startDate: '2026-11-27',
    endDate: '2026-11-30',
    discountPercent: 50,
    bannerText: '🔥 Black Friday: 50% off ALL packages — Biggest sale of the year!',
    ctaText: 'Shop Black Friday',
    couponCode: 'BLACKFRIDAY50',
    theme: {
      emoji: '🔥',
      primaryColor: '#ef233c',
      accentColor: '#d90429',
    },
  },
  {
    id: 'cyber-monday',
    name: 'Cyber Monday',
    startDate: '2026-11-30',
    endDate: '2026-12-01',
    discountPercent: 40,
    bannerText: '💻 Cyber Monday: 40% off Bundle Package (5 portraits)',
    ctaText: 'Shop Cyber Monday',
    couponCode: 'CYBER40',
    theme: {
      emoji: '💻',
      primaryColor: '#4361ee',
      accentColor: '#3a0ca3',
    },
  },
  {
    id: 'christmas',
    name: 'Christmas Gift Special',
    startDate: '2026-12-10',
    endDate: '2026-12-24',
    discountPercent: 30,
    bannerText: '🎄 Holiday Gift Special: 30% off — Perfect gift for pet lovers!',
    ctaText: 'Shop Holiday Gifts',
    couponCode: 'XMAS30',
    bundleSlug: 'christmas',
    theme: {
      emoji: '🎄',
      primaryColor: '#2d6a4f',
      accentColor: '#d62828',
    },
  },
  {
    id: 'new-year',
    name: "New Year's Sale",
    startDate: '2026-12-26',
    endDate: '2027-01-05',
    discountPercent: 35,
    bannerText: "🎊 New Year Sale: 35% off — Start 2027 with art!",
    ctaText: 'Shop New Year Sale',
    couponCode: 'NEWYEAR35',
    theme: {
      emoji: '🎊',
      primaryColor: '#ffd60a',
      accentColor: '#9d4edd',
    },
  },
];

/**
 * Get the currently active promotion based on today's date
 * Returns null if no promotion is active
 */
export function getActivePromotion(): Promotion | null {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format

  for (const promo of PROMOTIONS) {
    if (today >= promo.startDate && today <= promo.endDate) {
      return promo;
    }
  }

  return null;
}

/**
 * Get a specific promotion by ID
 */
export function getPromotionById(id: string): Promotion | null {
  return PROMOTIONS.find(p => p.id === id) || null;
}

/**
 * Check if a promotion is currently active
 */
export function isPromotionActive(promotionId: string): boolean {
  const activePromo = getActivePromotion();
  return activePromo?.id === promotionId;
}

/**
 * Get all upcoming promotions
 */
export function getUpcomingPromotions(): Promotion[] {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  return PROMOTIONS.filter(p => p.startDate > today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}
