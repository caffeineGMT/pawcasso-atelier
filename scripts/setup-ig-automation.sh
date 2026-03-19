#!/bin/bash
# Pawcasso Daily IG Content - Automation Setup Script

set -e

echo "🎨 Pawcasso Daily IG Content - Automation Setup"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this script from the pawcasso-atelier/website directory"
  exit 1
fi

# Test the generator
echo "📝 Testing content generator..."
npm run ig:daily > /tmp/ig-daily-test.log 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Generator works!"
else
  echo "❌ Generator failed. Check /tmp/ig-daily-test.log"
  exit 1
fi

# Display generated content
echo ""
echo "📊 Generated content:"
ls -lh ../website/public/ig-queue/*.json 2>/dev/null | tail -1 || echo "No content found"

echo ""
echo "=============================================="
echo "✨ Setup Complete!"
echo "=============================================="
echo ""
echo "📱 Review Dashboard:"
echo "   https://pawcasso-atelier.vercel.app/ig-queue/"
echo ""
echo "⏰ Automation Options:"
echo ""
echo "1. CRON (Recommended for local development):"
echo "   Run: crontab -e"
echo "   Add: 0 8 * * * cd $(pwd) && npm run ig:daily >> /tmp/ig-daily.log 2>&1"
echo ""
echo "2. MetaClaw Scheduler:"
echo "   Tell Alfie: 'Schedule daily IG content generation at 8 AM PT'"
echo ""
echo "3. Manual:"
echo "   Run: npm run ig:daily (whenever you want new content)"
echo ""
echo "🚀 Next Steps:"
echo "   1. Open the review dashboard on your phone"
echo "   2. Review today's generated content"
echo "   3. Pick your favorite caption variant"
echo "   4. Tap 'Generate via n8n' to create the image"
echo "   5. Post to Instagram at the recommended time!"
echo ""
