# Partnership Discount Codes Setup Guide

## Overview

This guide covers how to create, manage, and track unique discount codes for each partnership. Proper tracking is essential for accurate commission calculations.

---

## 🎯 Discount Code Strategy

### Code Naming Convention

Use a consistent format: `[PARTNER][DISCOUNT]`

**Examples:**
- `BARKBOX10` - BarkBox partnership, 10% off
- `THEDOGIST10` - The Dogist partnership, 10% off
- `LAPOFLOVE15` - Lap of Love partnership, 15% off
- `WILDONE10` - Wild One partnership, 10% off

### Standard Discount Rates

| Partner Type | Customer Discount | Partner Commission | Net to Company |
|--------------|-------------------|-------------------|----------------|
| **Pet Brands** | 10% off | 25% | 65% ($5.85) |
| **Vet Clinics** | 10-15% off | 20% | 70-75% ($6.30-$6.75) |
| **Pet Photographers** | 10% off | 30% | 60% ($5.40) |

**Calculation example for Pet Brand:**
- Original price: $9.00
- Customer pays: $8.10 (10% discount)
- Partner commission: $2.03 (25% of $8.10)
- Net to company: $6.07

---

## 🔧 Stripe Setup (Recommended Method)

### Step 1: Create Coupon in Stripe Dashboard

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products → Coupons**
3. Click **+ New coupon**

**Settings:**
- **ID:** `BARKBOX10` (partner code, uppercase)
- **Type:** Percentage discount
- **Percent off:** 10%
- **Duration:** Forever (or set expiration if needed)
- **Redemption limits:**
  - Max redemptions: Leave blank (unlimited)
  - First time transaction: No
- **Name (optional):** "BarkBox Partnership - 10% off"

4. Click **Create coupon**

### Step 2: Test the Coupon

1. Go to your checkout page
2. Enter the coupon code `BARKBOX10`
3. Verify it applies 10% discount
4. Complete a test purchase
5. Check Stripe Dashboard → Payments to confirm discount applied

### Step 3: Track in Spreadsheet

Create a tracking spreadsheet with these columns:

| Partner ID | Partner Name | Discount Code | Customer Discount | Commission % | Active | Created Date | Total Uses | Total Revenue | Commission Owed |
|-----------|--------------|---------------|-------------------|--------------|--------|--------------|------------|---------------|-----------------|
| PB001 | BarkBox | BARKBOX10 | 10% | 25% | Yes | 2026-03-18 | 0 | $0.00 | $0.00 |

---

## 🤖 Automated Tracking (Advanced)

### Option 1: Stripe Webhooks + Database

Add to your existing webhook handler in `website/src/app/api/webhooks/stripe/route.ts`:

```typescript
// Track partnership commission
if (session.metadata?.discount_code) {
  const discountCode = session.metadata.discount_code;
  const partner = await db.partner.findUnique({
    where: { discountCode }
  });

  if (partner) {
    await db.partnerCommission.create({
      data: {
        partnerId: partner.id,
        orderId: session.id,
        saleAmount: session.amount_total / 100,
        commissionRate: partner.commissionRate,
        commissionAmount: (session.amount_total / 100) * partner.commissionRate,
        status: 'PENDING'
      }
    });
  }
}
```

### Option 2: Manual Tracking via Stripe Reports

1. Go to Stripe Dashboard → **Reports**
2. Create custom report filtering by coupon code
3. Export monthly for commission calculations
4. Download CSV and import into tracking spreadsheet

---

## 📊 Bulk Code Generation

### For Multiple Partners at Once

If you need to create 10+ codes at once, use the Stripe API:

