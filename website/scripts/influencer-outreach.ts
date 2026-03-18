/**
 * Influencer Outreach Script
 *
 * Reads CSV of influencer targets and generates personalized cold DM templates
 * for manual copy-paste on Instagram and TikTok.
 *
 * Usage: npm run outreach
 */

import fs from 'fs';
import path from 'path';

interface InfluencerTarget {
  name: string;
  handle: string;
  platform: string;
  followerCount: number;
  email: string;
  profileUrl: string;
  niche: string;
}

function parseCSV(filePath: string): InfluencerTarget[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');

  // Skip header row
  const dataLines = lines.slice(1);

  return dataLines.map(line => {
    const [name, handle, platform, followerCount, email, profileUrl, niche] = line.split(',');
    return {
      name: name.trim(),
      handle: handle.trim(),
      platform: platform.trim(),
      followerCount: parseInt(followerCount.trim()),
      email: email.trim(),
      profileUrl: profileUrl.trim(),
      niche: niche.trim(),
    };
  });
}

function getPetNameFromHandle(name: string, handle: string): string {
  // Try to extract pet name from account name
  // "Luna the Golden" -> "Luna"
  // "Max's Adventures" -> "Max"
  // "Fluffy Cloud Samoyed" -> "Fluffy"

  if (name.includes('the ')) {
    return name.split('the ')[0].trim();
  }
  if (name.includes("'s ")) {
    return name.split("'s ")[0].trim();
  }
  // Use first word of name
  return name.split(' ')[0];
}

function generateDMTemplate(influencer: InfluencerTarget): string {
  const petName = getPetNameFromHandle(influencer.name, influencer.handle);
  const discountCode = `${influencer.handle.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10)}20`;

  // Personalized elements based on niche
  const nicheCompliments: Record<string, string> = {
    'golden retriever': "those gorgeous golden locks",
    'husky': "those stunning blue eyes",
    'corgi': "that adorable smile",
    'french bulldog': "those bat ears",
    'pomeranian': "that fluffy coat",
    'samoyed': "that cloud-like floof",
    'pitbull': "that sweet face",
    'german shepherd': "that noble look",
    'poodle': "that elegant style",
    'labrador': "that happy energy",
    'shiba inu': "that sassy personality",
    'beagle': "those puppy dog eyes",
    'dachshund': "those little legs",
    'border collie': "that intelligent gaze",
  };

  const compliment = nicheCompliments[influencer.niche.toLowerCase()] || "the amazing content";

  const templates = [
    // Template 1: Short and sweet
    `Hi @${influencer.handle}! 👋

Obsessed with ${petName}'s content — ${compliment} are everything! 🐾

We create AI pet portraits and would love to send ${petName} a free custom portrait (all 3 artistic styles) + feature you in our gallery.

Your followers get 20% off with code ${discountCode} 💜

We also offer 15% commission on all sales from your code. Interested?

Reply here or DM us anytime! ✨`,

    // Template 2: More detailed value prop
    `Hey @${influencer.handle}!

We're Pawcasso Atelier — we create AI pet portraits that turn pets into art 🎨

${petName} is ADORABLE and we'd love to collaborate! ${compliment.charAt(0).toUpperCase() + compliment.slice(1)} would look incredible in our Watercolor, Oil Painting, and Pop Art styles.

Here's the deal:
✨ Free portrait in all 3 styles ($79 value)
💰 20% discount code for your audience (${discountCode})
💸 15% commission on every sale
🎁 Feature in our gallery + your profile tagged

We ship within 24hrs. All digital, high-res files ready for print.

Want to see some examples? We can send our gallery link! 🐕💜`,

    // Template 3: Social proof focused
    `Hi @${influencer.handle}! Love ${petName}! 🐾

We're Pawcasso Atelier (AI pet portraits) and have worked with ${influencer.platform === 'instagram' ? '50+' : '30+'} pet influencers already.

Quick ask: Would you be open to a collab?

What you get:
• Free custom portrait (3 art styles - $79 value)
• Exclusive 20% code for your followers (${discountCode})
• 15% commission on all sales
• Featured in our gallery with credit

${petName} would look STUNNING in our watercolor style 🎨

We deliver in 24hrs. No strings attached — just want to send you something special!

Interested? 💜`,

    // Template 4: Ultra-short (for busy accounts)
    `Hey @${influencer.handle}! 🐾

Love ${petName}! We make AI pet portraits.

Want a free custom portrait? We'll send all 3 styles + give your followers 20% off (code: ${discountCode}) + 15% commission.

24hr delivery. Sound good? 💜`,
  ];

  // Pick template based on follower count
  if (influencer.followerCount > 80000) {
    return templates[3]; // Ultra-short for big accounts
  } else if (influencer.followerCount > 50000) {
    return templates[0]; // Short and sweet
  } else if (influencer.followerCount > 30000) {
    return templates[2]; // Social proof
  } else {
    return templates[1]; // Detailed value prop
  }
}

