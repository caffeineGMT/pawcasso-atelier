# Email Templates

This directory contains all email templates for Pawcasso Atelier's marketing automation, built with [React Email](https://react.email/).

## Template Overview

### Welcome Sequence (5 emails)

**Goal:** 25% email capture rate, 8% email-to-purchase conversion

1. **welcome-01-immediate.tsx** - Day 0 (Immediate)
   - Welcome email with 15% discount code
   - Gallery showcase with 4 featured images
   - Why Choose Pawcasso benefits section

2. **welcome-02-how-it-works.tsx** - Day 2
   - 3-step process explanation
   - FAQ section (5 common questions)
   - Pro tips for best results

3. **welcome-03-social-proof.tsx** - Day 4
   - 4 customer testimonials
   - Social proof stats (2,400+ customers, 4.9/5 rating)
   - Instagram CTA

4. **welcome-04-urgency.tsx** - Day 7
   - Discount expiration urgency
   - Countdown timer visual
   - Last chance CTA

5. **welcome-05-reengagement.tsx** - Day 14
   - Final email in sequence
   - Comparison vs. traditional artists
   - "What makes us different" section
   - Customer story

### Other Templates

- **abandoned-cart.tsx** - Cart abandonment recovery
  - 10% additional discount
  - Personalized with tier and pet name
  - 48-hour expiration

## Tech Stack

- **React Email** - Component-based email templates
- **TypeScript** - Type safety
- **Inline Styles** - Email client compatibility

## Development

### Preview Emails Locally

```bash
# Install React Email dev tools (if not already installed)
npm install -D react-email

# Run the preview server
npm run email:dev
```

This opens a browser at `http://localhost:3000` with live previews of all templates.

### Export to HTML for Mailchimp

```bash
# Generate HTML files for Mailchimp import
npx tsx scripts/export-email-templates.ts
```

HTML files will be saved to `website/email-exports/` directory.

## Mailchimp Integration

### Merge Tags Used

These Mailchimp merge tags are automatically replaced when emails are sent:

- `*|EMAIL|*` - Subscriber email address
- `*|FNAME|*` - Subscriber first name (if collected)
- `*|DISCOUNT_CODE|*` - Discount code (default: FIRST15)
- `*|UNSUB|*` - Unsubscribe link (required by law)
- `*|TIER|*` - Order tier (for abandoned cart)
- `*|PET_NAME|*` - Pet name (for abandoned cart)
- `*|CART_DISCOUNT|*` - Cart discount code
- `*|CHECKOUT_URL|*` - Checkout URL with params

### Setup Process

1. Export templates to HTML:
   ```bash
   npx tsx scripts/export-email-templates.ts
   ```

2. In Mailchimp:
   - Go to **Campaigns → Email Templates → Create Template**
   - Select **"Code your own"**
   - Paste the HTML from `email-exports/`
   - Save with the same filename (e.g., `welcome-01-immediate`)

3. Create automation workflow (see `docs/MAILCHIMP_AUTOMATION_SETUP.md`)

## Design System

All templates follow Pawcasso's brand guidelines:

### Colors
- **Primary Gold:** `#C9A96E`
- **Background:** `#000000` (black)
- **Card Background:** `#111111` / `#1a1a1a`
- **Text Primary:** `#F5F5F7`
- **Text Secondary:** `#86868b`
- **Border:** `#1d1d1f`
- **Error/Urgency:** `#ff6b6b`

### Typography
- **Font Family:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif`
- **Headings:** 600 weight, tight line-height
- **Body:** 16px, 1.6 line-height
- **Small Text:** 14px, 1.6 line-height

### Layout
- **Max Width:** 600px (email standard)
- **Padding:** 24-32px
- **Border Radius:** 12px (cards/boxes)
- **Button Radius:** 9999px (fully rounded)

## Email Best Practices

### ✅ Do's

- Keep subject lines under 50 characters
- Use preview text to expand on the subject
- Include clear CTA buttons (not just text links)
- Optimize for mobile (60%+ of opens)
- Use alt text for all images
- Include plain text version (Mailchimp auto-generates)
- Test in multiple email clients

### ❌ Don'ts

- Don't use external CSS files (inline only)
- Don't use complex JavaScript
- Don't rely solely on images for content
- Don't use background images (limited support)
- Don't exceed 102KB total email size
- Don't use too many different fonts

## Testing

### Before Launching

1. **Spam Check:**
   - Use [Mail Tester](https://www.mail-tester.com/)
   - Aim for 8/10+ score

2. **Client Compatibility:**
   - Gmail (desktop & mobile)
   - Apple Mail (iOS & macOS)
   - Outlook (desktop & web)
   - Yahoo Mail
   - Use [Litmus](https://www.litmus.com/) or Email on Acid for testing

3. **Content Check:**
   - All merge tags working correctly
   - All links functional
   - Images loading properly
   - Unsubscribe link present

4. **Performance:**
   - Load time under 3 seconds
   - Images optimized (WebP or compressed PNG)
   - Total email size under 102KB

## Metrics to Track

### Welcome Sequence Performance

| Email | Target Open Rate | Target CTR | Target Conversion |
|-------|-----------------|-----------|-------------------|
| Email 1 | 65% | 10% | 2% |
| Email 2 | 45% | 8% | 1.5% |
| Email 3 | 40% | 7% | 1% |
| Email 4 | 55% | 12% | 2.5% |
| Email 5 | 30% | 6% | 1% |

**Overall Sequence Goal:** 8% email-to-purchase conversion

### Key Metrics in Mailchimp

- **Open Rate:** % who opened the email
- **Click Rate:** % who clicked any link
- **Click-to-Open Rate:** % who clicked after opening
- **Unsubscribe Rate:** Keep below 1%
- **Bounce Rate:** Keep below 2%
- **Spam Complaints:** Keep below 0.1%

## A/B Testing Ideas

### Subject Lines
- Emoji vs. no emoji
- Question vs. statement
- Urgency vs. benefit-focused

### Content
- Short copy vs. long copy
- Single CTA vs. multiple CTAs
- Different gallery images
- Testimonial count (2 vs. 4 vs. 6)

### Timing
- Morning vs. evening sends
- Weekday vs. weekend
- Email 4: Day 6 vs. Day 7

### Discount Strategy
- 15% vs. 10% vs. $2 off
- Time-limited vs. always available
- Unique codes vs. shared codes

## Troubleshooting

### Images not loading
- Verify image URLs are absolute (not relative)
- Check image hosting (use CDN like Vercel)
- Ensure images are optimized and under 1MB each

### Merge tags not replaced
- Check spelling matches Mailchimp exactly
- Verify merge fields exist in audience settings
- Test with real subscriber (not preview mode)

### Layout breaking in Outlook
- Use tables for layout (not divs/flexbox)
- Set explicit widths in pixels
- Avoid complex CSS (stick to inline styles)

### Low open rates
- Improve subject line (test A/B variants)
- Check sender reputation
- Verify list hygiene (remove bounces)
- Send at optimal times (test different hours)

## Resources

- **React Email Docs:** https://react.email/docs
- **Mailchimp Merge Tags:** https://mailchimp.com/help/all-the-merge-tags-cheat-sheet/
- **Email Design Guide:** https://www.campaignmonitor.com/resources/guides/email-design/
- **Accessibility:** https://www.litmus.com/blog/ultimate-guide-accessible-emails

## Support

For questions or issues with email templates:
1. Check `docs/MAILCHIMP_AUTOMATION_SETUP.md` for setup instructions
2. Review Mailchimp documentation
3. Test locally with `npm run email:dev`
4. Contact the development team

---

**Last Updated:** 2024-03-18
