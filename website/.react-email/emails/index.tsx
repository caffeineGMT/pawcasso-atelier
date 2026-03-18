// React Email Preview Configuration
// This file enables `npm run email:dev` to preview email templates

import WelcomeEmail01 from '../../src/lib/email-templates/welcome-01-immediate';
import WelcomeEmail02 from '../../src/lib/email-templates/welcome-02-how-it-works';
import WelcomeEmail03 from '../../src/lib/email-templates/welcome-03-social-proof';
import WelcomeEmail04 from '../../src/lib/email-templates/welcome-04-urgency';
import WelcomeEmail05 from '../../src/lib/email-templates/welcome-05-reengagement';
import AbandonedCartEmail from '../../src/lib/email-templates/abandoned-cart';

// Export all templates for preview
export const WelcomeImmediate = () => WelcomeEmail01({ email: 'customer@example.com', discountCode: 'FIRST15' });
export const WelcomeHowItWorks = () => WelcomeEmail02({ discountCode: 'FIRST15' });
export const WelcomeSocialProof = () => WelcomeEmail03({ discountCode: 'FIRST15' });
export const WelcomeUrgency = () => WelcomeEmail04({ discountCode: 'FIRST15' });
export const WelcomeReengagement = () => WelcomeEmail05({ email: 'customer@example.com' });
export const AbandonedCart = () => AbandonedCartEmail({
  tier: 'Premium',
  petName: 'Alfie',
  discountCode: 'CART10-ABC123',
  checkoutUrl: 'https://pawcasso-atelier.vercel.app/order?session=abc123'
});
