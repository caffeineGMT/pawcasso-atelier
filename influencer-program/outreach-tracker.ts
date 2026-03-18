/**
 * Daily Outreach Tracker
 *
 * Helps manage the daily outreach workflow:
 * - Track 20 DMs/day (10 Instagram, 10 TikTok)
 * - Generate personalized DM templates
 * - Log sent messages to database
 *
 * Usage:
 *   npx tsx influencer-program/outreach-tracker.ts
 */

interface DailyOutreachPlan {
  date: string;
  instagram: Array<{
    id: string;
    name: string;
    handle: string;
    followerCount: number;
    dmTemplate: string;
  }>;
  tiktok: Array<{
    id: string;
    name: string;
    handle: string;
    followerCount: number;
    dmTemplate: string;
  }>;
}

const getDMTemplate = (influencer: { name: string; handle: string; discountCode: string; affiliateLink: string }) => {
  const petName = influencer.name.split("'s")[0] || influencer.name;
  return `Hi ${influencer.handle}! Love ${petName}'s content 🐾 We make AI pet portraits and would love to send you a free one + feature you in our gallery. Interested?

You'll get:
✨ Free portrait in 3 styles
💰 20% discount code for your audience (${influencer.discountCode})
🎁 15% commission on all sales

Your affiliate link: ${influencer.affiliateLink}`;
};

async function generateDailyOutreachPlan(): Promise<DailyOutreachPlan> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // Fetch influencers that haven't been contacted yet
  const response = await fetch(`${API_BASE}/api/influencers?status=identified`);
  const data = await response.json();
  const influencers = data.influencers;

  // Split by platform
  const instagramInfluencers = influencers.filter((inf: any) => inf.platform === "instagram").slice(0, 10);
  const tiktokInfluencers = influencers.filter((inf: any) => inf.platform === "tiktok").slice(0, 10);

  return {
    date: new Date().toISOString().split("T")[0],
    instagram: instagramInfluencers.map((inf: any) => ({
      id: inf.id,
      name: inf.name,
      handle: inf.handle,
      followerCount: inf.followerCount,
      dmTemplate: getDMTemplate(inf),
    })),
    tiktok: tiktokInfluencers.map((inf: any) => ({
      id: inf.id,
      name: inf.name,
      handle: inf.handle,
      followerCount: inf.followerCount,
      dmTemplate: getDMTemplate(inf),
    })),
  };
}

async function logOutreachMessage(influencerId: string, message: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  await fetch(`${API_BASE}/api/influencers/${influencerId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}

// Main execution
if (require.main === module) {
  generateDailyOutreachPlan().then((plan) => {
    console.log("═══════════════════════════════════════════════════════");
    console.log(`📅 Daily Outreach Plan - ${plan.date}`);
    console.log("═══════════════════════════════════════════════════════\n");

    console.log("📸 INSTAGRAM (10 DMs)");
    console.log("───────────────────────────────────────────────────────");
    plan.instagram.forEach((inf, i) => {
      console.log(`\n${i + 1}. ${inf.name} (@${inf.handle}) - ${inf.followerCount.toLocaleString()} followers`);
      console.log(`ID: ${inf.id}`);
      console.log("\nDM Template:");
      console.log("─────────────────");
      console.log(inf.dmTemplate);
      console.log("─────────────────\n");
    });

    console.log("\n🎵 TIKTOK (10 DMs)");
    console.log("───────────────────────────────────────────────────────");
    plan.tiktok.forEach((inf, i) => {
      console.log(`\n${i + 1}. ${inf.name} (@${inf.handle}) - ${inf.followerCount.toLocaleString()} followers`);
      console.log(`ID: ${inf.id}`);
      console.log("\nDM Template:");
      console.log("─────────────────");
      console.log(inf.dmTemplate);
      console.log("─────────────────\n");
    });

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("📋 Next Steps:");
    console.log("1. Copy each DM template");
    console.log("2. Send DM on platform");
    console.log("3. Mark as 'contacted' in admin dashboard");
    console.log("4. Track responses within 48 hours");
    console.log("═══════════════════════════════════════════════════════\n");
  });
}

export { generateDailyOutreachPlan, logOutreachMessage };
