/**
 * Stripe Test Card Numbers for E2E Testing
 *
 * Official Test Cards: https://stripe.com/docs/testing
 *
 * CRITICAL: These cards ONLY work in TEST MODE with test API keys (sk_test_...)
 * They will NEVER charge real money.
 */

export const STRIPE_TEST_CARDS = {
  // ============================================
  // SUCCESS CARDS
  // ============================================

  /** Basic successful payment - No authentication required */
  SUCCESS: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Visa - Success (No 3DS)',
  },

  /** Mastercard successful payment */
  SUCCESS_MASTERCARD: {
    number: '5555555555554444',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Mastercard - Success (No 3DS)',
  },

  /** American Express successful payment */
  SUCCESS_AMEX: {
    number: '378282246310005',
    exp_month: 12,
    exp_year: 2030,
    cvc: '1234', // Amex uses 4 digits
    description: 'Amex - Success (No 3DS)',
  },

  // ============================================
  // 3D SECURE (SCA) CARDS
  // ============================================

  /** Requires 3D Secure authentication - Always succeeds after auth */
  REQUIRE_3DS_SUCCESS: {
    number: '4000002500003155',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: '3D Secure - Success after authentication',
  },

  /** Requires 3D Secure - Authentication fails */
  REQUIRE_3DS_FAIL: {
    number: '4000008400001629',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: '3D Secure - Authentication fails',
  },

  /** Optional 3D Secure - Bank supports but doesn't require */
  OPTIONAL_3DS: {
    number: '4000002760003184',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: '3D Secure - Optional (succeeds either way)',
  },

  // ============================================
  // DECLINED CARDS (Error Scenarios)
  // ============================================

  /** Generic decline - Card was declined */
  DECLINED_GENERIC: {
    number: '4000000000000002',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Declined - Generic decline',
    errorCode: 'card_declined',
  },

  /** Insufficient funds */
  DECLINED_INSUFFICIENT_FUNDS: {
    number: '4000000000009995',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Declined - Insufficient funds',
    errorCode: 'insufficient_funds',
  },

  /** Lost or stolen card */
  DECLINED_LOST_CARD: {
    number: '4000000000009987',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Declined - Lost card',
    errorCode: 'lost_card',
  },

  /** Stolen card */
  DECLINED_STOLEN_CARD: {
    number: '4000000000009979',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Declined - Stolen card',
    errorCode: 'stolen_card',
  },

  /** Expired card */
  DECLINED_EXPIRED: {
    number: '4000000000000069',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Declined - Expired card',
    errorCode: 'expired_card',
  },

  /** Incorrect CVC */
  DECLINED_INCORRECT_CVC: {
    number: '4000000000000127',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Declined - Incorrect CVC',
    errorCode: 'incorrect_cvc',
  },

  /** Processing error */
  DECLINED_PROCESSING_ERROR: {
    number: '4000000000000119',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Declined - Processing error',
    errorCode: 'processing_error',
  },

  /** Rate limit exceeded */
  DECLINED_RATE_LIMIT: {
    number: '4000000000006975',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Declined - Rate limit exceeded',
    errorCode: 'rate_limit',
  },

  // ============================================
  // SPECIAL BEHAVIOR CARDS
  // ============================================

  /** Charge succeeds, but dispute is immediately created */
  DISPUTE_FRAUDULENT: {
    number: '4000000000000259',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Success but creates fraudulent dispute',
  },

  /** Charge succeeds, but "product not received" dispute created */
  DISPUTE_PRODUCT_NOT_RECEIVED: {
    number: '4000000000002685',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Success but creates "product not received" dispute',
  },

  /** Always fails with "card_declined" but attached to Customer succeeds */
  ATTACH_SUCCEEDS_CHARGE_FAILS: {
    number: '4000000000000341',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'Attaching succeeds, charging fails',
  },

  // ============================================
  // INTERNATIONAL CARDS (Different Countries)
  // ============================================

  /** Card from Brazil (BRL) */
  INTERNATIONAL_BRAZIL: {
    number: '4000000760000002',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'International - Brazil',
  },

  /** Card from Mexico (MXN) */
  INTERNATIONAL_MEXICO: {
    number: '4000004840000008',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'International - Mexico',
  },

  /** Card from Canada (CAD) */
  INTERNATIONAL_CANADA: {
    number: '4000001240000000',
    exp_month: 12,
    exp_year: 2030,
    cvc: '123',
    description: 'International - Canada',
  },
} as const;

/**
 * Helper function to get card details for Playwright form filling
 */
export function getCardForFilling(cardType: keyof typeof STRIPE_TEST_CARDS) {
  const card = STRIPE_TEST_CARDS[cardType];
  return {
    cardNumber: card.number,
    expMonth: card.exp_month.toString().padStart(2, '0'),
    expYear: card.exp_year.toString().slice(-2), // Last 2 digits
    cvc: card.cvc,
    zip: '12345', // Valid US ZIP for address verification
  };
}

/**
 * Helper function to get expected error message for declined cards
 */
export function getExpectedError(cardType: keyof typeof STRIPE_TEST_CARDS): string | null {
  const card = STRIPE_TEST_CARDS[cardType];

  if (!('errorCode' in card)) {
    return null;
  }

  const errorMessages: Record<string, string> = {
    card_declined: 'Your card was declined',
    insufficient_funds: 'Your card has insufficient funds',
    lost_card: 'Your card was declined',
    stolen_card: 'Your card was declined',
    expired_card: 'Your card has expired',
    incorrect_cvc: 'Your card\'s security code is incorrect',
    processing_error: 'An error occurred while processing your card',
    rate_limit: 'Too many requests',
  };

  return errorMessages[card.errorCode] || 'Your card was declined';
}

/**
 * Test billing details for checkout forms
 */
export const TEST_BILLING = {
  name: 'Test Customer',
  email: 'test@pawcasso.test',
  address: '123 Test Street',
  city: 'Test City',
  state: 'CA',
  zip: '12345',
  country: 'US',
};

/**
 * Test order details for checkout
 */
export const TEST_ORDER = {
  customerName: 'John Doe',
  customerEmail: 'test-payment@pawcasso.test',
  petName: 'Buddy',
  style: 'impressionist',
  tier: 'basic',
  notes: 'E2E test order',
};
