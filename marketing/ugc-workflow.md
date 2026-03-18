# User-Generated Content (UGC) & Social Proof System

## 🎯 Goal
Get 30% of customers to submit reviews/photos and share their portraits on Instagram, creating a viral loop of social proof.

---

## 📦 System Components

### 1. Customer Reviews Database
**Database Tables:**
- `CustomerReview` - Stores all customer reviews with photos, ratings, and Instagram links
- `SocialProofStats` - Aggregates stats (total customers, portraits, average rating)
- `InstagramPost` - Tracks Instagram posts featuring customer portraits

**Fields:**
- Customer info (name, email, pet name)
- 5-star rating
- Review text
- Original pet photo URL
- Final portrait URL
- Instagram handle
- Instagram post URL
- Art style
- Approval status (admin moderated)
- Featured flag (for homepage display)

---

## 🔄 Customer Journey

### **Phase 1: Purchase**
1. Customer orders portrait on `/order`
2. Uploads pet photo
3. Receives portrait within 24 hours (via email)

### **Phase 2: Review Request** (3 days post-delivery)
**Email:** `post-delivery-review-request.tsx`

**Subject:** "Love your [PetName] portrait? Share it with us!"

**Content:**
- Request to share portrait on Instagram
- Tag @pawcasso.atelier
- Incentive: **25% off next order** + get featured

**CTA:**
- "Leave a Review" → `/submit-review?email=...`
- "Follow Us on Instagram" → `https://instagram.com/pawcasso.atelier`

### **Phase 3: Review Submission**
**Page:** `/submit-review`

**Form Fields:**
- Name, Email, Pet Name
- 5-star rating (visual stars)
- Review text
- Instagram handle (optional)
- Instagram post URL (optional - required for discount)

**Behavior:**
- Review submitted → pending admin approval
- If Instagram post URL provided → triggers discount code generation

### **Phase 4: Admin Approval**
**Admin Dashboard:** `/admin/reviews`

**Actions:**
- Approve/reject reviews
- Feature reviews (shows on homepage)
- Delete inappropriate content
- View customer Instagram posts

**Filter Options:**
- Pending reviews
- Approved reviews
- All reviews

### **Phase 5: Reward Delivery**
**Email:** `instagram-share-discount.tsx`

**Subject:** "Thank you for sharing! Here's your 25% discount 🎉"

**Content:**
- Personalized thank you
- Unique discount code (e.g., `SHARE25`)
- CTA to order another portrait
- Suggestions: gift portraits, multiple styles, memorial portraits

---

## 📄 Public Pages

### `/gallery/customer-reviews`
**Features:**
- Before/after photo grids (pet photo → portrait)
- 5-star ratings
- Customer names + pet names
- Filter by: All / Featured / Instagram shares
- Sort by: Recent / Highest rated
- Social proof stats at top
- Instagram post links
- CTA to order portrait

**SEO:**
- JSON-LD AggregateRating schema
- Open Graph images
- Customer story rich snippets

### `/submit-review`
**Features:**
- Pre-filled email from URL param
- Visual star rating selector
- Instagram URL field with instructions
- Incentive banner (25% off)
- Success confirmation page
- Links to Instagram and gallery

---

## 🏠 Homepage Integration

### Social Proof Stats Widget
**Component:** `<SocialProofStats />`

**Displays:**
- `200+` Happy Customers
- `350+` Portraits Created
- `4.9★` Average Rating (`120 Reviews`)

**Data Source:** `/api/stats/social-proof`
- Auto-updates from database
- Caches stats for performance

### Instagram Feed Widget
**Component:** `<InstagramFeed />`

**Displays:**
- Grid of 8 featured Instagram posts
- Customer-shared portraits
- Like counts
- Links to Instagram posts
- CTA: Follow @pawcasso.atelier

**Data Source:** `/api/instagram/posts`
- Curated featured posts from `InstagramPost` table

---

## 🔧 Admin Tools

### Review Management Dashboard
**URL:** `/admin/reviews`

**Features:**
- View all reviews (pending, approved, all)
- One-click approve
- Toggle featured status
- Delete reviews
- View before/after images
- See Instagram post links
- Track submission dates

**Filters:**
- Pending (needs approval)
- Approved (published)
- All reviews

### Testimonial Export Script
**Command:** `npm run testimonials:export`

**Generates:**
1. **HTML file** (`testimonial-cards.html`)
   - Beautiful testimonial cards
   - Ready for screenshots
   - Use in ads, emails, landing pages

2. **JSON file** (`testimonials.json`)
   - Structured data
   - For programmatic use
   - Import into ad platforms

3. **React Component** (`TestimonialCards.tsx`)
   - Drop-in component
   - Use on any page
   - Pre-styled, ready to use

**Output Location:** `marketing/testimonial-cards/`

---

## 📧 Email Templates

### 1. Post-Delivery Review Request
**File:** `lib/email-templates/post-delivery-review-request.tsx`

**Trigger:** 3 days after portrait delivery

**Variables:**
- `customerName`
- `petName`
- `reviewUrl` (pre-filled with email)
- `instagramHandle`

**Incentive Highlight:**
- 25% off next order
- Get featured on Instagram
- Help other pet parents

