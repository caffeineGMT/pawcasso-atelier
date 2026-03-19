# CLAUDE.md

## DEPLOYMENT RULES

### REQUIRED WORKFLOW (Engineers must follow this exactly):
1. **Write code** - Make your changes
2. **Run `npm run build`** - Verify zero errors (REQUIRED before committing)
3. **Fix any errors** - Address all build errors before proceeding
4. **Commit and push to GitHub** - `git add -A && git commit -m "..." && git push origin main`
5. **Preview deployed automatically** - GitHub Actions deploys to GitHub Pages for preview

### CRITICAL RESTRICTIONS:
- ❌ **NEVER deploy to Vercel** - Do NOT run `vercel`, `vercel deploy`, or any Vercel CLI commands
- ❌ **NEVER auto-deploy to any hosting platform** - No Netlify, no Railway, no Render, nothing
- ✅ **GitHub is the staging environment** - Push all code to GitHub
- ✅ **Production deployment is manual** - Michael will deploy to production when ready

### WHY THIS WORKFLOW:
- **GitHub = Staging**: All code pushed to GitHub is for staging/review only
- **Production control**: Michael maintains full control over what goes live and when
- **Build verification**: Running `npm run build` catches errors before they reach staging
- **Zero auto-deploy**: Prevents accidental production releases

---

## GITHUB PAGES PREVIEW (STAGING)

### Automated Deployment
When you push to `main`, GitHub Actions automatically:
1. Builds the Next.js site as a static export (`output: 'export'`)
2. Syncs Instagram review content (if available)
3. Deploys to GitHub Pages at: **https://caffeinegmt.github.io/pawcasso-atelier/**

### Configuration Files
- **Workflow:** `.github/workflows/deploy-preview.yml`
- **Next.js Config:** `website/next.config.ts` (uses `GITHUB_PAGES=true` env var)
- **Base Path:** `/pawcasso-atelier/` (required for GitHub Pages)

### Preview URLs
- **Main Site:** https://caffeinegmt.github.io/pawcasso-atelier/
- **IG Review Dashboard:** https://caffeinegmt.github.io/pawcasso-atelier/ig-review/

### Limitations (Static Export)
⚠️ **The GitHub Pages preview is UI/layout only. The following features are DISABLED:**
- API routes (`/api/*`)
- Authentication (NextAuth)
- Middleware
- Server-side rendering (SSR)
- Database connections
- Stripe webhooks
- Any server-side functionality

### Local Testing (GitHub Pages Mode)
To test the static export locally before pushing:
```bash
cd website
GITHUB_PAGES=true npm run build
npx serve out
```

### Manual Deployment
You can also trigger the GitHub Pages deployment manually:
1. Go to: https://github.com/caffeineGMT/pawcasso-atelier/actions
2. Select "Deploy Preview to GitHub Pages"
3. Click "Run workflow"

### Deployment Schedule
The workflow runs:
- **On every push to `main`** (automatic)
- **Daily at 8:00 AM PT** (for IG content sync)
- **On manual trigger** (via GitHub Actions UI)

---

## PRODUCTION DEPLOYMENT (VERCEL)

**MANUAL ONLY** - Michael controls production deployments to Vercel.

Engineers: Do NOT deploy to production. Your job is to push working code to GitHub for staging review.
