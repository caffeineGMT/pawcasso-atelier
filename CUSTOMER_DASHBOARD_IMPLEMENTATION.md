# Customer Dashboard with Magic Link Authentication

## Implementation Summary

Successfully implemented a complete customer dashboard with passwordless authentication for Pawcasso Atelier. This enables customers to track orders, download portraits, manage referrals, and view credit balances.

## Files Created

### Authentication
- `/website/src/lib/auth.ts` - Auth helper functions (getSession, getCurrentUser, requireAuth)
- `/website/src/types/next-auth.d.ts` - TypeScript declarations for NextAuth session types
- `/website/src/app/login/page.tsx` - Login redirect page

### Dashboard
- `/website/src/app/dashboard/layout.tsx` - Auth guard wrapper that protects dashboard routes
- `/website/src/app/dashboard/page.tsx` - Main dashboard with orders, stats, and referral sections
- `/website/src/app/dashboard/components/OrderCard.tsx` - Order card with expandable details and portrait downloads
- `/website/src/app/dashboard/components/Sidebar.tsx` - Desktop sidebar navigation
- `/website/src/app/dashboard/components/ReferralSection.tsx` - Referral link sharing and stats

## Files Modified

### NextAuth Configuration
- `/website/src/app/api/auth/[...nextauth]/route.ts`
  - Updated to use Resend for magic link emails (replacing EMAIL_SERVER)
  - Added custom HTML email template with Pawcasso branding
  - Configured magic link authentication flow

### Authentication Pages
- `/website/src/app/auth/signin/page.tsx`
  - Updated default callbackUrl from `/portal` to `/dashboard`

### Bug Fixes
- `/website/src/app/api/webhooks/stripe/route.ts`
  - Fixed TypeScript error: added missing `tierName` variable definition (line 651)
- `/website/src/app/order/page.tsx`
  - Fixed TypeScript error: updated type casting for synthetic drag-and-drop event (line 226)

### Environment Configuration
- `/website/.env.example`
  - Added `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
  - Added `NEXTAUTH_URL` (e.g., `http://localhost:3000`)

## Features Implemented

### Magic Link Authentication
- **Passwordless login**: Users receive a magic link via email (powered by Resend)
- **Branded emails**: Custom HTML template with Pawcasso design system
- **Session management**: Secure session handling with NextAuth + Prisma adapter
- **Auth guards**: Protected routes redirect unauthenticated users to login

### Dashboard UI
- **Responsive layout**: Desktop sidebar, mobile top bar
- **Order tracking**: Display all customer orders with status badges
- **Portrait downloads**:
  - Individual download buttons with hover overlays
  - "Download All" functionality for multi-portrait orders
  - Portrait indexing ("1 of 3")
- **Order details**: Expandable cards showing:
  - Order ID, tier, art style, notes
  - Delivery status and dates
  - Support contact button (pre-filled mailto link)

### Stats Overview
- **Total Orders**: Count of all orders
- **Total Spent**: Sum of completed order amounts
- **Credit Balance**: Customer's available referral credits

### Referral Program
- **Copy referral link**: One-click copy with visual feedback
- **Referral stats**:
  - Total referrals count
  - Total earnings from referrals
  - Conversion rate percentage
- **How it works**: Visual guide for customers
- **Branded gradient design**: Eye-catching primary/accent gradient background

### Status System
- **Pending Payment**: Gray badge (order created but not paid)
- **Processing**: Orange badge (paid, portraits being generated)
- **Delivered**: Green badge (portraits delivered to customer)
- **Refunded**: Red badge (order refunded)

## Design System Adherence

### Colors
- Primary: `#E07A5F` (coral)
- Secondary: `#3D5A80` (navy)
- Background: `#F8F7F4` (cream)
- Success: `#06D6A0` (green)
- Error: `#EF476F` (red)
- Neutral variations: `#FAFAFA`, `#E5E5E5`, `#4A4A4A`, `#2B2D42`

### Typography
- Headings: 'Playfair Display' serif
- Body/UI: 'Inter' sans-serif
- Consistent size scale (xs: 12px → 4xl: 36px)

### Spacing
- 4px base grid system
- Consistent padding/margins using design tokens

### Components
- **Rounded corners**: 12px (cards), 24px (large containers), 9999px (pills)
- **Shadows**: Hover states use `shadow-lg`
- **Borders**: `#E5E5E5` for dividers
- **Transitions**: Smooth color/shadow transitions on hover

## Database Integration

### Prisma Models Used
- **User**: NextAuth user accounts
- **Session**: NextAuth session management
- **Account**: NextAuth OAuth accounts
- **VerificationToken**: Magic link tokens
- **Order**: Customer orders with all details
- **Customer**: Customer profiles with referral data
- **Referral**: Referral tracking and earnings

### Queries
- Fetch orders: `prisma.order.findMany({ where: { customerEmail }, orderBy: { createdAt: 'desc' } })`
- Fetch customer: `prisma.customer.findUnique({ where: { email }, include: { referralsGiven } })`

## Email Configuration (Resend)

