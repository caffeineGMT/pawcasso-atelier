# Pawcasso Portrait Generation Automation

This directory contains the automated portrait generation and delivery pipeline that processes Stripe checkout orders, generates AI portraits via Manus API, and delivers them via email.

## Architecture Overview

```
Stripe Checkout → Webhook → Portrait Generation → Blob Storage → Email Delivery
                     ↓              ↓                   ↓              ↓
                  Verify Event   Manus API         Vercel Blob    Resend API
```

## Implementation Options

### Option 1: n8n Workflow (Recommended for No-Code)

**File:** `portrait-generation.json`

**Setup:**
1. **Install n8n** (self-hosted or cloud):
   ```bash
   # Self-hosted via Docker
   docker run -p 5678:5678 n8nio/n8n

   # Or sign up at n8n.cloud
   ```

2. **Import Workflow:**
   - Open n8n UI at http://localhost:5678
   - Click "Workflows" → "Import from File"
   - Upload `portrait-generation.json`

3. **Configure Credentials:**
   - **Stripe API Key**: Go to Credentials → Add → HTTP Header Auth
     - Name: `Stripe API Key`
     - Header Name: `Authorization`
     - Value: `Bearer sk_live_...` (your Stripe secret key)

   - **Vercel Blob Token**: Credentials → Add → HTTP Header Auth
     - Name: `Vercel Blob Token`
     - Header Name: `Authorization`
     - Value: `Bearer vercel_blob_...` (your BLOB_READ_WRITE_TOKEN)

   - **Manus API Key**: Credentials → Add → HTTP Header Auth
     - Name: `Manus API Key`
     - Header Name: `Authorization`
     - Value: `Bearer manus_...` (your Manus API key)

   - **Resend API**: Credentials → Add → Resend API
     - API Key: `re_...` (your Resend API key)

4. **Configure Stripe Webhook:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-n8n-instance.com/webhook/stripe-checkout`
   - Select events: `checkout.session.completed`
   - Copy webhook signing secret and add to n8n environment as `STRIPE_WEBHOOK_SECRET`

5. **Activate Workflow:**
   - Click "Active" toggle in n8n UI
   - Test with a real order

### Option 2: Next.js API Route (Recommended for Vercel Deployment)

**File:** `../src/app/api/webhooks/stripe/route.ts`

**Setup:**

1. **Environment Variables:**
   Add to Vercel project settings or `.env.local`:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   BLOB_READ_WRITE_TOKEN=vercel_blob_...
   MANUS_API_KEY=manus_...
   RESEND_API_KEY=re_...
   ```

2. **Configure Stripe Webhook:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://pawcasso-atelier.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET` env var

3. **Deploy:**
   ```bash
   git push origin main  # Auto-deploys to Vercel
   ```

4. **Test:**
   - Complete a real order on the website
   - Check Vercel logs for webhook processing
   - Customer should receive email with portraits within 2-5 minutes

## Tier Configuration

The pipeline generates different numbers of portraits based on the order tier:

| Tier    | Portraits | Delivery Time | Price |
|---------|-----------|---------------|-------|
| Basic   | 1         | 24 hours      | $9    |
| Premium | 3         | 12 hours      | $29   |
| Deluxe  | 5         | 6 hours       | $49   |
| Bundle  | 5         | Instant       | $79   |

## Workflow Steps

1. **Stripe Webhook Reception** (`POST /webhook/stripe-checkout` or `/api/webhooks/stripe`)
   - Verifies webhook signature
   - Extracts session metadata

2. **Event Validation**
   - Checks if event type is `checkout.session.completed`
   - Validates pet photo URL exists

3. **Pet Photo Download**
   - Downloads pet photo from Vercel Blob using `metadata.petPhotoUrl`
   - Validates file integrity

4. **Portrait Generation Loop**
   - Iterates N times based on tier (1/3/5)
   - For each iteration:
     - Calls Manus API with pet photo + style prompt
     - Polls task status every 10s (max 5 min timeout)
     - Downloads generated portrait

5. **Upload to Blob Storage**
   - Uploads each generated portrait to Vercel Blob
   - Path format: `portraits/{session_id}_{pet_name}_{index}_{timestamp}.png`