```javascript
// bulk-create-coupons.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const partners = [
  { code: 'BARKBOX10', name: 'BarkBox', discount: 10 },
  { code: 'THEDOGIST10', name: 'The Dogist', discount: 10 },
  { code: 'LAPOFLOVE15', name: 'Lap of Love', discount: 15 },
  // ... add all partners
];

async function createPartnerCoupons() {
  for (const partner of partners) {
    try {
      const coupon = await stripe.coupons.create({
        id: partner.code,
        percent_off: partner.discount,
        duration: 'forever',
        name: `${partner.name} Partnership - ${partner.discount}% off`
      });
      console.log(`✓ Created ${partner.code}`);
    } catch (error) {
      console.log(`✗ Failed to create ${partner.code}:`, error.message);
    }
  }
}

createPartnerCoupons();
```

Run with: `node bulk-create-coupons.js`

---

## 🔗 Tracking Links (Alternative/Additional Method)

### Using UTM Parameters

Create trackable links for partners who prefer links over codes:

**Format:**
```
https://pawcasso-atelier.vercel.app/order?utm_source=partner&utm_medium=referral&utm_campaign=BARKBOX&discount=BARKBOX10
```

**UTM Breakdown:**
- `utm_source=partner` - Traffic source
- `utm_medium=referral` - Traffic medium
- `utm_campaign=BARKBOX` - Specific partner
- `discount=BARKBOX10` - Auto-apply discount code

### Auto-Apply Discount on Landing

Update your order page to read URL params:

```typescript
// website/src/app/order/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function OrderPage() {
  const searchParams = useSearchParams();
  const discountCode = searchParams.get('discount');

  // Auto-populate discount field if present
  useEffect(() => {
    if (discountCode) {
      setDiscountCode(discountCode);
      applyDiscount(discountCode);
    }
  }, [discountCode]);

  // ... rest of component
}
```

---

## 📈 Monthly Commission Calculation

### Manual Method

**Step 1: Export Stripe Data**
1. Stripe Dashboard → Payments
2. Filter by date range (e.g., March 1-31)
3. Filter by "Discount code" field
4. Export to CSV

**Step 2: Calculate Commission per Partner**

| Partner | Code | Total Orders | Gross Sales | Discount Given | Net Sales | Commission Rate | Commission Owed |
|---------|------|--------------|-------------|----------------|-----------|-----------------|-----------------|
| BarkBox | BARKBOX10 | 15 | $135.00 | $13.50 | $121.50 | 25% | $30.38 |
| The Dogist | THEDOGIST10 | 22 | $198.00 | $19.80 | $178.20 | 25% | $44.55 |

**Formula:**
```
Commission Owed = (Gross Sales - Discount Given) × Commission Rate
```

**Step 3: Generate Partner Reports**

Send each partner a monthly report:

```
Subject: March 2026 Partnership Report - BarkBox

Hi [Partner Contact],

Here's your partnership performance for March 2026:

📊 PERFORMANCE SUMMARY
- Orders: 15
- Gross Sales: $135.00
- Customer Discount: $13.50 (10%)
- Net Sales: $121.50
- Your Commission (25%): $30.38

💰 PAYMENT
Your commission of $30.38 will be paid via [PayPal/Bank Transfer]
by April 30, 2026 (net-30 terms).

📈 INSIGHTS
- Average order value: $9.00
- Conversion rate: [X]% (if trackable)
- Top performing channel: [Social/Email/Website]

Questions? Reply to this email or call [PHONE].

Thanks for being an amazing partner!

[Your Name]
Pawcasso Atelier
```

---

## 🛠️ Database Schema (Optional Advanced Setup)

### Prisma Schema for Partnership Tracking

Add to `website/prisma/schema.prisma`:

```prisma
model Partner {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  category      PartnerCategory
  discountCode  String   @unique
  commissionRate Float   @default(0.25)
  status        PartnerStatus @default(ACTIVE)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  commissions   PartnerCommission[]
}

enum PartnerCategory {
  PET_BRAND
  VET_CLINIC
  PHOTOGRAPHER
}

enum PartnerStatus {
  ACTIVE
  INACTIVE
  PENDING
}

model PartnerCommission {
  id              String   @id @default(cuid())
  partnerId       String
  partner         Partner  @relation(fields: [partnerId], references: [id])
  orderId         String   @unique
  saleAmount      Float
  discountAmount  Float
  commissionRate  Float
  commissionAmount Float
  status          CommissionStatus @default(PENDING)
  paidAt          DateTime?
  createdAt       DateTime @default(now())

  @@index([partnerId])
  @@index([status])
}

enum CommissionStatus {
  PENDING
  PAID
  CANCELLED
}
```

### API Route for Partner Dashboard

```typescript
// website/src/app/api/partners/[partnerId]/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { partnerId: string } }
) {
  const partner = await prisma.partner.findUnique({
    where: { id: params.partnerId },
    include: {
      commissions: {
        where: {
          status: 'PENDING'
        }
      }
    }
  });

  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }

  const stats = {
    totalOrders: partner.commissions.length,
    totalSales: partner.commissions.reduce((sum, c) => sum + c.saleAmount, 0),
    totalCommission: partner.commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
    pendingCommission: partner.commissions
      .filter(c => c.status === 'PENDING')
      .reduce((sum, c) => sum + c.commissionAmount, 0)
  };

  return NextResponse.json({ partner, stats });
}
```

---

## 📋 Partner Onboarding Checklist

When a new partner signs up:

- [ ] Add partner to tracking spreadsheet
- [ ] Create Stripe coupon code: `[PARTNER][DISCOUNT]`
- [ ] Create tracking link with UTM params
- [ ] Test coupon code on checkout page
- [ ] Send partner welcome email with:
  - [ ] Their unique discount code
  - [ ] Tracking link
  - [ ] Marketing materials
  - [ ] Commission rate confirmation
  - [ ] Payment schedule
- [ ] Add to monthly reporting calendar
- [ ] Set reminder for first month performance review

---

## 🚨 Common Issues & Solutions

### Issue: Discount code not working
**Solution:** Check Stripe Dashboard → Coupons. Ensure code is active and spelled correctly (case-sensitive).

### Issue: Can't track which partner drove a sale
**Solution:** Require customers to enter discount code. Don't auto-apply unless from trackable link.

### Issue: Partner wants custom discount rate
**Solution:** Create separate coupon code with custom percentage. Update tracking spreadsheet.

### Issue: Dispute over commission calculation
**Solution:** Show Stripe transaction details. Be transparent about calculation formula.

### Issue: Multiple codes used in one order
**Solution:** Stripe only allows one coupon per checkout. First code applied wins.

---

## 📊 Sample Partner Codes Quick Reference

| Partner | Code | Discount | Commission | Notes |
|---------|------|----------|------------|-------|
| BarkBox | BARKBOX10 | 10% | 25% | Pet brand |
| The Dogist | THEDOGIST10 | 10% | 25% | Photographer |
| Lap of Love | LAPOFLOVE15 | 15% | 20% | Vet - memorial focus |
| Wild One | WILDONE10 | 10% | 25% | Pet brand |
| Embark Vet | EMBARK10 | 10% | 25% | Pet brand |
| Sophie Gamand | SOPHIEGAMAND10 | 10% | 30% | Photographer - exclusive |
| ASPCA | ASPCA10 | 10% | 20% + $2 donation | Non-profit |

---

## 🎯 Next Steps

1. **This Week:**
   - Create codes for top 10 priority partners
   - Set up tracking spreadsheet
   - Test all codes on checkout page

2. **Before Outreach:**
   - Verify all codes work
   - Document codes in partner welcome emails
   - Set up monthly reporting calendar

3. **Monthly:**
   - Export Stripe data (1st of month)
   - Calculate commissions (by 5th of month)
   - Send partner reports (by 5th of month)
   - Process payments (by end of month, net-30)

---

**Ready to launch! 🚀**

Once codes are set up, partners can start driving sales immediately. Track everything diligently to ensure accurate commission payments.