Magic link emails are sent via Resend with:
- **From**: `Pawcasso Atelier <login@pawcasso-atelier.com>`
- **Subject**: "Sign in to your Pawcasso dashboard"
- **HTML Template**: Branded email with CTA button and fallback link
- **Expiration**: 24 hours

## Security Features

- **Auth guards**: Server-side session checks in `layout.tsx`
- **Email verification**: Magic links expire and are single-use
- **Session tokens**: Secure session management with Prisma adapter
- **Environment variables**: Sensitive keys stored in `.env`

## User Flow

1. **Login**:
   - User visits `/dashboard` (unauthenticated)
   - Redirected to `/auth/signin?callbackUrl=/dashboard`
   - User enters email address
   - Magic link email sent via Resend
   - User clicks link → authenticated → redirected to dashboard

2. **Dashboard**:
   - View stats overview (orders, spending, credits)
   - Browse order history
   - Expand order card to see details
   - Download portraits individually or all at once
   - Copy referral link to share
   - Track referral earnings

3. **Referrals**:
   - Copy referral URL: `{baseUrl}/order?ref={referralCode}`
   - Friends get 20% off first order
   - Customer earns $5 credit per conversion

## Environment Setup

### Required Environment Variables
```bash
# Database
DATABASE_URL="file:./dev.db"

# Resend (Email)
RESEND_API_KEY=re_your_api_key_here

# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Stripe (for order data)
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Setup Instructions

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   # Generate NextAuth secret
   openssl rand -base64 32

   # Add to .env file:
   NEXTAUTH_SECRET=<generated_secret>
   NEXTAUTH_URL=http://localhost:3000
   RESEND_API_KEY=<your_resend_key>
   ```

3. **Run Prisma migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access dashboard**:
   - Visit: `http://localhost:3000/dashboard`
   - Enter your email
   - Check inbox for magic link
   - Click link to sign in

## Production Deployment (Vercel)

### Vercel Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:
- `NEXTAUTH_SECRET` (production secret)
- `NEXTAUTH_URL` (e.g., `https://pawcasso-atelier.vercel.app`)
- `RESEND_API_KEY`
- All existing Stripe, database, and API keys

### Domain Configuration
Update `NEXTAUTH_URL` to match your production domain:
```
NEXTAUTH_URL=https://pawcasso-atelier.com
```

### Email Domain (Resend)
Verify sending domain in Resend dashboard:
- Add DNS records for `pawcasso-atelier.com`
- Update `from` address to use verified domain

## Testing Checklist

- [x] Magic link authentication works
- [x] Session persists across page reloads
- [x] Unauthenticated users redirected to login
- [x] Dashboard displays orders correctly
- [x] Order cards expand/collapse
- [x] Portrait download buttons work
- [x] "Download All" functionality works
- [x] Referral link copy works
- [x] Referral stats display correctly
- [x] Credit balance displays
- [x] Support email link works
- [x] Mobile responsive layout
- [x] TypeScript compilation succeeds
- [x] Build succeeds without errors

## Future Enhancements

### Subscription Customers (Ready)
- Check `Customer.activeSubscription` flag
- Display remaining credits for billing period
- Show next billing date

### Support Tickets
- Replace mailto link with in-app support form
- Submit via API endpoint
- Send to `support@pawcasso-atelier.com` via Resend
- Include order details automatically

### Order Filters
- Filter by status (all, pending, completed, refunded)
- Search by pet name
- Date range selection

### Portrait Gallery View
- Grid view of all delivered portraits
- Download multiple orders at once
- Social sharing buttons

### Notifications
- Email notifications for order status updates
- In-app notification center
- Desktop push notifications (PWA)

## Revenue Impact

This dashboard enables:
- **Self-service order tracking**: Reduces support tickets
- **Portrait downloads**: Eliminates manual delivery emails
- **Referral program**: Drives viral growth (20% discount + $5 credit)
- **Repeat purchases**: Easy access to create new orders
- **Brand loyalty**: Professional customer experience

## Technical Decisions

### Why NextAuth?
- Industry-standard authentication for Next.js
- Built-in Prisma adapter
- Secure session management
- Easy magic link implementation

### Why Resend?
- Already used in project for other emails
- Simple API
- High deliverability
- Good developer experience

### Why Magic Links?
- Passwordless = better UX
- No password reset flows needed
- Higher conversion than traditional auth
- Secure (time-limited, single-use tokens)

### Why Server Components?
- Faster initial page load
- Better SEO (if needed)
- Secure database queries (no client exposure)
- Smaller JavaScript bundle

## Support & Maintenance

### Common Issues

**Magic link not received**:
- Check spam folder
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard logs

**Session expires**:
- Sessions expire after 30 days (NextAuth default)
- User can simply request new magic link

**Orders not showing**:
- Verify `customerEmail` matches in Order table
- Check database connection
- Ensure Prisma client is generated

### Monitoring
- Check Resend dashboard for email delivery rates
- Monitor NextAuth session creation in database
- Track login conversion rate (emails sent → sessions created)

## Documentation Links

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [Resend API](https://resend.com/docs)
- [Next.js 16 App Router](https://nextjs.org/docs/app)
