# 🚀 Deployment Checklist

**Version:** 1.0
**Last Updated:** March 18, 2026
**Owner:** CTO
**Applies To:** All engineers working on Pawcasso Atelier

---

## ⚠️ Critical Policy

**READ THIS FIRST:**
- ❌ **NEVER run `vercel` or `vercel deploy` commands**
- ❌ **NEVER auto-deploy to any hosting platform**
- ✅ **GitHub = Staging** - Push all code to GitHub for review
- ✅ **Production deployment is MANUAL ONLY** - Michael deploys when ready

**Violation of this policy may result in:**
- Broken code reaching production customers
- Loss of revenue
- Customer trust damage
- Disciplinary action

---

## 📋 Pre-Commit Checklist

**Run this EVERY TIME before committing code:**

### 1. Code Quality ✅
- [ ] All TypeScript errors resolved
- [ ] No console.log/console.error left in production code
- [ ] No commented-out code blocks
- [ ] No TODO comments (move to issue tracker)
- [ ] Code follows project style guide

### 2. Build Verification ✅ **MANDATORY**
```bash
cd website
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**If build fails:**
- ❌ **DO NOT COMMIT**
- Fix all errors
- Run `npm run build` again
- Repeat until successful

### 3. Local Testing ✅
- [ ] Tested changes locally with `npm run dev`
- [ ] All features work as expected
- [ ] No broken links or 404 errors
- [ ] No console errors in browser DevTools

### 4. Security Check ✅
- [ ] No API keys or secrets in code
- [ ] No sensitive data in commit
- [ ] .env files not committed (.gitignore verified)

---

## 📤 Git Commit Checklist

### 1. Stage Changes
```bash
git add -A
```

**OR** (preferred - explicit file selection):
```bash
git add src/components/MyComponent.tsx
git add src/app/my-page/page.tsx
```

**⚠️ WARNING:** Avoid `git add .` or `git add -A` unless you've reviewed ALL changes

### 2. Write Good Commit Message
```bash
git commit -m "feat: Add user profile edit functionality"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/updates
- `chore:` - Build process, dependencies, etc.

**Good Examples:**
- ✅ `feat: Add mobile-responsive checkout flow`
- ✅ `fix: Resolve Stripe webhook timeout on large files`
- ✅ `refactor: Extract order form into reusable components`

**Bad Examples:**
- ❌ `update stuff`
- ❌ `fix bug`
- ❌ `changes`

### 3. Push to GitHub
```bash
git push origin main
```

**Expected Output:**
```
To https://github.com/username/pawcasso-atelier.git
   abc1234..def5678  main -> main
```

### 4. Verify GitHub Actions
1. Go to GitHub repository
2. Click "Actions" tab
3. Verify latest workflow is running
4. Wait for ✅ green checkmark
5. If ❌ red X appears → Fix errors immediately

---

## 🚨 What Happens After Push

### Automatic (GitHub-Managed)
1. **GitHub Actions Triggered:**
   - ✅ E2E tests run (playwright)
   - ✅ Payment flow tests run (Stripe integration)
   - ✅ Build verification (ensures no TS errors)

2. **GitHub Pages Deployment (Staging):**
   - ✅ Static preview deployed to GitHub Pages
   - ⚠️ **Note:** API routes won't work (static export only)
   - Use for visual/layout review only

### Manual (Michael-Controlled)
1. **Production Deployment:**
   - ❌ **NOT automatic**
   - Michael reviews staging
   - Michael manually deploys when ready
   - Michael monitors post-deployment

**You will be notified when production deployment happens.**

---

## 🛑 What NOT to Do

### ❌ NEVER Run These Commands
```bash
# FORBIDDEN - DO NOT RUN
vercel
vercel deploy
vercel --prod
vercel login
npm run deploy
netlify deploy
railway up
render deploy
```

### ❌ NEVER Do These Actions
- Deploy directly to production hosting platforms
- Bypass `npm run build` verification
- Commit without testing locally
- Push broken code "to fix later"
- Force push (`git push --force`) without approval
- Commit `.env` files or API keys

