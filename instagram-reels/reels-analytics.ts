/**
 * Pawcasso Instagram Reels - Analytics Dashboard
 * Tracks progress toward 5,000 follower goal and 5% conversion rate.
 * Stores metrics in local JSON and generates daily/weekly reports.
 */

import * as fs from 'fs';
import * as path from 'path';

interface DailyMetrics {
  date: string;
  day: number;
  reelId: string;
  theme: string;
  hook: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  profileVisits: number;
  websiteClicks: number;
  newFollowers: number;
  unfollows: number;
  netFollowerGain: number;
  engagementRate: number;
  orders: number;
  revenue: number;
}

interface AnalyticsStore {
  account: string;
  startDate: string;
  goals: {
    followers90Days: number;
    conversionRate: number;
    targetCustomers: number;
    dailyFollowerTarget: number;
  };
  currentFollowers: number;
  totalRevenue: number;
  totalOrders: number;
  dailyMetrics: DailyMetrics[];
  weeklyReports: WeeklyReport[];
}

interface WeeklyReport {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  avgEngagementRate: number;
  bestPerformingReel: string;
  worstPerformingReel: string;
  netFollowerGain: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  recommendations: string[];
}

const ANALYTICS_FILE = path.join(__dirname, 'analytics-data.json');

function loadAnalytics(): AnalyticsStore {
  if (fs.existsSync(ANALYTICS_FILE)) {
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
  }
  return {
    account: '@pawcasso.atelier',
    startDate: '2026-03-19',
    goals: {
      followers90Days: 5000,
      conversionRate: 0.05,
      targetCustomers: 250,
      dailyFollowerTarget: 56, // 5000 / 90 days
    },
    currentFollowers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    dailyMetrics: [],
    weeklyReports: [],
  };
}

function saveAnalytics(store: AnalyticsStore): void {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(store, null, 2));
}

function logDailyMetrics(metrics: Partial<DailyMetrics>): void {
  const store = loadAnalytics();

  const day: DailyMetrics = {
    date: metrics.date || new Date().toISOString().split('T')[0],
    day: metrics.day || store.dailyMetrics.length + 1,
    reelId: metrics.reelId || `reel_day${store.dailyMetrics.length + 1}`,
    theme: metrics.theme || 'unknown',
    hook: metrics.hook || '',
    views: metrics.views || 0,
    likes: metrics.likes || 0,
    comments: metrics.comments || 0,
    shares: metrics.shares || 0,
    saves: metrics.saves || 0,
    reach: metrics.reach || 0,
    impressions: metrics.impressions || 0,
    profileVisits: metrics.profileVisits || 0,
    websiteClicks: metrics.websiteClicks || 0,
    newFollowers: metrics.newFollowers || 0,
    unfollows: metrics.unfollows || 0,
    netFollowerGain: (metrics.newFollowers || 0) - (metrics.unfollows || 0),
    engagementRate: 0,
    orders: metrics.orders || 0,
    revenue: metrics.revenue || 0,
  };

  if (day.views > 0) {
    day.engagementRate = ((day.likes + day.comments + day.shares + day.saves) / day.views) * 100;
  }

  // Update totals
  store.currentFollowers += day.netFollowerGain;
  store.totalRevenue += day.revenue;
  store.totalOrders += day.orders;
  store.dailyMetrics.push(day);

  saveAnalytics(store);
  console.log(`Logged metrics for ${day.date} (Day ${day.day})`);
}

