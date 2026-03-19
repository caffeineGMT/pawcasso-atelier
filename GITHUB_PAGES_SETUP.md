# GitHub Pages Staging Setup

This repository is configured to deploy to GitHub Pages for staging/preview purposes.

## URLs

- **Staging (GitHub Pages)**: https://caffeinegmt.github.io/pawcasso-atelier/
- **Production (Vercel)**: https://pawcasso-atelier.vercel.app (manual deployment only)

## Workflow

1. **Push to `main` branch** → GitHub Actions automatically builds and deploys to GitHub Pages
2. **Review the staging site** at the GitHub Pages URL above
3. **Manual Vercel deployment** for production (handled separately)

## Important Limitations

⚠️ **GitHub Pages uses Next.js static export (`output: 'export'`)**, which has significant limitations:

### What DOESN'T Work on GitHub Pages:
- **API Routes** (`/api/*`) - all backend functionality is disabled
- **Middleware** - no authentication/auth protection
- **Server-Side Rendering** (SSR) - all pages are pre-rendered at build time
- **Dynamic Routes** with runtime data fetching
- **Image Optimization** - uses unoptimized images
- **Custom Headers** - security headers won't apply

### What DOES Work:
- ✅ **Static Pages** - homepage, gallery, about, FAQ, etc.
- ✅ **Client-Side React** - all interactive UI components
- ✅ **Styles & Layout** - full design/UX preview
- ✅ **Client-Side Routing** - Next.js Link navigation

## Use Cases

GitHub Pages staging is perfect for:
- 🎨 Reviewing **UI/UX changes** before production
- 📱 Testing **responsive design** on different devices
- 🔍 **Visual QA** of layout, typography, spacing
- 👀 Sharing **design previews** with stakeholders

GitHub Pages staging is NOT suitable for:
- ❌ Testing checkout/payment flows
- ❌ Testing authentication/login
- ❌ API integration testing
- ❌ Backend functionality validation

## Build Configuration

The GitHub Actions workflow (`.github/workflows/github-pages.yml`) sets `GITHUB_PAGES=true`, which triggers:

1. `output: 'export'` - static site generation
2. `basePath: '/pawcasso-atelier'` - correct asset paths for GitHub Pages
3. `images.unoptimized: true` - required for static export
4. `typescript.ignoreBuildErrors: true` - allows build to complete despite TS errors (staging only)

Production builds on Vercel use the standard Next.js configuration with full SSR support.

## Manual Build Test

To test the GitHub Pages build locally:

```bash
cd website
GITHUB_PAGES=true npm run build
```

The static files will be in `website/out/`.

## Troubleshooting

If the GitHub Actions build fails:
1. Check the Actions tab for detailed logs
2. Test the build locally with `GITHUB_PAGES=true npm run build`
3. Ensure all pages are compatible with static export (no dynamic SSR)
4. Fix TypeScript errors for production builds (they're ignored in staging)

---

**Remember**: GitHub Pages = UI preview only. Vercel = full production functionality.
