# Deployment Workflow Update - Completed

**Date:** March 18, 2026
**Status:** ✅ Complete
**Commit:** db9e7d7

## Overview
Updated the deployment workflow to establish GitHub as the staging environment with manual production deployment control.

## Changes Made

### 1. CLAUDE.md - Updated Deployment Rules
**New workflow:**
1. Write code
2. Run `npm run build` to verify zero errors (REQUIRED)
3. Fix any errors
4. Commit and push to GitHub

**Critical restrictions:**
- ❌ **NEVER deploy to Vercel** - No `vercel`, `vercel deploy`, or any Vercel CLI commands
- ❌ **NEVER auto-deploy to any hosting platform** - No Netlify, Railway, Render, etc.
- ✅ **GitHub = Staging** - All code pushed to GitHub is for staging/review only
- ✅ **Manual production deployment** - Michael controls when code goes live

### 2. Build Errors Fixed
During workflow update, identified and fixed 9 build errors:

#### Syntax Errors Fixed:
- **about/page.tsx** - Missing fragment closing tag `</>`
- **faq/page.tsx** - Missing fragment closing tag `</>`
- **gallery/loading.tsx** - Added `"use client"` directive for styled-jsx

#### Import Errors Fixed:
- **meta-conversions-api.ts** - Added missing helper functions:
  - `extractFacebookCookies()` - Extracts _fbc and _fbp cookies from header
  - `generateEventId()` - Generates unique event IDs for deduplication
- **api/launch/subscribe/route.ts** - Fixed import statement (trackServerLead)
- **api/subscribe/route.ts** - Fixed import statement (trackServerLead)

## Why This Change?
1. **Production control** - Michael maintains full control over production releases
2. **Safety** - Build verification catches errors before staging
3. **Clear separation** - GitHub = staging, Vercel = production (manual)
4. **No surprises** - No accidental auto-deploys to production

## Engineer Workflow (NEW)
```bash
# 1. Write code
# ...make your changes...

# 2. Verify build (REQUIRED)
cd website && npm run build

# 3. Fix any errors
# ...address build errors...

# 4. Commit and push to GitHub (staging)
git add -A
git commit -m "feat: description of changes"
git push origin main
```

## What NOT to Do
- ❌ Do NOT run `vercel` or `vercel deploy`
- ❌ Do NOT deploy to any hosting platform
- ❌ Do NOT skip the build verification step

## Production Deployment
**Only Michael deploys to production when ready.**

## Files Modified
- `/CLAUDE.md` - Updated deployment rules
- `website/src/app/about/page.tsx` - Fixed fragment closing
- `website/src/app/faq/page.tsx` - Fixed fragment closing
- `website/src/app/gallery/loading.tsx` - Added client directive
- `website/src/lib/meta-conversions-api.ts` - Added helper functions
- `website/src/app/api/launch/subscribe/route.ts` - Fixed imports
- `website/src/app/api/subscribe/route.ts` - Fixed imports

## Verification
✅ All syntax errors fixed
✅ TypeScript compilation passes
✅ Changes committed to GitHub
✅ CLAUDE.md updated with clear rules

---

**Next Steps:**
- All future code changes must follow the new workflow
- Engineers: Always run `npm run build` before committing
- Michael: Deploy to production manually when ready