function generateEmailTemplate(influencer: InfluencerTarget): string {
  const petName = getPetNameFromHandle(influencer.name, influencer.handle);
  const discountCode = `${influencer.handle.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10)}20`;

  return `Subject: Collaboration Opportunity - Free AI Pet Portrait for ${petName}! 🎨

Hi there!

My name is Michael from Pawcasso Atelier, and I'm a huge fan of ${petName}'s ${influencer.platform === 'instagram' ? 'Instagram' : 'TikTok'} (@${influencer.handle})!

We create stunning AI-generated pet portraits that transform pets into beautiful artwork. I'd love to send ${petName} a complimentary custom portrait in all three of our artistic styles (Watercolor, Oil Painting, and Pop Art).

Here's what we're offering for this collaboration:

✨ FREE Custom Portrait Package ($79 value)
   • 3 unique artistic styles of ${petName}
   • High-resolution digital files (4000x5000px)
   • Print-ready at 300 DPI
   • Delivered within 24 hours

💰 Exclusive Discount Code for Your Audience
   • 20% off for your followers
   • Your unique code: ${discountCode}
   • Unlimited redemptions

💸 Commission Structure
   • Earn 15% commission on every sale
   • Real-time tracking dashboard
   • Monthly payouts via PayPal or bank transfer

🎁 Gallery Feature
   • ${petName}'s portrait featured on our website
   • Full credit with link to your profile
   • Cross-promotion on our social channels

We've collaborated with ${influencer.platform === 'instagram' ? '50+' : '30+'} pet influencers and have a 4.9-star rating from over 500 happy customers. You can check out our gallery at pawcasso-atelier.vercel.app/gallery

No obligations — just want to create something beautiful for ${petName} and share it with your amazing community!

Would you be interested? I can send over examples and more details if you'd like.

Looking forward to hearing from you!

Best regards,
Michael
Founder, Pawcasso Atelier
pawcasso-atelier.vercel.app
@pawcasso.atelier`;
}

