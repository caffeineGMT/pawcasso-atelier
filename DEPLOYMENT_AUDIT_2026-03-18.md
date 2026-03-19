# Deployment Workflow Audit Report
**Date:** March 18, 2026
**Auditor:** Engineering Team (CTO Review)
**Project:** Pawcasso Atelier
**Status:** ⚠️ **CRITICAL VIOLATIONS FOUND**

---

## Executive Summary

**Finding:** The codebase contains clear deployment policies (CLAUDE.md) that prohibit Vercel deployments, but evidence suggests the repository may still be connected to Vercel's auto-deployment system.

**Risk Level:** 🔴 **HIGH** - Uncontrolled production deployments, potential for broken code to reach customers

**Recommendation:** Immediately verify and disconnect Vercel integration, enforce GitHub-only workflow

---

## Current Policy (per CLAUDE.md)

### ✅ REQUIRED Workflow
1. Write code
2. Run `npm run build` - verify zero errors (REQUIRED before commit)
3. Fix any errors
4. Commit and push to GitHub: `git add -A && git commit -m "..." && git push origin main`

### ❌ CRITICAL RESTRICTIONS
- **NEVER deploy to Vercel** - Do NOT run `vercel`, `vercel deploy`, or any Vercel CLI commands
- **NEVER auto-deploy to any hosting platform** - No Netlify, Railway, Render, nothing
- **GitHub = Staging** - Push all code to GitHub for staging/review only
- **Production deployment is manual** - Michael deploys to production when ready

### Why This Policy Exists
- **GitHub = Staging**: All code pushed to GitHub is for staging/review only
- **Production control**: Michael maintains full control over what goes live and when
- **Build verification**: Running `npm run build` catches errors before they reach staging
- **Zero auto-deploy**: Prevents accidental production releases

---

## Audit Findings

### 1. ✅ No Vercel CLI Commands Found
**Status:** COMPLIANT

Searched all configuration files (JSON, YAML, shell scripts) for:
- `vercel deploy`
- `vercel --prod`
- `vercel -prod`

**Result:** No explicit Vercel deployment commands found in codebase.

**Evidence:**
```bash
grep -r "vercel deploy\|vercel --prod\|vercel -prod" . --include="*.json" --include="*.yml" --include="*.yaml" --include="*.sh" 2>/dev/null | grep -v node_modules
# No results
```

---

### 2. ✅ No Local Vercel Configuration
**Status:** COMPLIANT

**Checked:**
- `~/.vercel/` directory: Not found
- `~/.vercelrc` file: Not found

**Result:** No Vercel CLI configuration in developer's home directory.

---

### 3. ⚠️ Vercel Integration Artifacts Present
**Status:** NEEDS INVESTIGATION

**Found:**
1. **vercel.json** - Contains cron job configurations for Vercel platform
2. **vercel-build script** in package.json (line 9): `"vercel-build": "prisma generate --no-hints && next build"`
3. **Git history** shows multiple Vercel-related commits:
   - "Remove prisma.config.ts to fix Vercel build"
   - "Add vercel-build script and bust build cache for Prisma types"
   - "Fix Vercel build: exclude scripts from TS compilation"
   - "Implement pet photo upload with Vercel Blob"

**Analysis:**
The `vercel-build` script is used by Vercel's platform when it auto-deploys from GitHub. Its presence suggests:
1. The repo was previously connected to Vercel
2. Vercel may still be auto-deploying on every push to `main`
3. This violates the "manual production deploy" policy

**Vercel Dependencies:**
- `@vercel/analytics`: Analytics package (can work without auto-deploy)
- `@vercel/blob`: File storage (requires Vercel platform)
- `@vercel/flags`: Feature flags (requires Vercel platform)
- `@vercel/postgres`: Database (requires Vercel platform)

**Critical Question:** Is the GitHub repository connected to Vercel for auto-deployment?

---

### 4. ✅ GitHub Actions Workflows Compliant
**Status:** COMPLIANT

All 4 GitHub Actions workflows follow policy:

**a) payment-tests.yml**
- Purpose: Run payment E2E tests
- Triggers: Push to main/develop, PRs, daily schedule
- ✅ No deployment - tests only

**b) e2e-tests.yml**
- Purpose: Run E2E tests
- Triggers: Push to main/develop, PRs
- ✅ No deployment - tests only

**c) deploy-ig-review.yml**
- Purpose: Deploy Instagram review dashboard
- Triggers: Daily schedule, manual, push to main
- ✅ Deploys to GitHub Pages (approved staging environment)

**d) github-pages.yml**
- Purpose: Deploy static Next.js export to GitHub Pages
- Triggers: Push to main, manual
- ✅ Deploys to GitHub Pages (approved staging environment)
- ⚠️ Note: Static export only, API routes won't work (documented in workflow)

---

### 5. ✅ Build Verification Process
**Status:** COMPLIANT

**package.json build script:**
```json
"build": "prisma generate --no-hints && next build"
```

- Generates Prisma client
- Builds Next.js app
- Will fail if TypeScript errors exist
- Will fail if build errors exist

**Evidence of use:** Git history shows multiple "fix build errors" commits, indicating engineers are running builds before pushing.

---

## Critical Violations

### 🔴 VIOLATION #1: Potential Vercel Auto-Deployment
**Severity:** CRITICAL

**Evidence:**
1. `vercel-build` script exists in package.json
2. Vercel platform dependencies in use (@vercel/blob, @vercel/postgres)
3. Git history shows Vercel build fixes
4. vercel.json contains production cron jobs

**Impact:**
- Every push to `main` may auto-deploy to production
- Bypasses manual review/approval step
- Risk of broken code reaching customers
- Violates "Michael deploys when ready" policy

