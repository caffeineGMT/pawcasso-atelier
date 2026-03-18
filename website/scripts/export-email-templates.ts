/**
 * Export React Email Templates to HTML
 *
 * This script renders all welcome sequence email templates to HTML files
 * that can be imported into Mailchimp's "Code your own" template editor.
 *
 * Usage:
 *   npx tsx scripts/export-email-templates.ts
 *
 * Output:
 *   Generates HTML files in ./email-exports/ directory
 */

import { render } from '@react-email/components';
import { promises as fs } from 'fs';
import path from 'path';

// Import all email templates
import WelcomeEmail01 from '../src/lib/email-templates/welcome-01-immediate';
import WelcomeEmail02 from '../src/lib/email-templates/welcome-02-how-it-works';
import WelcomeEmail03 from '../src/lib/email-templates/welcome-03-social-proof';
import WelcomeEmail04 from '../src/lib/email-templates/welcome-04-urgency';
import WelcomeEmail05 from '../src/lib/email-templates/welcome-05-reengagement';
import AbandonedCartEmail from '../src/lib/email-templates/abandoned-cart';

interface EmailTemplate {
  name: string;
  component: React.ReactElement;
  description: string;
}

const templates: EmailTemplate[] = [
  {
    name: 'welcome-01-immediate',
    component: WelcomeEmail01({
      email: '*|EMAIL|*',
      discountCode: '*|DISCOUNT_CODE|*'
    }),
    description: 'Day 0 - Welcome email with 15% discount code + gallery showcase',
  },
  {
    name: 'welcome-02-how-it-works',
    component: WelcomeEmail02({
      discountCode: '*|DISCOUNT_CODE|*'
    }),
    description: 'Day 2 - How It Works explainer with FAQ',
  },
  {
    name: 'welcome-03-social-proof',
    component: WelcomeEmail03({
      discountCode: '*|DISCOUNT_CODE|*'
    }),
    description: 'Day 4 - Social proof with customer testimonials + Instagram',
  },
  {
    name: 'welcome-04-urgency',
    component: WelcomeEmail04({
      discountCode: '*|DISCOUNT_CODE|*'
    }),
    description: 'Day 7 - Urgency email (discount expires in 24 hours)',
  },
  {
    name: 'welcome-05-reengagement',
    component: WelcomeEmail05({
      email: '*|EMAIL|*'
    }),
    description: 'Day 14 - Re-engagement (what makes us different)',
  },
  {
    name: 'abandoned-cart',
    component: AbandonedCartEmail({
      tier: '*|TIER|*',
      petName: '*|PET_NAME|*',
      discountCode: '*|CART_DISCOUNT|*',
      checkoutUrl: '*|CHECKOUT_URL|*',
    }),
    description: 'Abandoned cart recovery email (existing template)',
  },
];

async function exportTemplates() {
  const exportDir = path.join(process.cwd(), 'email-exports');

  // Create export directory if it doesn't exist
  try {
    await fs.mkdir(exportDir, { recursive: true });
    console.log(`📁 Created export directory: ${exportDir}\n`);
  } catch (error) {
    console.error('Error creating export directory:', error);
    process.exit(1);
  }

  // Render and save each template
  for (const template of templates) {
    try {
      console.log(`🎨 Rendering: ${template.name}...`);

      // Render React component to HTML
      const html = render(template.component, {
        pretty: true,
      });

      // Add helpful comment at the top of the HTML
      const htmlWithComment = `<!--
  ${template.description}

  Mailchimp Merge Tags Used:
  - *|EMAIL|* - Subscriber email address
  - *|FNAME|* - Subscriber first name
  - *|DISCOUNT_CODE|* - Discount code (default: FIRST15)
  - *|UNSUB|* - Unsubscribe link

  To use in Mailchimp:
  1. Go to Campaigns > Email templates > Create Template
  2. Select "Code your own"
  3. Paste this HTML
  4. Save as "${template.name}"
-->\n\n${html}`;

      // Save to file
      const filePath = path.join(exportDir, `${template.name}.html`);
      await fs.writeFile(filePath, htmlWithComment, 'utf-8');

      console.log(`✅ Exported: ${template.name}.html`);
      console.log(`   ${template.description}\n`);
    } catch (error) {
      console.error(`❌ Error rendering ${template.name}:`, error);
    }
  }

  console.log(`\n🎉 Done! All templates exported to: ${exportDir}`);
  console.log('\nNext steps:');
  console.log('1. Open the email-exports/ folder');
  console.log('2. Copy the HTML content from each file');
  console.log('3. In Mailchimp, create a new template and paste the HTML');
  console.log('4. Use these templates in your automation workflow\n');
  console.log('See docs/MAILCHIMP_AUTOMATION_SETUP.md for detailed setup instructions.\n');
}

// Run the export
exportTemplates().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
