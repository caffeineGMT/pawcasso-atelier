/**
 * Pawcasso Instagram Reels - Engagement Automation Bot
 * Monitors comments and generates responses within 1-hour window.
 * Integrates with Instagram Graph API for comment tracking.
 *
 * IMPORTANT: This bot generates suggested replies for human review.
 * All responses should be approved before posting (human-in-the-loop).
 */

import * as fs from 'fs';
import * as path from 'path';

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  postId: string;
  replied: boolean;
  suggestedReply: string;
  replyApproved: boolean;
  category: CommentCategory;
}

type CommentCategory =
  | 'breed_mention'
  | 'price_inquiry'
  | 'style_question'
  | 'compliment'
  | 'pet_memorial'
  | 'order_intent'
  | 'influencer_collab'
  | 'negative'
  | 'spam'
  | 'general';

interface EngagementMetrics {
  date: string;
  postId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reaches: number;
  impressions: number;
  engagementRate: number;
  followerGain: number;
}

interface EngagementReport {
  generatedAt: string;
  totalPosts: number;
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  followerCount: number;
  followerGoal: number;
  followerProgress: number;
  conversionRate: number;
  topPerformingPosts: EngagementMetrics[];
  commentQueue: Comment[];
  dailyMetrics: EngagementMetrics[];
}

// Response templates by category
const RESPONSE_TEMPLATES: Record<CommentCategory, string[]> = {
  breed_mention: [
    "A {breed}! They'd look AMAZING in {style} style. Link in bio to try it!",
    "We LOVE {breed}s! Just made one in Pixar 3D style yesterday. Check it out!",
    "{breed}s are perfect for the {style} treatment. Drop us a DM if you want one!",
    "Such a great breed! We've done so many {breed} portraits. Your pup would look incredible!",
  ],
  price_inquiry: [
    "All styles are just $9! And you get it delivered in 24 hours. Link in bio!",
    "$9 per portrait, any style you want! Hit the link in our bio to get started.",
    "Great question! It's $9 for any style, and delivery is within 24 hours.",
    "Super affordable - just $9! We wanted everyone to be able to get museum-quality pet art.",
  ],
  style_question: [
    "We have 7 styles: Renaissance, Pixar 3D, Needle Felt, Pixel Art, Ink Wash, Chinese Classical, and Vinyl Toy! Which one catches your eye?",
    "Great taste! The {style} style is one of our most popular. Check our highlights for all the styles!",
    "All 7 styles are available on our website! Just upload your pet photo and pick your favorite.",
    "We're always adding new styles! Currently we have 7 - Renaissance, Pixar 3D, Felt, Pixel Art, Ink Wash, Classical, and Vinyl Toy.",
  ],
  compliment: [
    "Thank you so much! We put a lot of love into every portrait!",
    "That means the world to us! Would you like one for your pet?",
    "Aww thanks! The AI really captures each pet's personality, right?",
    "You're so sweet! We think every pet deserves to be immortalized in art!",
    "Thank you! Share this with someone whose pet needs the royal treatment!",
  ],
  pet_memorial: [
    "We're so sorry for your loss. A portrait is a beautiful way to remember your fur baby forever. DM us if you'd like to talk about creating one.",
    "Sending love to you. We've had so many people tell us how much a memorial portrait means to them. We're here if you need us.",
    "Our hearts go out to you. We'd be honored to create a special tribute portrait. Take your time, and reach out when you're ready.",
    "What a beautiful way to honor their memory. We treat every memorial portrait with extra care and love.",
  ],
  order_intent: [
    "Let's do it! Head to the link in our bio and upload your pet's photo. You'll have your portrait in 24 hours!",
    "Yes! Just click the link in our bio, pick your style, and upload a photo. We'll have it ready in 24 hours!",
    "Amazing! You're going to love it. Link in bio to get started - it takes less than 60 seconds to order!",
    "So exciting! Just upload your pet photo at the link in our bio. Pro tip: the Pixar 3D style is our most popular!",
  ],
  influencer_collab: [
    "We'd love to chat about a collaboration! Drop us a DM with your details!",
    "Sounds great! We love working with pet creators. DM us and let's make something awesome!",
    "Hey! We'd be happy to send you a free portrait to try. DM us your pet photo!",
    "Collaborations are our favorite! Check your DMs - we'd love to set something up!",
  ],
  negative: [
    "We appreciate your feedback! If there's something specific we can improve, please DM us. We want every portrait to be perfect.",
    "Sorry to hear that! We'd love to make it right. Please reach out via DM and we'll take care of you.",
    "Thank you for sharing your thoughts. Quality is really important to us - please DM us so we can help!",
  ],
  spam: [], // Don't respond to spam
  general: [
    "Thanks for the comment! Check out the link in our bio for more!",
    "We love our community! Stay tuned for more pet art content.",
    "Appreciate you being here! Follow us for daily pet art inspiration!",
    "Thanks for watching! Which style is your favorite?",
  ],
};