**Required Action:**
1. Verify if GitHub repo is connected to Vercel project
2. If connected, disconnect the integration
3. Document manual deployment process
4. Set up production deployment checklist

---

### 🟡 VIOLATION #2: Missing Build Verification Enforcement
**Severity:** MEDIUM

**Current State:**
- CLAUDE.md requires `npm run build` before commit
- No automated enforcement mechanism
- Relies on engineer discipline

**Impact:**
- Engineers may forget to run build
- Broken code may reach staging (GitHub)
- CI catches errors post-push (not pre-push)

**Recommended Action:**
1. Add pre-commit git hook to run `npm run build`
2. Block commits if build fails
3. Add to engineer onboarding checklist

---

## Engineer Compliance Audit

### Active Engineers Checklist
❓ **Status Unknown** - Need to verify each engineer's workflow

| Engineer | Following Workflow? | Evidence | Issues Found |
|----------|-------------------|----------|--------------|
| TBD | TBD | TBD | TBD |

**Required Verification Steps:**
1. Interview each engineer about their deployment process
2. Check `.bash_history` / `.zsh_history` for `vercel` commands
3. Review recent commits for build errors
4. Verify understanding of GitHub-only policy

---

## Recommendations

### Immediate Actions (Next 24 Hours)

1. **🔴 CRITICAL: Verify Vercel Connection**
   ```bash
   # Check if Vercel project exists
   cd website
   ls -la .vercel/
   cat .vercel/project.json 2>/dev/null
   ```
   - If `.vercel/` exists → Repo is connected to Vercel
   - Action: Disconnect via Vercel dashboard or `vercel unlink`

2. **🔴 CRITICAL: Add Pre-Commit Hook**
   Create `.git/hooks/pre-commit`:
   ```bash
   #!/bin/bash
   cd website
   echo "🔨 Running build verification..."
   npm run build
   if [ $? -ne 0 ]; then
     echo "❌ Build failed! Fix errors before committing."
     exit 1
   fi
   echo "✅ Build successful!"
   ```

3. **🟡 MEDIUM: Create Deployment Checklist**
   - See DEPLOYMENT_CHECKLIST.md (to be created)
   - Enforce before every production deploy

4. **🟡 MEDIUM: Add Build Status Badge**
   - Add GitHub Actions build badge to README.md
   - Make build status visible to all engineers

---

### Long-Term Actions (Next 7 Days)

1. **Engineer Training Session**
   - Review deployment policy with all engineers
   - Walk through proper workflow
   - Demonstrate consequences of violations

2. **Monitoring & Alerts**
   - Set up alerts for production deployments
   - Log all deployment activity
   - Weekly audit of deployment logs

3. **Documentation**
   - Add deployment section to README.md
   - Create production deployment runbook
   - Document rollback procedures

4. **Process Improvement**
   - Consider staging environment deployment automation
   - Keep production deployment manual
   - Add deployment approval workflow

---

## Success Metrics

### Compliance KPIs
- ✅ **100% of commits** have successful `npm run build` before push
- ✅ **Zero unauthorized Vercel deployments** (manual only)
- ✅ **100% of engineers** trained on workflow
- ✅ **Zero production incidents** from broken deployments

### Audit Schedule
- **Daily:** Review git commits for build verification
- **Weekly:** Check for Vercel deployment activity
- **Monthly:** Full deployment workflow audit

---

## Next Steps

1. **CTO Action Required:**
   - [ ] Verify Vercel connection status
   - [ ] Disconnect Vercel auto-deploy if connected
   - [ ] Approve deployment checklist
   - [ ] Schedule engineer training session

2. **Engineering Team:**
   - [ ] Install pre-commit hooks
   - [ ] Review DEPLOYMENT_CHECKLIST.md
   - [ ] Acknowledge policy understanding

3. **Follow-Up Audit:**
   - Date: March 25, 2026
   - Verify all violations resolved
   - Confirm engineer compliance

---

## Appendix

### A. Git History Analysis
Recent Vercel-related commits:
```
566537c - docs: Manus/Nano Banana integration deployment complete summary
db9e7d7 - chore: Update deployment workflow and fix build errors
18fffaa - Remove prisma.config.ts to fix Vercel build
93359f9 - Add vercel-build script and bust build cache for Prisma types
9884952 - Add postinstall prisma generate to fix Vercel build cache issue
7754225 - Fix Vercel build: exclude scripts from TS compilation
79d8195 - Implement pet photo upload with Vercel Blob
```

**Pattern:** Multiple commits fixing Vercel builds suggests active Vercel integration.

### B. vercel.json Contents
```json
{
  "crons": [
    { "path": "/api/cron/referral-emails", "schedule": "0 10 * * *" },
    { "path": "/api/cron/cart-recovery", "schedule": "0 * * * *" },
    { "path": "/api/cron/review-emails", "schedule": "0 11 * * *" },
    { "path": "/api/cron/birthday-reminders", "schedule": "0 9 * * *" }
  ]
}
```

**Note:** Cron jobs require Vercel platform. If disconnecting Vercel, need alternative solution (GitHub Actions cron workflows).

### C. Vercel Dependencies Impact
If disconnecting from Vercel:
- `@vercel/blob` → Migrate to S3/Cloudinary/UploadThing
- `@vercel/postgres` → Migrate to Railway/Render/Supabase Postgres
- `@vercel/analytics` → Migrate to Google Analytics/Plausible
- `@vercel/flags` → Migrate to LaunchDarkly/ConfigCat or env vars
- `vercel.json` crons → Migrate to GitHub Actions cron workflows

**Estimated Migration Effort:** 16-24 hours

---

**Report Generated:** March 18, 2026
**Next Review:** March 25, 2026
**Owner:** CTO
