# CLAUDE.md

## DEPLOYMENT RULES

### REQUIRED WORKFLOW (Engineers must follow this exactly):
1. **Write code** - Make your changes
2. **Run `npm run build`** - Verify zero errors (REQUIRED before committing)
3. **Fix any errors** - Address all build errors before proceeding
4. **Commit and push to GitHub** - `git add -A && git commit -m "..." && git push origin main`

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