function categorizeComment(text: string): CommentCategory {
  const lower = text.toLowerCase();

  // Check for spam patterns
  if (lower.match(/(follow me|check my|free followers|dm for|earn money|click here)/)) {
    return 'spam';
  }

  // Check for memorial/loss
  if (lower.match(/(passed|lost|rainbow bridge|heaven|miss|rip|memorial|in memory|gone|angel)/)) {
    return 'pet_memorial';
  }

  // Check for order intent
  if (lower.match(/(want one|need this|how do i order|take my money|buying|order|get one|mine|i need|shut up and take)/)) {
    return 'order_intent';
  }

  // Check for collaboration
  if (lower.match(/(collab|collaboration|partner|ambassador|influencer|sponsor|pr|work together)/)) {
    return 'influencer_collab';
  }

  // Check for price inquiry
  if (lower.match(/(how much|price|cost|expensive|cheap|afford|pay|dollar|\$|pricing)/)) {
    return 'price_inquiry';
  }

  // Check for style question
  if (lower.match(/(style|which one|option|type|renaissance|pixar|felt|pixel|ink|vinyl|chinese)/)) {
    return 'style_question';
  }

  // Check for breed mention
  const breeds = [
    'golden retriever', 'labrador', 'poodle', 'bulldog', 'german shepherd',
    'husky', 'corgi', 'shiba', 'chihuahua', 'pomeranian', 'border collie',
    'beagle', 'dachshund', 'rottweiler', 'pitbull', 'maltese', 'yorkie',
    'persian', 'siamese', 'maine coon', 'ragdoll', 'british shorthair',
    'tabby', 'calico', 'bengal', 'sphynx', 'scottish fold',
    'my dog', 'my cat', 'my puppy', 'my kitten', 'my pup',
  ];
  if (breeds.some(breed => lower.includes(breed))) {
    return 'breed_mention';
  }

  // Check for negative sentiment
  if (lower.match(/(bad|ugly|terrible|awful|hate|worst|scam|fake|ripoff|not worth)/)) {
    return 'negative';
  }

  // Check for compliments
  if (lower.match(/(amazing|beautiful|gorgeous|stunning|incredible|love|awesome|perfect|wow|omg|cute|adorable|fire|sick)/)) {
    return 'compliment';
  }

  return 'general';
}

function generateReply(comment: Comment): string {
  if (comment.category === 'spam') return '';

  const templates = RESPONSE_TEMPLATES[comment.category];
  if (!templates || templates.length === 0) return '';

  const template = templates[Math.floor(Math.random() * templates.length)];

  // Replace placeholders
  let reply = template
    .replace('{breed}', extractBreed(comment.text) || 'your pet')
    .replace('{style}', extractStyle(comment.text) || 'Pixar 3D');

  // Personalize with username
  if (Math.random() > 0.5) {
    reply = `@${comment.username} ${reply}`;
  }

  return reply;
}

