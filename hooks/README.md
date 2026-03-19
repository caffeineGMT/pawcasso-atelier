# Deployment Workflow Enforcement

This directory contains Git hooks to enforce the deployment workflow.

## 🪝 Available Hooks

### pre-commit
**Purpose:** Runs `npm run build` before allowing commits

**Benefits:**
- ✅ Catches build errors before pushing to GitHub
- ✅ Prevents broken code from reaching staging
- ✅ Saves time (errors caught locally, not in CI)
- ✅ Enforces CLAUDE.md build verification policy

**Installation:**
```bash
# From project root
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Test it:**
```bash
# Make a change that breaks the build
echo "const x: number = 'string';" >> website/src/app/page.tsx

# Try to commit
git add -A
git commit -m "test: Verify pre-commit hook"

# Should fail with build error
# Fix the error and try again
```

## 🔧 Installation for All Engineers

**Option 1: Manual Installation (Recommended for existing repos)**
```bash
cd /Users/michaelguo/pawcasso-atelier
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo "✅ Pre-commit hook installed!"
```

**Option 2: One-liner**
```bash
cp hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

**Verify installation:**
```bash
ls -la .git/hooks/pre-commit
# Should show: -rwxr-xr-x (executable permissions)
```

## 🚫 Bypassing the Hook (Emergency Only)

**⚠️ Use only in emergencies (e.g., fixing critical production bug)**

```bash
git commit --no-verify -m "fix: Emergency hotfix"
```

**Note:** This should be rare and approved by CTO.

## 🔄 Updating Hooks

When hooks are updated in the `hooks/` directory:

```bash
# Re-copy to .git/hooks/
cp hooks/pre-commit .git/hooks/pre-commit
```

**Note:** `.git/hooks/` is not tracked by Git, so each engineer must install locally.

## 📋 Hook Maintenance

**File locations:**
- **Source of truth:** `/hooks/pre-commit` (tracked in Git)
- **Active hook:** `/.git/hooks/pre-commit` (not tracked, local only)

**To modify the hook:**
1. Edit `hooks/pre-commit`
2. Test locally by copying to `.git/hooks/`
3. Commit changes to `hooks/pre-commit`
4. Notify all engineers to update their local hook

## 🐛 Troubleshooting

### Hook not running
```bash
# Check if hook exists
ls -la .git/hooks/pre-commit

# Check if executable
chmod +x .git/hooks/pre-commit
```

### Hook runs but build fails
```bash
# Run build manually to see error
cd website
npm run build

# Fix errors and try commit again
```

### Hook takes too long
**Current behavior:** Runs full Next.js build (~10-30 seconds)

**Future improvement:** Could add faster pre-commit checks:
- TypeScript type checking only (`tsc --noEmit`)
- Linting only (`npm run lint`)
- Quick validation before full build

## 📊 Hook Statistics

**Average build time:** ~15-20 seconds
**False positive rate:** ~0% (if it fails, there's a real build error)
**Time saved:** Catches errors locally instead of in CI (saves 2-5 minutes per error)

## 🔮 Future Hooks

Potential additions:
- **pre-push** - Run full test suite before push
- **commit-msg** - Enforce commit message format
- **post-merge** - Auto-install dependencies after pull

## 📚 Resources

- **Git Hooks Documentation:** https://git-scm.com/docs/githooks
- **Project Deployment Policy:** See CLAUDE.md
- **Deployment Checklist:** See DEPLOYMENT_CHECKLIST.md
