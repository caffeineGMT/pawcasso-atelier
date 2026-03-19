# GitHub Pages Deployment Consolidation

## What Was Done

### 1. Consolidated Deployment Workflow
Created a single `.github/workflows/deploy-preview.yml` that:
- Builds the main Next.js website as a static export
- Syncs Instagram review content
- Deploys both to GitHub Pages under a single artifact
- Runs on push to `main`, daily at 8:00 AM PT, and manual triggers

### 2. Removed Conflicting Workflows
Deleted the following workflows that were overwriting each other:
- `.github/workflows/github-pages.yml`
- `.github/workflows/deploy-ig-review.yml`

### 3. Updated Configuration
- **next.config.ts**: Already properly configured for GitHub Pages with `output: 'export'`, `basePath`, and `assetPrefix`
- **package.json**: Added `build:static` script that skips Prisma generation for static builds
- **CLAUDE.md**: Comprehensive documentation of the GitHub Pages staging workflow

### 4. Preview URLs
After deployment, the preview is available at:
- **Main Site**: https://caffeinegmt.github.io/pawcasso-atelier/
- **IG Review Dashboard**: https://caffeinegmt.github.io/pawcasso-atelier/ig-review/

## Known Issues (Pre-existing)

### Prisma 7.x Configuration
The codebase has a Prisma schema configuration issue that needs to be addressed separately:
- Prisma 7.x requires a new configuration format (prisma.config.ts)
- Current schema.prisma uses deprecated `url` property
- This blocks the full build process

### Workaround for Static Export
The `build:static` script bypasses Prisma generation for GitHub Pages previews since:
- GitHub Pages is a static preview (no database, no API routes)
- API routes and server features are automatically excluded from static exports
- The preview is UI/layout only

## Next Steps (Separate Tasks)

1. **Fix Prisma Configuration**: Migrate to Prisma 7.x configuration format
   - Create `prisma.config.ts`
   - Update schema.prisma
   - Configure PrismaClient with adapter or accelerateUrl

2. **Test GitHub Pages Deployment**: Once Prisma is fixed, verify the workflow runs successfully

## Files Modified

1. `.github/workflows/deploy-preview.yml` (created)
2. `.github/workflows/github-pages.yml` (deleted)
3. `.github/workflows/deploy-ig-review.yml` (deleted)
4. `CLAUDE.md` (updated with workflow documentation)
5. `website/package.json` (added `build:static` script)
6. `website/src/lib/stripe.ts` (added `promo?: string` to TierConfig)
7. `website/src/components/WebVitals.tsx` (fixed TypeScript type)

## Deployment Workflow

**Engineer Workflow:**
1. Write code
2. Run `npm run build` locally to verify (catches errors before push)
3. Fix any build errors
4. Commit and push to GitHub (`git add -A && git commit -m "..." && git push origin main`)
5. GitHub Actions automatically deploys to GitHub Pages for preview
6. Production deployment to Vercel remains manual (controlled by Michael)