function extractBreed(text: string): string | null {
  const lower = text.toLowerCase();
  const breeds: Record<string, string> = {
    'golden': 'Golden Retriever',
    'labrador': 'Labrador',
    'poodle': 'Poodle',
    'bulldog': 'Bulldog',
    'german shepherd': 'German Shepherd',
    'husky': 'Husky',
    'corgi': 'Corgi',
    'shiba': 'Shiba Inu',
    'chihuahua': 'Chihuahua',
    'pomeranian': 'Pomeranian',
    'border collie': 'Border Collie',
    'beagle': 'Beagle',
    'dachshund': 'Dachshund',
  };

  for (const [key, value] of Object.entries(breeds)) {
    if (lower.includes(key)) return value;
  }
  return null;
}

function extractStyle(text: string): string | null {
  const lower = text.toLowerCase();
  const styles: Record<string, string> = {
    'renaissance': 'Renaissance',
    'pixar': 'Pixar 3D',
    'felt': 'Needle Felt',
    'pixel': 'Pixel Art',
    'ink': 'Ink Wash',
    'chinese': 'Chinese Classical',
    'vinyl': 'Vinyl Toy',
  };

  for (const [key, value] of Object.entries(styles)) {
    if (lower.includes(key)) return value;
  }
  return null;
}

function processCommentQueue(comments: Comment[]): Comment[] {
  return comments.map(comment => {
    comment.category = categorizeComment(comment.text);
    comment.suggestedReply = generateReply(comment);
    return comment;
  });
}

function calculateEngagementRate(metrics: EngagementMetrics): number {
  if (metrics.views === 0) return 0;
  return ((metrics.likes + metrics.comments + metrics.shares + metrics.saves) / metrics.views) * 100;
}

function generateEngagementReport(metrics: EngagementMetrics[], comments: Comment[]): EngagementReport {
  const totalViews = metrics.reduce((sum, m) => sum + m.views, 0);
  const totalEngagement = metrics.reduce((sum, m) => sum + m.likes + m.comments + m.shares + m.saves, 0);
  const avgEngagementRate = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length
    : 0;

  const sorted = [...metrics].sort((a, b) => b.engagementRate - a.engagementRate);

  return {
    generatedAt: new Date().toISOString(),
    totalPosts: metrics.length,
    totalViews,
    totalEngagement,
    avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
    followerCount: 0, // Pulled from Instagram API
    followerGoal: 5000,
    followerProgress: 0,
    conversionRate: 0, // Calculated from Stripe data
    topPerformingPosts: sorted.slice(0, 5),
    commentQueue: comments.filter(c => !c.replied && c.category !== 'spam'),
    dailyMetrics: metrics,
  };
}