### 2. Instagram Share Discount
**File:** `lib/email-templates/instagram-share-discount.tsx`

**Trigger:** When customer submits review with Instagram post URL

**Variables:**
- `customerName`
- `discountCode` (unique, e.g., `SHARE25`)
- `discountPercentage` (25%)

**Content:**
- Celebration emoji/graphic
- Big discount code display
- No expiration date
- CTA to order again
- Suggestions for next orders

---

## 🎨 Use Cases for Exported Testimonials

### 1. Instagram/Facebook Ads
- Screenshot testimonial cards
- Use as ad creatives
- Build trust instantly
- Show before/after transformations

### 2. Landing Pages
- Import `TestimonialCards.tsx`
- Display featured reviews
- Add social proof anywhere
- Real customer photos

### 3. Email Campaigns
- Embed testimonial HTML
- Use in welcome sequences
- Add to abandoned cart emails
- Include in newsletters

### 4. Social Media Posts
- Share customer stories
- Repost Instagram shares
- Tag customers
- Build community

---

## 📊 Success Metrics

### Key Performance Indicators (KPIs)

**Target: 30% review submission rate**

**Track:**
- Review submission rate (reviews / orders)
- Instagram share rate (IG posts / reviews)
- Discount code redemption rate
- Featured review CTR (click-through to order)
- Homepage stats engagement

**Optimize:**
- Email timing (test 3 days vs 5 days vs 7 days)
- Discount percentage (test 20% vs 25% vs 30%)
- Email subject lines
- Review form length
- Instagram CTA placement

---

## 🚀 Implementation Workflow

### For New Orders:
1. Customer completes order
2. Portrait delivered via email
3. **3 days later:** Send review request email
4. Customer submits review via `/submit-review`
5. Review enters pending queue in `/admin/reviews`
6. Admin approves + features best reviews
7. If Instagram post URL → send discount code email
8. Featured reviews appear on:
   - `/gallery/customer-reviews`
   - Homepage (if featured)
   - Instagram feed widget

### For Marketing:
1. Run `npm run testimonials:export`
2. Open `marketing/testimonial-cards/testimonial-cards.html`
3. Screenshot cards for ads
4. Import `TestimonialCards.tsx` into landing pages
5. Use JSON data in email campaigns

---

## 🔐 Security & Moderation

### Admin Approval Required
- All reviews pending by default
- Manual review prevents spam/abuse
- Feature flag for homepage display
- Delete option for inappropriate content

### Incentive Fraud Prevention
- Verify Instagram post URL exists
- Check @pawcasso.atelier tag
- One discount per customer email
- Track redemption in database

---

## 📈 Viral Loop Strategy

**Step 1:** Customer orders portrait ($9)
**Step 2:** Receives stunning portrait → shares on Instagram
**Step 3:** Tags @pawcasso.atelier → gets 25% off
**Step 4:** Their followers see post → discover Pawcasso
**Step 5:** New customers order → repeat cycle

**Amplification:**
- Instagram algorithm favors tagged posts
- Followers trust friend recommendations
- Before/after photos are highly shareable
- Pet content = viral gold on social media

**Projected Impact:**
- 30% of customers share = 30 new IG posts per 100 orders
- Each post reaches avg 500 followers
- 30 posts × 500 followers = 15,000 impressions
- 2% conversion = 300 new visitors
- 5% order rate = 15 new orders
- **15% viral growth multiplier per 100 orders**

---

## 🛠️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reviews` | GET | Fetch approved reviews (public) |
| `/api/reviews` | POST | Submit new review (admin auto-create) |
| `/api/reviews/submit` | POST | Public review submission form |
| `/api/admin/reviews` | GET | Fetch all reviews (admin) |
| `/api/admin/reviews/approve` | POST | Approve pending review |
| `/api/admin/reviews/feature` | POST | Toggle featured status |
| `/api/admin/reviews/[id]` | DELETE | Delete review |
| `/api/stats/social-proof` | GET | Get aggregated stats |
| `/api/instagram/posts` | GET | Fetch featured Instagram posts |

---

## 📝 Next Steps

### Immediate Actions:
1. ✅ Set up database schema
2. ✅ Build review pages and API
3. ✅ Create email templates
4. ✅ Add homepage widgets
5. ✅ Build admin dashboard

### Post-Launch:
1. Send review request emails to existing customers
2. Manually approve first 20 reviews
3. Feature best 10 on homepage
4. Export testimonial cards for ads
5. Launch Instagram campaign
6. Monitor review submission rate
7. A/B test email timing
8. Optimize discount percentage
9. Track viral coefficient
10. Scale with Instagram influencers

---

## 💡 Pro Tips

### Maximize Review Quality:
- Ask specific questions in review form
- Provide example reviews
- Show before/after photo comparisons
- Highlight best reviews prominently

### Encourage Instagram Sharing:
- Make sharing dead simple (one-click)
- Offer compelling incentive (25% off)
- Feature customers on main Instagram
- Re-share their posts to Stories
- Tag customers back (reciprocal engagement)

### Build Social Proof:
- Display stats prominently on homepage
- Update stats regularly
- Show real customer photos
- Use authentic testimonials
- Feature Instagram feed
- Add trust badges

**Goal:** Turn every customer into a brand advocate and amplify organic reach through authentic user-generated content.
