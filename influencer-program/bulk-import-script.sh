#!/bin/bash

# Bulk Import Influencers from CSV
# Usage: ./bulk-import-script.sh

API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3000}"
CSV_FILE="influencer-program/influencers-seed-data.csv"

echo "════════════════════════════════════════════════════════"
echo "📦 Bulk Importing Influencers"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Reading from: $CSV_FILE"
echo "API endpoint: $API_URL/api/influencers/bulk-import"
echo ""

# Read CSV file and convert to JSON
CSV_CONTENT=$(cat "$CSV_FILE")

# Send to API
curl -X POST "$API_URL/api/influencers/bulk-import" \
  -H "Content-Type: application/json" \
  -d "{\"influencers\": $(echo "$CSV_CONTENT" | tail -n +2 | while IFS=',' read -r name handle platform followerCount email profileUrl; do
    echo "{\"name\":\"$name\",\"handle\":\"$handle\",\"platform\":\"$platform\",\"followerCount\":$followerCount,\"email\":\"$email\",\"profileUrl\":\"$profileUrl\"}"
  done | jq -s .)}"

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ Import complete!"
echo "════════════════════════════════════════════════════════"
