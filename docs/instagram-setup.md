# Instagram API Setup Guide

## Prerequisites

- Instagram account: @pawcasso.atelier
- Must be switched to **Business** or **Creator** account

## Step-by-Step Setup

### 1. Switch to Professional Account
1. Open Instagram app → Settings → Account → Switch to Professional Account
2. Choose **Creator** (better for content-first accounts)
3. Select category: **Digital Creator** or **Artist**

### 2. Create/Link a Facebook Page
1. Go to facebook.com → Create Page
2. Name it "Pawcasso Atelier" (or similar)
3. In Instagram settings → Linked Accounts → link to the Facebook Page

### 3. Create a Facebook App
1. Go to https://developers.facebook.com
2. Click "My Apps" → "Create App"
3. Select app type: **Business**
4. Name: "Pawcasso Atelier Bot"
5. Add product: **Instagram Graph API**

### 4. Get Access Token
1. In App Dashboard → Instagram → API setup with Instagram business login
2. Click "Generate token" next to @pawcasso.atelier
3. Log in and authorize
4. Copy the generated token

**Token types:**
- Dashboard tokens: Long-lived (60 days)
- Business login tokens: Short-lived (1 hour)

### 5. Get Instagram User ID
```bash
curl "https://graph.instagram.com/me?fields=user_id,username&access_token=YOUR_TOKEN"
```

### 6. Store Credentials
```bash
echo "YOUR_ACCESS_TOKEN" > ~/.claude/metaclaw/.instagram_token
echo "YOUR_IG_USER_ID" > ~/.claude/metaclaw/.instagram_user_id
echo "YOUR_FB_APP_ID" > ~/.claude/metaclaw/.instagram_app_id
echo "YOUR_FB_APP_SECRET" > ~/.claude/metaclaw/.instagram_app_secret
```

### 7. Add to n8n
1. Go to https://n8n.aws.metafb.cloud
2. Settings → Credentials → Add credential
3. Type: "Header Auth"
4. Name: "Instagram Graph API"
5. Header Name: `Authorization`
6. Header Value: `Bearer YOUR_TOKEN`

## API Endpoints

### Post an Image
```bash
# Step 1: Create media container
curl -X POST "https://graph.instagram.com/IG_USER_ID/media" \
  -d "image_url=PUBLIC_IMAGE_URL" \
  -d "caption=Your caption here" \
  -d "access_token=YOUR_TOKEN"

# Step 2: Publish
curl -X POST "https://graph.instagram.com/IG_USER_ID/media_publish" \
  -d "creation_id=CONTAINER_ID" \
  -d "access_token=YOUR_TOKEN"
```

### Post a Carousel
```bash
# Create individual containers with is_carousel_item=true
# Then create carousel container with children=ID1,ID2,ID3
# Then publish the carousel container
```

## Limitations
- JPEG only (convert PNG to JPEG before posting)
- Images must be publicly accessible via URL during processing
- Rate limit: 100 posts per 24-hour period
- Carousel max: 10 items

## Token Refresh
Tokens expire after 60 days. Set up a refresh workflow in n8n.
