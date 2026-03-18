#!/bin/bash

# Test script for Stripe webhook endpoint
# Usage: ./test-webhook.sh [local|production]

ENV=${1:-local}

if [ "$ENV" = "local" ]; then
  WEBHOOK_URL="http://localhost:3000/api/webhooks/stripe"
  echo "Testing LOCAL webhook endpoint: $WEBHOOK_URL"
else
  WEBHOOK_URL="https://pawcasso-atelier.vercel.app/api/webhooks/stripe"
  echo "Testing PRODUCTION webhook endpoint: $WEBHOOK_URL"
fi

# Sample checkout.session.completed event payload
PAYLOAD='{
  "id": "evt_test_webhook",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_1234567890",
      "customer_email": "test@example.com",
      "metadata": {
        "tier": "basic",
        "tierName": "Basic",
        "customerName": "Test Customer",
        "petName": "Fluffy",
        "style": "renaissance",
        "notes": "Test order",
        "petPhotoUrl": "https://example.blob.vercel-storage.com/test-pet-photo.jpg"
      }
    }
  }
}'

# Note: For production testing, you need a valid Stripe webhook signature
# This script sends an unsigned payload for local testing only

if [ "$ENV" = "local" ]; then
  echo ""
  echo "Sending test payload..."
  curl -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -H "stripe-signature: test_signature" \
    -d "$PAYLOAD" \
    -v
else
  echo ""
  echo "⚠️  Production webhook requires valid Stripe signature"
  echo "Use Stripe CLI for production testing:"
  echo ""
  echo "  stripe listen --forward-to $WEBHOOK_URL"
  echo "  stripe trigger checkout.session.completed"
  echo ""
fi