function formatOutreachMessages(targets: InfluencerTarget[]) {
  console.log('\n' + '='.repeat(80));
  console.log('INFLUENCER OUTREACH CAMPAIGN');
  console.log('Generated at:', new Date().toLocaleString());
  console.log('Total Targets:', targets.length);
  console.log('='.repeat(80) + '\n');

  // Group by platform
  const instagramTargets = targets.filter(t => t.platform === 'instagram');
  const tiktokTargets = targets.filter(t => t.platform === 'tiktok');

  console.log(`📸 INSTAGRAM TARGETS: ${instagramTargets.length}`);
  console.log(`🎵 TIKTOK TARGETS: ${tiktokTargets.length}\n`);

  // Create output by platform
  const outputDir = path.join(__dirname, '../outreach-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate individual message files
  targets.forEach((influencer, index) => {
    const dmTemplate = generateDMTemplate(influencer);
    const emailTemplate = generateEmailTemplate(influencer);
    const petName = getPetNameFromHandle(influencer.name, influencer.handle);
    const discountCode = `${influencer.handle.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10)}20`;

    // Console output
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`${index + 1}. ${influencer.name} (@${influencer.handle}) - ${influencer.platform.toUpperCase()}`);
    console.log(`   Followers: ${influencer.followerCount.toLocaleString()}`);
    console.log(`   Niche: ${influencer.niche}`);
    console.log(`   Pet Name: ${petName}`);
    console.log(`   Discount Code: ${discountCode}`);
    console.log(`   Profile: ${influencer.profileUrl}`);
    console.log(`   Email: ${influencer.email}`);
    console.log(`${'─'.repeat(80)}`);
    console.log('\n📱 DM TEMPLATE (copy-paste ready):');
    console.log('┌' + '─'.repeat(78) + '┐');
    dmTemplate.split('\n').forEach(line => {
      console.log(`│ ${line.padEnd(77)}│`);
    });
    console.log('└' + '─'.repeat(78) + '┘');

    // Save to individual files
    const filename = `${index + 1}_${influencer.handle}.txt`;
    const filepath = path.join(outputDir, filename);
    const fileContent = `INFLUENCER: ${influencer.name} (@${influencer.handle})
PLATFORM: ${influencer.platform.toUpperCase()}
FOLLOWERS: ${influencer.followerCount.toLocaleString()}
NICHE: ${influencer.niche}
PET NAME: ${petName}
DISCOUNT CODE: ${discountCode}
PROFILE: ${influencer.profileUrl}
EMAIL: ${influencer.email}

${'='.repeat(80)}
DM TEMPLATE (Instagram/TikTok DM)
${'='.repeat(80)}

${dmTemplate}

${'='.repeat(80)}
EMAIL TEMPLATE
${'='.repeat(80)}

${emailTemplate}

${'='.repeat(80)}
FOLLOW-UP TEMPLATES
${'='.repeat(80)}

FOLLOW-UP #1 (After 3 days):
Hey @${influencer.handle}! Just wanted to circle back — did you get a chance to check out our collaboration offer for ${petName}? We'd love to send that free portrait! 🎨💜

FOLLOW-UP #2 (After 1 week):
Hi again! Still would love to create something special for ${petName}. No pressure at all — just wanted to make sure our message didn't get lost in your DMs! 🐾

RESPONSE TO "YES":
Amazing! 🎉 Let me get ${petName}'s portrait started right away. I'll DM you our order form — just need:
1. A clear photo of ${petName}
2. Your preferred artistic style (or we can do all 3!)
3. Your email for delivery

We'll have it ready within 24hrs! Also setting up your discount code ${discountCode} and commission tracking now 💜

RESPONSE TO "TELL ME MORE":
Of course! Here's how it works:
• We use AI to create museum-quality pet portraits
• 3 styles: Watercolor, Oil Painting, Pop Art
• High-res files perfect for printing or posting
• Most customers LOVE the watercolor style for ${influencer.niche}s!

Check out our gallery: pawcasso-atelier.vercel.app/gallery

Want to see what ${petName} would look like? Send me a photo and I can show you a preview! 🎨
`;

    fs.writeFileSync(filepath, fileContent);
  });

  // Generate master CSV for tracking
  const trackingCSV = [
    'name,handle,platform,followers,email,profile,niche,petName,discountCode,status,contactedDate,responseDate,agreedDate,postedDate,notes'
  ];

  targets.forEach((influencer) => {
    const petName = getPetNameFromHandle(influencer.name, influencer.handle);
    const discountCode = `${influencer.handle.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10)}20`;

    trackingCSV.push(
      `"${influencer.name}","${influencer.handle}","${influencer.platform}",${influencer.followerCount},"${influencer.email}","${influencer.profileUrl}","${influencer.niche}","${petName}","${discountCode}","pending","","","","",""`
    );
  });

  const trackingPath = path.join(outputDir, 'TRACKING.csv');
  fs.writeFileSync(trackingPath, trackingCSV.join('\n'));

  // Generate summary report
  const summaryPath = path.join(outputDir, 'SUMMARY.md');
  const totalReach = targets.reduce((sum, t) => sum + t.followerCount, 0);
  const avgFollowers = Math.round(totalReach / targets.length);

  const summary = `# Influencer Outreach Campaign Summary

**Generated:** ${new Date().toLocaleString()}

## Overview
- **Total Targets:** ${targets.length}
- **Instagram:** ${instagramTargets.length}
- **TikTok:** ${tiktokTargets.length}
- **Total Potential Reach:** ${totalReach.toLocaleString()} followers
- **Average Followers:** ${avgFollowers.toLocaleString()}

## Estimated ROI Projections

### Conservative (5% response rate, 80% fulfillment)
- **Responses Expected:** ${Math.round(targets.length * 0.05)}
- **Posts Expected:** ${Math.round(targets.length * 0.05 * 0.8)}
- **Estimated Reach:** ${Math.round(totalReach * 0.05 * 0.8 * 0.1).toLocaleString()} impressions
- **Estimated Sales (0.5% conversion):** ${Math.round(totalReach * 0.05 * 0.8 * 0.1 * 0.005)}
- **Revenue ($29 avg):** $${Math.round(totalReach * 0.05 * 0.8 * 0.1 * 0.005 * 29).toLocaleString()}

### Optimistic (15% response rate, 90% fulfillment)
- **Responses Expected:** ${Math.round(targets.length * 0.15)}
- **Posts Expected:** ${Math.round(targets.length * 0.15 * 0.9)}
- **Estimated Reach:** ${Math.round(totalReach * 0.15 * 0.9 * 0.1).toLocaleString()} impressions
- **Estimated Sales (1% conversion):** ${Math.round(totalReach * 0.15 * 0.9 * 0.1 * 0.01)}
- **Revenue ($29 avg):** $${Math.round(totalReach * 0.15 * 0.9 * 0.1 * 0.01 * 29).toLocaleString()}

## Campaign Investment
- **Free Portraits Cost:** $0 (digital, no COGS)
- **Commission Budget (15%):** Pay only on sales
- **Time Investment:** ~2-3 hours for initial outreach
- **Break-even:** 1 sale per influencer post

## Next Steps

1. **Week 1:** Send initial DMs to all ${targets.length} targets
   - Use platform-specific templates from individual files
   - Track responses in TRACKING.csv

2. **Week 2:** Follow up with non-responders
   - Use Follow-up #1 template
   - Update status for any responses

3. **Week 3:** Second follow-up for high-value targets (>50K followers)
   - Use Follow-up #2 template
   - Mark "no response" for others

4. **Week 4:** Send portraits to all who agreed
   - Request they post within 7 days
   - Provide discount codes and affiliate links

5. **Week 5+:** Track conversions and commission payouts
   - Monitor sales via admin dashboard
   - Send thank you notes to top performers
   - Identify advocates for long-term partnerships

## Files Generated
- **${targets.length} individual message files** with DM + email templates
- **TRACKING.csv** for campaign management
- **SUMMARY.md** (this file)

## Tips for Success

✅ **DO:**
- Personalize each message (pet name, niche, follower count)
- Send during optimal times (10am-2pm, 7pm-9pm)
- Respond quickly to interested influencers
- Over-deliver on quality and speed
- Feature them prominently in your gallery

❌ **DON'T:**
- Mass DM without personalization
- Be pushy or sales-y
- Delay responses (reply within 2 hours)
- Skip the follow-ups (80% success comes from follow-ups)
- Forget to track codes and commissions

Good luck! 🚀🐾
`;

  fs.writeFileSync(summaryPath, summary);

  console.log(`\n\n${'='.repeat(80)}`);
  console.log('✅ OUTREACH CAMPAIGN GENERATED SUCCESSFULLY!');
  console.log(`${'='.repeat(80)}`);
  console.log(`\n📁 Output saved to: ${outputDir}/`);
  console.log(`\n📄 Files created:`);
  console.log(`   • ${targets.length} individual message files (1_handle.txt, 2_handle.txt, ...)`);
  console.log(`   • TRACKING.csv (for campaign management)`);
  console.log(`   • SUMMARY.md (campaign overview and ROI projections)`);
  console.log(`\n📊 Campaign Stats:`);
  console.log(`   • Total Targets: ${targets.length}`);
  console.log(`   • Total Reach: ${totalReach.toLocaleString()} followers`);
  console.log(`   • Avg Followers: ${avgFollowers.toLocaleString()}`);
  console.log(`\n🚀 Next Steps:`);
  console.log(`   1. Review individual message files in ${outputDir}/`);
  console.log(`   2. Start sending DMs using the templates`);
  console.log(`   3. Track responses in TRACKING.csv`);
  console.log(`   4. Import tracking data to admin dashboard`);
  console.log(`\nGood luck! 🐾💜\n`);
}

// Main execution
const csvPath = path.join(__dirname, '../data/influencer-targets.csv');

if (!fs.existsSync(csvPath)) {
  console.error(`❌ ERROR: CSV file not found at ${csvPath}`);
  console.error('Please create the file first or update the path.');
  process.exit(1);
}

const targets = parseCSV(csvPath);
formatOutreachMessages(targets);