// CLI execution
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'categorize': {
      // Categorize a test comment
      const testComment = process.argv[3] || 'I have a golden retriever, can I get one?';
      const category = categorizeComment(testComment);
      const comment: Comment = {
        id: 'test',
        username: 'testuser',
        text: testComment,
        timestamp: new Date().toISOString(),
        postId: 'test_post',
        replied: false,
        suggestedReply: '',
        replyApproved: false,
        category,
      };
      comment.suggestedReply = generateReply(comment);

      console.log('Comment Categorization Test');
      console.log('='.repeat(60));
      console.log(`Input: "${testComment}"`);
      console.log(`Category: ${category}`);
      console.log(`Suggested Reply: ${comment.suggestedReply}`);
      break;
    }

    case 'demo': {
      // Demo with sample comments
      const sampleComments: Comment[] = [
        { id: '1', username: 'dogmom_sarah', text: 'OMG this is so cute! I need one for my golden retriever', timestamp: new Date().toISOString(), postId: 'day1', replied: false, suggestedReply: '', replyApproved: false, category: 'general' },
        { id: '2', username: 'petlover99', text: 'How much does this cost?', timestamp: new Date().toISOString(), postId: 'day1', replied: false, suggestedReply: '', replyApproved: false, category: 'general' },
        { id: '3', username: 'artstyle_fan', text: 'Do you have a Renaissance style?', timestamp: new Date().toISOString(), postId: 'day2', replied: false, suggestedReply: '', replyApproved: false, category: 'general' },
        { id: '4', username: 'memorial_mom', text: 'My baby crossed the rainbow bridge last month. This would be perfect.', timestamp: new Date().toISOString(), postId: 'day5', replied: false, suggestedReply: '', replyApproved: false, category: 'general' },
        { id: '5', username: 'shutupandtake', text: 'Take my money! I want one NOW', timestamp: new Date().toISOString(), postId: 'day3', replied: false, suggestedReply: '', replyApproved: false, category: 'general' },
        { id: '6', username: 'petinfluencer_10k', text: 'Love this! Would you be interested in a collab?', timestamp: new Date().toISOString(), postId: 'day4', replied: false, suggestedReply: '', replyApproved: false, category: 'general' },
        { id: '7', username: 'spambot123', text: 'Check my page for free followers!!!', timestamp: new Date().toISOString(), postId: 'day1', replied: false, suggestedReply: '', replyApproved: false, category: 'general' },
        { id: '8', username: 'corgi_dad', text: 'My corgi would look amazing as pixel art!', timestamp: new Date().toISOString(), postId: 'day8', replied: false, suggestedReply: '', replyApproved: false, category: 'general' },
      ];

      const processed = processCommentQueue(sampleComments);

      console.log('Engagement Bot - Comment Processing Demo');
      console.log('='.repeat(60));
      console.log('');

      for (const comment of processed) {
        console.log(`@${comment.username}: "${comment.text}"`);
        console.log(`  Category: ${comment.category}`);
        if (comment.suggestedReply) {
          console.log(`  Suggested Reply: ${comment.suggestedReply}`);
        } else {
          console.log(`  Action: Skip (spam)`);
        }
        console.log('');
      }

      const nonSpam = processed.filter(c => c.category !== 'spam');
      console.log(`Total comments: ${processed.length}`);
      console.log(`Actionable: ${nonSpam.length}`);
      console.log(`Spam filtered: ${processed.length - nonSpam.length}`);
      console.log(`High priority (orders/memorials): ${processed.filter(c => ['order_intent', 'pet_memorial'].includes(c.category)).length}`);
      break;
    }

    case 'report': {
      // Generate sample engagement report
      const sampleMetrics: EngagementMetrics[] = Array.from({ length: 7 }, (_, i) => ({
        date: `2026-03-${19 + i}`,
        postId: `day${i + 1}`,
        views: Math.floor(Math.random() * 50000) + 5000,
        likes: Math.floor(Math.random() * 3000) + 200,
        comments: Math.floor(Math.random() * 200) + 10,
        shares: Math.floor(Math.random() * 500) + 50,
        saves: Math.floor(Math.random() * 800) + 100,
        reaches: Math.floor(Math.random() * 40000) + 4000,
        impressions: Math.floor(Math.random() * 60000) + 6000,
        engagementRate: 0,
        followerGain: Math.floor(Math.random() * 200) + 20,
      }));

      sampleMetrics.forEach(m => {
        m.engagementRate = calculateEngagementRate(m);
      });

      const report = generateEngagementReport(sampleMetrics, []);

      console.log('Engagement Report');
      console.log('='.repeat(60));
      console.log(`Total Posts: ${report.totalPosts}`);
      console.log(`Total Views: ${report.totalViews.toLocaleString()}`);
      console.log(`Total Engagement: ${report.totalEngagement.toLocaleString()}`);
      console.log(`Avg Engagement Rate: ${report.avgEngagementRate}%`);
      console.log(`Follower Goal: ${report.followerGoal}`);
      console.log('');
      console.log('Top Performing Posts:');
      report.topPerformingPosts.forEach((post, i) => {
        console.log(`  ${i + 1}. ${post.postId} - ${post.views.toLocaleString()} views, ${post.engagementRate.toFixed(2)}% engagement`);
      });
      break;
    }

    default:
      console.log('Pawcasso Engagement Bot - Commands:');
      console.log('  categorize "<comment text>"  - Categorize a single comment');
      console.log('  demo                         - Run demo with sample comments');
      console.log('  report                       - Generate sample engagement report');
  }
}

export {
  categorizeComment,
  generateReply,
  processCommentQueue,
  calculateEngagementRate,
  generateEngagementReport,
  Comment,
  CommentCategory,
  EngagementMetrics,
  EngagementReport,
};