---

## ✅ Proper Workflow Example

**Scenario:** You're adding a new "Gift Card" feature

### Step 1: Development
```bash
# Create feature branch (optional)
git checkout -b feature/gift-cards

# Make your changes
vim src/app/gift/page.tsx

# Test locally
npm run dev
# Visit http://localhost:3000/gift
```

### Step 2: Build Verification
```bash
# REQUIRED STEP
npm run build
```

**Output:**
```
✓ Compiled successfully
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         150 kB
├ ○ /gift                                3.1 kB         148 kB
└ ○ /order                               12 kB          162 kB
```

### Step 3: Commit and Push
```bash
# Stage specific files
git add src/app/gift/page.tsx
git add src/components/GiftCard.tsx

# Commit with descriptive message
git commit -m "feat: Add gift card purchase flow with $25/$50/$100 options"

# Push to GitHub
git push origin main
```

### Step 4: Verify GitHub Actions
1. Go to https://github.com/yourname/pawcasso-atelier/actions
2. See "feat: Add gift card purchase flow..." running
3. Wait for green ✅
4. Check GitHub Pages preview (if needed)

### Step 5: Done!
- Your code is on GitHub (staging)
- CI tests passed
- Waiting for Michael's production deployment

---

## 🔧 Setting Up Pre-Commit Hook (Recommended)

**Automate build verification:**

```bash
# Navigate to project root
cd /Users/michaelguo/pawcasso-atelier

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "🔨 Running pre-commit build verification..."
cd website

# Run build
npm run build

# Check exit code
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ BUILD FAILED!"
  echo "Fix errors above before committing."
  echo ""
  exit 1
fi

echo "✅ Build successful! Proceeding with commit..."
exit 0
EOF

# Make executable
chmod +x .git/hooks/pre-commit
```

**Benefits:**
- Automatically runs `npm run build` before every commit
- Blocks commits if build fails
- Ensures you never push broken code
- Saves time (catches errors before pushing)

---

## 📊 Deployment Status Dashboard

**Check these URLs to verify deployment status:**

| Environment | URL | Purpose | Auto-Deploy? |
|-------------|-----|---------|--------------|
| **Local** | http://localhost:3000 | Development | N/A |
| **GitHub Pages** | https://yourname.github.io/pawcasso-atelier | Staging Preview (static) | ✅ Auto (push to main) |
| **Production** | https://pawcasso-atelier.vercel.app | Live Customer Site | ❌ Manual Only |

---

## 🚨 Emergency Procedures

### If You Accidentally Deploy to Production
1. **Immediately notify Michael** (Slack/Email)
2. **Do not panic** - rollback is possible
3. **Document what was deployed** (commit hash, timestamp)
4. **Provide context** (what feature, what broke)

### If Build Fails After Pushing
1. **Fix errors immediately** (within 30 minutes)
2. **Push fix** with message: `fix: Resolve build errors from previous commit`
3. **Verify GitHub Actions** turn green
4. **Notify team** if customer-facing impact

### If GitHub Actions Fail
1. **Check logs** in GitHub Actions tab
2. **Common issues:**
   - TypeScript errors
   - Test failures
   - Dependency issues
3. **Fix and push again**
4. **Do not ignore** - red X means something is broken

---

## 📚 Additional Resources

- **CLAUDE.md** - Full deployment policy
- **DEPLOYMENT_AUDIT_2026-03-18.md** - Latest audit findings
- **README.md** - Project setup instructions
- **.github/workflows/** - CI/CD configuration

---

## ✍️ Engineer Acknowledgment

**I have read and understood this checklist. I agree to follow the deployment workflow.**

| Name | Date | Signature |
|------|------|-----------|
|      |      |           |
|      |      |           |
|      |      |           |

---

## 📝 Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-18 | Initial checklist created | Engineering Team |

---

**Questions?** Contact CTO or refer to CLAUDE.md
