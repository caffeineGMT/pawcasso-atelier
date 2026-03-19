#!/usr/bin/env tsx

/**
 * Sync Instagram content from website/public/ig-queue to GitHub Pages ig-review/
 * Generates content.json manifest and individual review pages
 */

import * as fs from 'fs';
import * as path from 'path';

// Get the project root (parent of scripts/)
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'website', 'public', 'ig-queue');
const TARGET_DIR = path.join(PROJECT_ROOT, 'ig-review');

interface ContentItem {
  id: string;
  date: string;
  contentType: string;
  title: string;
  description: string;
  animal: string;
  breed: string;
  style: string;
  concept: string;
  specialInstructions: string;
  captions: Array<{
    tone: string;
    toneName: string;
    toneEmoji: string;
    text: string;
    hook: string;
  }>;
  hashtags: string[];
  bestPostingTime: {
    time: string;
    timezone: string;
    reasoning: string;
  };
  n8nPayload: Record<string, string>;
  reviewUrl: string;
  status: string;
  generatedAt: string;
}

interface ManifestData {
  items: ContentItem[];
  lastUpdated: string;
  totalCount: number;
}

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    'pending_generation': 'status-pending-generation',
    'pending_review': 'status-pending-review',
    'approved': 'status-approved',
    'posted': 'status-posted'
  };
  return statusMap[status] || 'status-pending-generation';
}

function getStatusText(status: string): string {
  return status.replace('_', ' ').toUpperCase();
}

