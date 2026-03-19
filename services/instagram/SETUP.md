# Instagram Graph API + GChat Approval Workflow Setup

## Architecture

```
Daily 10 AM PT
    |
    v
[n8n Schedule Trigger]
    |
    v
[Fetch Next Post] ──> /api/instagram/schedule (GET)
    |
    v
[GChat: Send Approval] ──> Google Chat Webhook
    |
    v
[Wait for Reply] <── GChat reply / /api/instagram/gchat-reply
    |
    ├── "yes" ──> [Publish to Instagram] ──> /api/instagram/publish
    │                                            |
    │                                            v
    │                                    Instagram Graph API
    │                                    (create container → publish)
    │                                            |
    │                                            v
    │                                    [GChat: Success notification]
    │
    ├── "edit: ..." ──> Update caption, then publish
    │
    └── "skip" / timeout ──> Mark skipped, notify GChat
```

## Step 1: Meta Business Suite Setup

1. **Create Facebook Page** for Pawcasso Atelier (if not exists)
   - Go to facebook.com/pages/create
   - Category: Art / Digital Creator

2. **Convert Instagram to Business Account**
   - Instagram Settings > Account > Switch to Professional Account > Business
   - Link to the Facebook Page

3. **Link accounts**: Instagram Settings > Linked Accounts > Facebook > Select your Page

## Step 2: Facebook App Setup

1. Go to https://developers.facebook.com/apps
2. Create New App > Type: Business
3. Add Product: **Instagram Graph API**
4. Go to Graph API Explorer:
   - Select your App
   - Generate User Token with permissions:
     - `instagram_basic`
     - `instagram_content_publish`
     - `instagram_manage_comments`
     - `instagram_manage_insights`
     - `pages_show_list`
     - `pages_read_engagement`
   - Click "Generate Access Token"

5. **Exchange for Long-Lived Token** (60 days):
   ```
   GET https://graph.facebook.com/v18.0/oauth/access_token
     ?grant_type=fb_exchange_token
     &client_id={APP_ID}
     &client_secret={APP_SECRET}
     &fb_exchange_token={SHORT_LIVED_TOKEN}
   ```

6. **Get Instagram Business Account ID**:
   ```
   GET https://graph.facebook.com/v18.0/me/accounts?access_token={TOKEN}
   ```
   Then:
   ```
   GET https://graph.facebook.com/v18.0/{PAGE_ID}?fields=instagram_business_account&access_token={TOKEN}
   ```

## Step 3: Environment Variables

Add to Vercel (production):
```bash
npx vercel env add INSTAGRAM_ACCESS_TOKEN production
npx vercel env add INSTAGRAM_ACCOUNT_ID production
npx vercel env add FACEBOOK_APP_ID production
npx vercel env add FACEBOOK_APP_SECRET production
npx vercel env add GCHAT_WEBHOOK_URL production
npx vercel env add INSTAGRAM_WEBHOOK_SECRET production
npx vercel env add N8N_WEBHOOK_URL production
```

## Step 4: Google Chat Webhook

1. Open Google Chat
2. Create or select a Space for notifications
3. Click Space name > Manage webhooks > Add webhook
4. Name: "Pawcasso Instagram Bot"
5. Copy the webhook URL
6. Set as `GCHAT_WEBHOOK_URL` env var

## Step 5: n8n Workflow Setup

### Option A: Import the dedicated posting workflow
1. Open n8n
2. Import `n8n/instagram-posting-workflow.json`
3. Set n8n environment variables:
   - `SITE_URL` = https://pawcassoatelier.com
   - `GCHAT_WEBHOOK_URL` = your GChat webhook URL
   - `INSTAGRAM_WEBHOOK_SECRET` = your secret
4. Create HTTP Header Auth credential named "Instagram Webhook Auth":
   - Header Name: `Authorization`
   - Header Value: `Bearer {your INSTAGRAM_WEBHOOK_SECRET}`
5. Activate the workflow

### Option B: The existing Creative Pipeline workflow
The `pawcasso-workflow.json` has been updated to include:
- GChat approval (replacing httpbin.org placeholder)
- Instagram Graph API publishing
- Post-success/skip notifications

Configure the same env vars and activate.

### Metrics workflow
Import `n8n/instagram-metrics-workflow.json` for weekly reports.

## Step 6: Token Refresh

Tokens expire after 60 days. Set a reminder and run:
```bash
cd website && npx tsx scripts/refresh-instagram-token.ts
```

Then update the env var in Vercel.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/instagram/posts` | GET | Fetch featured posts (existing) |
| `/api/instagram/publish` | POST | Publish to Instagram (auth required) |
| `/api/instagram/schedule` | GET | Get next post + stats |
| `/api/instagram/schedule` | POST | Update post status (auth required) |
| `/api/instagram/metrics` | GET | Account/post metrics |
| `/api/instagram/webhook` | POST | n8n approval webhook (auth required) |
| `/api/instagram/gchat-reply` | POST | GChat bot reply handler |

## Testing

1. **Manual test**: Call GET `/api/instagram/schedule` to see next post
2. **Trigger n8n manually**: Run the workflow manually in n8n
3. **Check GChat**: Verify approval card appears
4. **Reply "yes"**: Confirm post appears on Instagram
5. **Check metrics**: Call GET `/api/instagram/metrics`

## Content Queue

Posts are managed in `content/captions/ready-to-post.json`.
Currently 23 posts are pre-loaded and ready to go.
The posting log is tracked in `content/posting-log.json`.
Weekly metrics are appended to `content/instagram-metrics.csv`.
