# Quick Start Guide

Get Paperpatch running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## 3. Test the Application

### Customer Flow
1. Go to http://localhost:3000
2. Select a poster size (or create custom)
3. Choose board option
4. Upload an image (any JPEG/PNG)
5. Fill out checkout form
6. Place order

### Admin Flow
1. Go to http://localhost:3000/admin
2. Login with demo credentials:
   - Password: `admin123`
   - 2FA Code: `123456`
3. View and manage orders
4. Approve/reject orders
5. Adjust prices if needed

## 4. Build for Production

```bash
npm run build
```

This creates a static site in the `out` folder ready for deployment.

## 5. Deploy

### Quick Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "npm run build && gh-pages -d out"

# Deploy
npm run deploy
```

### Quick Deploy to Cloudflare Pages

1. Push code to GitHub
2. Connect repository in Cloudflare Pages dashboard
3. Set build command: `npm run build`
4. Set output directory: `out`
5. Deploy!

## Optional: Set Up Supabase

If you want cloud storage instead of localStorage:

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL from `supabase-setup.sql`
3. Create storage bucket: `poster-images` (make it public)
4. Copy `.env.local.example` to `.env.local`
5. Add your Supabase URL and anon key
6. Restart dev server

## That's It!

Your webstore is ready. See `README.md` for detailed documentation.

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server (after build)
```

## Need Help?

- Check `README.md` for full documentation
- See `DEPLOYMENT.md` for deployment guides
- Review code comments for implementation details

---

Happy selling! 🎨