function generateWeeklyReport(weekNumber: number): WeeklyReport {
  const store = loadAnalytics();
  const startIdx = (weekNumber - 1) * 7;
  const endIdx = Math.min(startIdx + 7, store.dailyMetrics.length);
  const weekData = store.dailyMetrics.slice(startIdx, endIdx);

  if (weekData.length === 0) {
    throw new Error(`No data for week ${weekNumber}`);
  }

  const totalViews = weekData.reduce((s, d) => s + d.views, 0);
  const totalLikes = weekData.reduce((s, d) => s + d.likes, 0);
  const totalComments = weekData.reduce((s, d) => s + d.comments, 0);
  const totalShares = weekData.reduce((s, d) => s + d.shares, 0);
  const totalSaves = weekData.reduce((s, d) => s + d.saves, 0);
  const avgEngagement = weekData.reduce((s, d) => s + d.engagementRate, 0) / weekData.length;
  const netFollowers = weekData.reduce((s, d) => s + d.netFollowerGain, 0);
  const totalOrders = weekData.reduce((s, d) => s + d.orders, 0);
  const totalRevenue = weekData.reduce((s, d) => s + d.revenue, 0);

  const sorted = [...weekData].sort((a, b) => b.engagementRate - a.engagementRate);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const websiteClicks = weekData.reduce((s, d) => s + d.websiteClicks, 0);
  const conversionRate = websiteClicks > 0 ? (totalOrders / websiteClicks) * 100 : 0;

  // Generate recommendations
  const recommendations: string[] = [];
  if (avgEngagement < 3) {
    recommendations.push('Engagement rate below 3%. Try more interactive hooks (polls, questions, "this or that").');
  }
  if (avgEngagement >= 5) {
    recommendations.push('Engagement rate above 5%! Consider boosting top-performing Reels with $20-50 ad spend.');
  }
  if (netFollowers < store.goals.dailyFollowerTarget * 7) {
    recommendations.push(`Follower growth below target (${netFollowers} vs ${store.goals.dailyFollowerTarget * 7} needed). Increase collaboration and cross-promotion.`);
  }
  if (totalSaves > totalShares * 2) {
    recommendations.push('High save-to-share ratio indicates educational/valuable content. Create more "save-worthy" Reels.');
  }
  if (best && best.theme) {
    recommendations.push(`Best theme this week: ${best.theme} (${best.engagementRate.toFixed(1)}% engagement). Schedule more of this type.`);
  }
  if (worst && worst.theme && worst.engagementRate < 2) {
    recommendations.push(`Underperforming theme: ${worst.theme} (${worst.engagementRate.toFixed(1)}%). Consider replacing with proven themes.`);
  }
  if (conversionRate < 3) {
    recommendations.push('Low conversion rate. Strengthen CTAs and ensure link-in-bio is optimized.');
  }

  const report: WeeklyReport = {
    weekNumber,
    startDate: weekData[0].date,
    endDate: weekData[weekData.length - 1].date,
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    totalSaves,
    avgEngagementRate: Math.round(avgEngagement * 100) / 100,
    bestPerformingReel: `Day ${best.day}: ${best.hook} (${best.engagementRate.toFixed(1)}%)`,
    worstPerformingReel: `Day ${worst.day}: ${worst.hook} (${worst.engagementRate.toFixed(1)}%)`,
    netFollowerGain: netFollowers,
    totalOrders,
    totalRevenue,
    conversionRate: Math.round(conversionRate * 100) / 100,
    recommendations,
  };

  // Save report
  store.weeklyReports.push(report);
  saveAnalytics(store);

  return report;
}