function generateReviewPage(item: ContentItem): string {
  const hashtags = item.hashtags.join(' ');
  const n8nFormUrl = 'https://n8n.aws.metafb.cloud/form/8ae3cd62-13ea-4c8a-9ffc-2c1148783ee2';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>${item.title} — IG Content Review</title>
  <meta name="description" content="${item.description}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg-primary: #000000;
      --bg-secondary: #0a0a0a;
      --bg-card: #141414;
      --bg-card-hover: #1a1a1a;
      --border-primary: #252525;
      --border-hover: #333333;
      --text-primary: #ffffff;
      --text-secondary: #e5e5e5;
      --text-tertiary: #aaaaaa;
      --text-muted: #666666;
      --accent-green: #22c55e;
      --accent-blue: #60a5fa;
      --accent-yellow: #fbbf24;
      --accent-purple: #a78bfa;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-secondary);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      padding-bottom: 40px;
    }

    .header {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-primary);
      padding: 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--accent-blue);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .back-btn:hover {
      gap: 12px;
    }

    .container {
      max-width: 640px;
      margin: 0 auto;
      padding: 24px 20px;
    }

    .title-section {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 12px;
      line-height: 1.2;
    }

    .meta-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 16px;
      text-transform: uppercase;
    }

    .status-pending-generation {
      background: rgba(30, 58, 138, 0.2);
      color: var(--accent-blue);
      border: 1px solid rgba(96, 165, 250, 0.3);
    }

    .section {
      background: var(--bg-card);
      border: 1px solid var(--border-primary);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .concept-text {
      font-size: 16px;
      line-height: 1.7;
      color: var(--text-secondary);
    }

    .info-grid {
      display: grid;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .caption-variant {
      background: var(--bg-secondary);
      border: 2px solid var(--border-primary);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      transition: all 0.3s;
      cursor: pointer;
    }

    .caption-variant:hover {
      border-color: var(--accent-blue);
      transform: translateY(-2px);
    }

    .caption-variant.copied {
      border-color: var(--accent-green);
      background: rgba(34, 197, 94, 0.05);
    }

    .caption-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .caption-tone {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .copy-btn {
      padding: 6px 12px;
      background: var(--accent-blue);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .copy-btn:hover {
      background: var(--accent-green);
      transform: scale(1.05);
    }

    .caption-text {
      font-size: 15px;
      line-height: 1.7;
      color: var(--text-secondary);
      white-space: pre-wrap;
    }

    .hashtags-container {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: 12px;
      padding: 16px;
      font-size: 13px;
      line-height: 1.8;
      color: var(--accent-blue);
      word-wrap: break-word;
      cursor: pointer;
      transition: all 0.2s;
    }

    .hashtags-container:hover {
      border-color: var(--accent-blue);
    }

    .posting-time-card {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .posting-time-value {
      font-size: 32px;
      font-weight: 800;
      color: var(--accent-green);
      margin-bottom: 8px;
    }

    .posting-time-label {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .posting-time-reasoning {
      font-size: 14px;
      color: var(--text-tertiary);
      font-style: italic;
    }

    .action-btn {
      display: block;
      width: 100%;
      padding: 18px;
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 24px;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(96, 165, 250, 0.4);
    }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--accent-green);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      opacity: 0;
      transition: all 0.3s;
      z-index: 1000;
    }

    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    @media (max-width: 480px) {
      .page-title { font-size: 24px; }
      .section { padding: 20px 16px; }
      .caption-variant { padding: 16px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <a href="index.html" class="back-btn">← Back to Dashboard</a>
  </div>

  <div class="container">
    <div class="title-section">
      <h1 class="page-title">${item.title}</h1>
      <div class="meta-row">
        <span class="meta-item">📅 ${item.date}</span>
        <span class="meta-item">🎨 ${item.contentType.replace('_', ' ')}</span>
        <span class="status-badge ${getStatusBadgeClass(item.status)}">${getStatusText(item.status)}</span>
      </div>
      <p class="concept-text">${item.description}</p>
    </div>

    <!-- Concept Details -->
    <div class="section">
      <div class="section-title">📋 Content Spec</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Animal</div>
          <div class="info-value">${item.animal}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Breed</div>
          <div class="info-value">${item.breed}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Art Style</div>
          <div class="info-value">${item.style}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Concept</div>
          <div class="info-value">${item.concept}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Special Instructions</div>
          <div class="info-value">${item.specialInstructions}</div>
        </div>
      </div>
    </div>

    <!-- Caption Variants -->
    <div class="section">
      <div class="section-title">✍️ Caption Variants (Pick One)</div>
      ${item.captions.map((caption, idx) => `
        <div class="caption-variant" data-caption-index="${idx}">
          <div class="caption-header">
            <div class="caption-tone">
              <span>${caption.toneEmoji}</span>
              <span>${caption.toneName}</span>
            </div>
            <button class="copy-btn" onclick="copyCaption(${idx})">Copy</button>
          </div>
          <div class="caption-text">${caption.text}</div>
        </div>
      `).join('')}
    </div>

    <!-- Hashtags -->
    <div class="section">
      <div class="section-title">🏷️ Hashtags (Click to Copy)</div>
      <div class="hashtags-container" onclick="copyHashtags()">
        ${hashtags}
      </div>
    </div>

    <!-- Posting Time -->
    <div class="section">
      <div class="section-title">⏰ Best Posting Time</div>
      <div class="posting-time-card">
        <div class="posting-time-value">${item.bestPostingTime.time}</div>
        <div class="posting-time-label">${item.bestPostingTime.timezone}</div>
        <div class="posting-time-reasoning">${item.bestPostingTime.reasoning}</div>
      </div>
    </div>

    <!-- Generate Button -->
    <a href="${n8nFormUrl}" target="_blank" class="action-btn">
      🎨 Generate Image via n8n
    </a>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="toast"></div>

  <script>
    const item = ${JSON.stringify(item)};

    function copyCaption(index) {
      const caption = item.captions[index];
      const hashtags = item.hashtags.join(' ');
      const fullText = caption.text + '\\n\\n' + hashtags;

      copyToClipboard(fullText);

      // Visual feedback
      document.querySelectorAll('.caption-variant').forEach(el => {
        el.classList.remove('copied');
      });
      document.querySelector(\`[data-caption-index="\${index}"]\`).classList.add('copied');

      showToast(\`✅ Copied \${caption.toneName} caption + hashtags!\`);
    }

    function copyHashtags() {
      const hashtags = item.hashtags.join(' ');
      copyToClipboard(hashtags);
      showToast('✅ Hashtags copied!');
    }

    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  </script>
</body>
</html>`;
}

function syncContent() {
  console.log('🔄 Syncing Instagram content to GitHub Pages...\n');

  // Ensure target directory exists
  ensureDirectoryExists(TARGET_DIR);

  // Check if source directory exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    console.log('💡 Run "npm run ig:daily" first to generate content\n');
    process.exit(1);
  }

  // Read all JSON files from source
  const files = fs.readdirSync(SOURCE_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.log('⚠️  No content files found. Run "npm run ig:daily" to generate content.\n');

    // Create empty manifest
    const emptyManifest: ManifestData = {
      items: [],
      lastUpdated: new Date().toISOString(),
      totalCount: 0
    };

    fs.writeFileSync(
      path.join(TARGET_DIR, 'content.json'),
      JSON.stringify(emptyManifest, null, 2)
    );

    console.log('✅ Created empty manifest\n');
    return;
  }

  const contentItems: ContentItem[] = [];

  // Process each JSON file
  for (const jsonFile of jsonFiles) {
    try {
      const sourcePath = path.join(SOURCE_DIR, jsonFile);
      const content = fs.readFileSync(sourcePath, 'utf-8');
      const item: ContentItem = JSON.parse(content);

      contentItems.push(item);

      // Generate individual review page
      const reviewPageHtml = generateReviewPage(item);
      const reviewPagePath = path.join(TARGET_DIR, `${item.id}.html`);
      fs.writeFileSync(reviewPagePath, reviewPageHtml);

      console.log(`✅ Generated review page: ${item.id}.html`);
    } catch (error) {
      console.error(`❌ Error processing ${jsonFile}:`, error);
    }
  }

  // Sort by date (newest first)
  contentItems.sort((a, b) => {
    return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
  });

  // Create manifest
  const manifest: ManifestData = {
    items: contentItems,
    lastUpdated: new Date().toISOString(),
    totalCount: contentItems.length
  };

  const manifestPath = path.join(TARGET_DIR, 'content.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n✅ Synced ${contentItems.length} content items`);
  console.log(`📁 Output directory: ${TARGET_DIR}`);
  console.log(`🌐 Dashboard: ${path.join(TARGET_DIR, 'index.html')}\n`);
}

// Run sync
syncContent();
