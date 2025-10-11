# Deployment Guide for Paperpatch

This guide covers deploying Paperpatch to various hosting platforms.

## Prerequisites

- Node.js 18+ installed locally
- Git installed
- GitHub account (for GitHub Pages)
- OR Cloudflare account (for Cloudflare Pages)

## Option 1: Deploy to GitHub Pages

### Step 1: Prepare Repository

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/yourusername/paperpatch.git
git branch -M main
git push -u origin main
```

### Step 2: Configure for GitHub Pages

1. Update `next.config.js` if your repo name is not the root domain:
```javascript
const nextConfig = {
  output: 'export',
  basePath: '/paperpatch', // Add this if repo name is 'paperpatch'
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

2. Build the project:
```bash
npm run build
```

### Step 3: Deploy

Option A: Using GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

2. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages / root
   - Save

Option B: Manual Deployment

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json` scripts:
```json
"deploy": "npm run build && gh-pages -d out"
```

3. Deploy:
```bash
npm run deploy
```

### Step 4: Access Your Site

Your site will be available at:
`https://yourusername.github.io/paperpatch/`

## Option 2: Deploy to Cloudflare Pages

### Step 1: Push to GitHub

Follow the same steps as GitHub Pages to push your code to GitHub.

### Step 2: Connect to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to Pages
3. Click "Create a project"
4. Connect to your GitHub repository
5. Select the Paperpatch repository

### Step 3: Configure Build Settings

- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/`

### Step 4: Environment Variables (Optional)

If using Supabase, add environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 5: Deploy

Click "Save and Deploy"

Your site will be available at:
`https://paperpatch.pages.dev`

You can also add a custom domain in Cloudflare Pages settings.

## Option 3: Deploy to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
vercel
```

Follow the prompts to deploy.

**Note**: You'll need to modify `next.config.js` to remove `output: 'export'` for Vercel deployment.

## Option 4: Deploy to Netlify

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --dir=out --prod
```

Or use drag-and-drop deployment:
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `out` folder

## Setting Up Supabase (Optional)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for setup to complete

### Step 2: Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Create new bucket: `poster-images`
3. Make it public:
   - Click on bucket
   - Settings
   - Public bucket: ON

### Step 3: Create Database Table

1. Go to SQL Editor
2. Run the SQL from `supabase-setup.sql`

### Step 4: Get API Credentials

1. Go to Settings > API
2. Copy:
   - Project URL
   - Anon public key

### Step 5: Add Environment Variables

Add to your hosting platform's environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

For local development, create `.env.local`:
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your credentials.

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Test product selection
- [ ] Test image upload
- [ ] Test checkout flow
- [ ] Test admin login
- [ ] Verify order creation
- [ ] Check mobile responsiveness
- [ ] Update admin credentials (remove demo passwords)
- [ ] Add custom domain (optional)
- [ ] Set up SSL certificate (usually automatic)
- [ ] Configure email notifications (if needed)
- [ ] Update bKash payment number
- [ ] Test payment flows

## Updating the Site

### For GitHub Pages or Cloudflare Pages

1. Make changes to your code
2. Commit and push:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

3. The site will automatically rebuild and deploy

### Manual Updates

1. Make changes
2. Build:
```bash
npm run build
```
3. Deploy the `out` folder to your hosting platform

## Troubleshooting

### Images not loading
- Check that images are in the `public` folder
- Verify `basePath` in `next.config.js` matches your deployment path

### 404 errors
- Ensure `trailingSlash: true` is set in `next.config.js`
- Check that all routes are properly exported

### Supabase connection issues
- Verify environment variables are set correctly
- Check that Supabase project is active
- Ensure storage bucket is public

### Admin login not working
- Check that sessionStorage is enabled in browser
- Verify credentials in `AdminLogin.tsx`

## Security Recommendations

1. **Change default admin credentials** before deploying to production
2. **Implement proper password hashing** using bcrypt
3. **Set up real 2FA** with Google Authenticator
4. **Use HTTPS** (automatic with most hosting platforms)
5. **Add rate limiting** for API endpoints
6. **Validate all inputs** server-side
7. **Keep dependencies updated** regularly

## Performance Optimization

1. **Enable caching** in your hosting platform
2. **Compress images** before uploading
3. **Use CDN** for static assets (automatic with Cloudflare)
4. **Monitor bundle size** with `npm run build`
5. **Lazy load images** (already implemented)

## Monitoring

Consider adding:
- Google Analytics for traffic monitoring
- Sentry for error tracking
- Uptime monitoring (UptimeRobot, etc.)

## Support

If you encounter issues:
1. Check the console for errors
2. Review the deployment logs
3. Verify all environment variables
4. Test locally first with `npm run dev`

---

Happy deploying! 🚀