function printDashboard(): void {
  const store = loadAnalytics();
  const daysElapsed = store.dailyMetrics.length;
  const totalViews = store.dailyMetrics.reduce((s, d) => s + d.views, 0);
  const totalEngagement = store.dailyMetrics.reduce((s, d) => s + d.likes + d.comments + d.shares + d.saves, 0);
  const avgEngagement = daysElapsed > 0
    ? store.dailyMetrics.reduce((s, d) => s + d.engagementRate, 0) / daysElapsed
    : 0;

  const followerProgress = store.goals.followers90Days > 0
    ? (store.currentFollowers / store.goals.followers90Days) * 100
    : 0;

  const daysRemaining = 90 - daysElapsed;
  const followersNeeded = store.goals.followers90Days - store.currentFollowers;
  const dailyRate = daysRemaining > 0 ? followersNeeded / daysRemaining : 0;

  console.log('');
  console.log('='.repeat(64));
  console.log('  PAWCASSO INSTAGRAM REELS - ANALYTICS DASHBOARD');
  console.log('='.repeat(64));
  console.log('');
  console.log(`  Account: ${store.account}`);
  console.log(`  Campaign Start: ${store.startDate}`);
  console.log(`  Days Active: ${daysElapsed} / 90`);
  console.log('');
  console.log('  --- FOLLOWER GROWTH ---');
  console.log(`  Current Followers:  ${store.currentFollowers.toLocaleString()}`);
  console.log(`  90-Day Goal:        ${store.goals.followers90Days.toLocaleString()}`);
  console.log(`  Progress:           ${followerProgress.toFixed(1)}%`);
  console.log(`  Daily Rate Needed:  ${Math.ceil(dailyRate)} followers/day`);
  console.log(`  Progress Bar:       [${'#'.repeat(Math.floor(followerProgress / 5))}${'.'.repeat(20 - Math.floor(followerProgress / 5))}]`);
  console.log('');
  console.log('  --- ENGAGEMENT ---');
  console.log(`  Total Views:        ${totalViews.toLocaleString()}`);
  console.log(`  Total Engagement:   ${totalEngagement.toLocaleString()}`);
  console.log(`  Avg Engagement:     ${avgEngagement.toFixed(2)}%`);
  console.log('');
  console.log('  --- REVENUE ---');
  console.log(`  Total Orders:       ${store.totalOrders}`);
  console.log(`  Total Revenue:      $${store.totalRevenue.toFixed(2)}`);
  console.log(`  Conversion Rate:    ${store.totalOrders > 0 && store.currentFollowers > 0 ? ((store.totalOrders / store.currentFollowers) * 100).toFixed(2) : '0.00'}%`);
  console.log(`  Target:             ${store.goals.targetCustomers} customers (5% of ${store.goals.followers90Days})`);
  console.log('');

  if (store.dailyMetrics.length > 0) {
    console.log('  --- RECENT PERFORMANCE (Last 7 Days) ---');
    const recent = store.dailyMetrics.slice(-7);
    for (const day of recent) {
      const bar = '#'.repeat(Math.min(Math.floor(day.engagementRate), 20));
      console.log(`  Day ${String(day.day).padStart(2)}: ${day.views.toLocaleString().padStart(8)} views | ${day.engagementRate.toFixed(1).padStart(5)}% ${bar}`);
    }
  }

  console.log('');
  console.log('='.repeat(64));
}

// CLI execution
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'log': {
      const args = process.argv.slice(3);
      if (args.length < 5) {
        console.log('Usage: tsx reels-analytics.ts log <views> <likes> <comments> <shares> <saves> [followers] [orders] [revenue]');
        process.exit(1);
      }
      logDailyMetrics({
        views: parseInt(args[0]),
        likes: parseInt(args[1]),
        comments: parseInt(args[2]),
        shares: parseInt(args[3]),
        saves: parseInt(args[4]),
        newFollowers: parseInt(args[5] || '0'),
        orders: parseInt(args[6] || '0'),
        revenue: parseFloat(args[7] || '0'),
      });
      printDashboard();
      break;
    }

    case 'report': {
      const week = parseInt(process.argv[3] || '1');
      try {
        const report = generateWeeklyReport(week);
        console.log(`\nWeekly Report - Week ${report.weekNumber}`);
        console.log('='.repeat(60));
        console.log(`Period: ${report.startDate} to ${report.endDate}`);
        console.log(`Views: ${report.totalViews.toLocaleString()}`);
        console.log(`Engagement Rate: ${report.avgEngagementRate}%`);
        console.log(`Net Followers: +${report.netFollowerGain}`);
        console.log(`Orders: ${report.totalOrders}`);
        console.log(`Revenue: $${report.totalRevenue.toFixed(2)}`);
        console.log(`\nBest Reel: ${report.bestPerformingReel}`);
        console.log(`Worst Reel: ${report.worstPerformingReel}`);
        console.log(`\nRecommendations:`);
        report.recommendations.forEach(r => console.log(`  - ${r}`));
      } catch (e: any) {
        console.log(e.message);
      }
      break;
    }

    case 'dashboard':
    default:
      printDashboard();
      break;
  }
}

export {
  loadAnalytics,
  logDailyMetrics,
  generateWeeklyReport,
  printDashboard,
  DailyMetrics,
  AnalyticsStore,
  WeeklyReport,
};