6. **Email Delivery**
   - Builds HTML email with download links
   - Sends via Resend API to customer
   - Styled with Pawcasso brand colors (#C9A96E gold on black)

7. **Metadata Update**
   - Updates Stripe session with:
     - `delivery_status: "completed"`
     - `delivered_at: ISO timestamp`
     - `portrait_urls: comma-separated URLs`

## Error Handling

### Retry Logic
- **Manus API failures**: 3 retries with exponential backoff (10s, 30s, 90s)
- **Network errors**: Automatic retry with increasing delays

### Failure Notifications
If portrait generation fails (missing photo, Manus timeout, etc.):
1. Admin receives email alert at `michaelguo@meta.com`
2. Email includes session ID, customer email, and error details
3. Requires manual fulfillment

### Graceful Degradation
- Partial failures: If 2/3 portraits succeed, sends those and logs error
- Complete failures: Sends admin alert, no customer email sent

## Manus API Integration

### Request Format
```json
{
  "prompt": "Professional artistic portrait of {pet_name} in {style} style, high detail, studio lighting, 8K resolution, masterpiece quality",
  "image": "base64_encoded_image",
  "model": "flux-pro",
  "aspect_ratio": "1:1",
  "num_inference_steps": 50
}
```

### Response Polling
- Initial response: `{ "task_id": "..." }`
- Poll: `GET /api/v1/tasks/{task_id}/status`
- Success: `{ "status": "completed", "output_url": "https://..." }`
- Timeout: 5 minutes max

### API Key Request
To get Manus API access, email: `manus-support@meta.com`

## Testing

### Test Checkout
1. Go to `/order` page
2. Fill form with test data
3. Upload a pet photo
4. Select a tier
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete checkout

### Verify Webhook
```bash
# Check Vercel logs
vercel logs --follow

# Or check n8n execution logs
# UI → Executions → View details
```

### Test Manus API Directly
```bash
curl -X POST https://manus.aws.metafb.cloud/api/v1/tasks \
  -H "Authorization: Bearer $MANUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional portrait of a golden retriever",
    "model": "flux-pro",
    "aspect_ratio": "1:1"
  }'
```

## Monitoring

### Key Metrics
- **Success Rate**: Portraits delivered / Total orders
- **Average Processing Time**: Webhook to email delivery
- **Manus API Latency**: Time per portrait generation
- **Failure Rate**: Failed generations requiring manual intervention

### Logs to Check
1. **Vercel Logs**: `/api/webhooks/stripe` execution
2. **Stripe Webhook Logs**: Delivery status and response codes
3. **Resend Dashboard**: Email delivery success
4. **n8n Executions**: Step-by-step workflow progress

## Dependencies

### NPM Packages (already installed)
```json
{
  "stripe": "^20.4.1",
  "@vercel/blob": "^2.3.1",
  "resend": "^6.9.4"
}
```

### External Services
- **Stripe**: Payment processing and webhooks
- **Vercel Blob**: File storage for pet photos and portraits
- **Manus API**: AI portrait generation (Meta internal)
- **Resend**: Transactional email delivery

## Cost Breakdown

Per order (assuming Deluxe tier - 5 portraits):
- Stripe: $0.30 + 2.9% = ~$1.72
- Vercel Blob: ~$0.01 (storage + bandwidth)
- Manus API: Variable (check internal pricing)
- Resend: $0.001 per email
- **Total variable cost**: ~$1.74 + Manus costs

## Troubleshooting

### "Missing pet_photo_url" Error
- **Cause**: Photo upload failed or wasn't included in checkout metadata
- **Fix**: Ensure `/api/upload` succeeds before creating checkout session

### Manus API Timeout
- **Cause**: Model overloaded or network issues
- **Fix**: Retry mechanism will attempt 3x. If persistent, use fallback model

### Email Not Received
- **Cause**: Resend API key invalid or email blocked
- **Fix**: Check Resend dashboard for delivery logs. Verify sender domain setup.

### Stripe Webhook Not Firing
- **Cause**: Incorrect endpoint URL or webhook secret mismatch
- **Fix**: Verify webhook endpoint matches deployed URL. Re-copy webhook secret.

## Production Checklist

- [ ] Stripe webhook endpoint configured with production URL
- [ ] All environment variables set in Vercel (production)
- [ ] Manus API key requested and added
- [ ] Resend sender domain verified (portraits@pawcasso-atelier.com)
- [ ] Test end-to-end flow with real order
- [ ] Monitor first 10 orders closely
- [ ] Set up uptime monitoring for webhook endpoint
- [ ] Create dashboard for success/failure metrics
- [ ] Document manual fulfillment process for failures
- [ ] Add customer support email template for issues

## Future Enhancements

1. **Quality Check**: Add AI quality validation before sending
2. **Customer Preview**: Send preview for approval before final delivery
3. **Revision System**: Allow customers to request style adjustments
4. **Batch Processing**: Queue multiple orders for efficiency
5. **A/B Testing**: Test different prompts/models for better results
6. **Analytics Dashboard**: Track generation times, success rates, customer satisfaction
