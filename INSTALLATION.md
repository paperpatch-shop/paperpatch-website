# Complete Installation & Usage Guide

## ✅ Installation Status

Your Paperpatch webstore has been successfully installed with:
- ✅ All dependencies (192 packages)
- ✅ Complete application code
- ✅ All components and pages
- ✅ Comprehensive documentation
- ✅ Ready for development and deployment

## 🚀 Start Using Paperpatch

### Step 1: Start Development Server

Open a terminal in the Paperpatch folder and run:

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Step 2: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Paperpatch homepage with:
- Header with logo
- Product selection interface
- Size options
- Board selection
- Preview panel

### Step 3: Test Customer Flow

1. **Select a Size**
   - Click on "12" × 8"" (or any size)
   - Toggle "With Board" / "Without Board"
   - Notice price updates
   - Click "Continue to Upload Image"

2. **Upload an Image**
   - Drag and drop any JPEG/PNG image
   - OR click to browse and select
   - See preview appear
   - Click "Continue to Checkout"

3. **Fill Checkout Form**
   - Enter name: "Test Customer"
   - Enter phone: "01712345678"
   - Enter email: "test@example.com"
   - Enter address: "123 Test Street"
   - Enter city: "Dhaka"
   - Select "Inside Dhaka" or "Outside Dhaka"
   - Choose "Cash on Delivery"
   - Click "Place Order"

4. **View Confirmation**
   - See order confirmation page
   - Note the order number (e.g., PP-ABC123-XYZ)
   - Review order details

### Step 4: Test Admin Dashboard

1. **Navigate to Admin**
   - Go to: http://localhost:3000/admin
   - See login page

2. **Login**
   - Enter password: `admin123`
   - Click "Continue"
   - Enter 2FA code: `123456`
   - Click "Login"

3. **View Dashboard**
   - See statistics cards
   - View your test order
   - Click on order to expand

4. **Manage Order**
   - Click "Approve Order" button
   - See status change to "Approved"
   - Notice statistics update
   - View customer's uploaded image

## 📱 Test on Mobile

1. Find your computer's local IP:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On your phone's browser, visit:
   ```
   http://YOUR_IP:3000
   ```
   (e.g., http://192.168.1.100:3000)

3. Test the mobile experience

## 🎨 Customize Your Store

### Change Admin Credentials

**File**: `components/admin/AdminLogin.tsx`

Find and change:
```typescript
const DEMO_PASSWORD = 'admin123';  // Change to your password
const DEMO_2FA_CODE = '123456';    // Change to your code
```

### Update bKash Number

**File**: `components/CheckoutForm.tsx`

Find line ~195 and change:
```typescript
<li>1. Send money to: <strong>01XXXXXXXXX</strong></li>
```
Replace with your actual bKash number.

### Modify Prices

**File**: `lib/types.ts`

Edit the STANDARD_SIZES array:
```typescript
export const STANDARD_SIZES: StandardSize[] = [
  { 
    label: '12" × 8"', 
    width: 12, 
    height: 8, 
    priceWithoutBoard: 350,  // Change this
    priceWithBoard: 450       // Change this
  },
  // ... other sizes
];
```

### Change Shipping Costs

**File**: `lib/types.ts`

Edit:
```typescript
export const SHIPPING_COST = {
  INSIDE_DHAKA: 80,   // Change this
  OUTSIDE_DHAKA: 120, // Change this
};
```

### Customize Colors

**File**: `tailwind.config.js`

Edit the color palettes:
```javascript
colors: {
  paper: {
    50: '#faf8f5',  // Lightest paper color
    // ... change as needed
  },
  warm: {
    50: '#fef9f3',  // Lightest warm color
    // ... change as needed
  }
}
```

## 🗄️ Add Cloud Storage (Optional)

### Why Use Supabase?
- Cloud storage for images
- Database for orders
- Access from multiple devices
- Automatic backups

### Setup Steps

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up (free)
   - Create new project
   - Wait for setup (~2 minutes)

2. **Create Database Table**
   - Go to SQL Editor
   - Copy content from `supabase-setup.sql`
   - Paste and run

3. **Create Storage Bucket**
   - Go to Storage
   - Click "New bucket"
   - Name: `poster-images`
   - Make it public
   - Create

4. **Get API Credentials**
   - Go to Settings > API
   - Copy "Project URL"
   - Copy "anon public" key

5. **Configure Environment**
   - Copy `.env.local.example` to `.env.local`
   - Edit `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

6. **Restart Server**
   - Stop dev server (Ctrl+C)
   - Run `npm run dev` again

Now images will upload to Supabase and orders will save to the database!

## 🌐 Deploy to Production

### Option 1: Cloudflare Pages (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/paperpatch.git
   git push -u origin main
   ```

2. **Connect to Cloudflare**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to Pages
   - Click "Create a project"
   - Connect your GitHub repository
   - Select "paperpatch"

3. **Configure Build**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Click "Save and Deploy"

4. **Add Environment Variables** (if using Supabase)
   - Go to Settings > Environment variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Access Your Site**
   - Your site will be at: `https://paperpatch.pages.dev`
   - Add custom domain in settings (optional)

### Option 2: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add Deploy Script**
   Edit `package.json`, add to scripts:
   ```json
   "deploy": "npm run build && gh-pages -d out"
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings
   - Pages section
   - Source: gh-pages branch
   - Save

5. **Access Your Site**
   - `https://yourusername.github.io/paperpatch/`

### Option 3: Netlify

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag the `out` folder
   - Done!

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check for errors
npm run build

# Install new package
npm install package-name

# Update dependencies
npm update
```

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found Error

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

1. Check console for specific error
2. Ensure all files are saved
3. Try clean build:
   ```bash
   rm -rf .next
   npm run build
   ```

### Images Not Loading

- Check file format (JPEG/PNG only)
- Check file size (< 10MB)
- Check browser console for errors

### Supabase Connection Issues

- Verify credentials in `.env.local`
- Check Supabase project is active
- Ensure storage bucket is public
- Restart dev server after changes

## 📊 Monitor Your Store

### Check Orders
- Log in to admin dashboard
- View statistics
- Filter by status
- Search for specific orders

### Track Revenue
- Total revenue shown in dashboard
- Only counts approved/completed orders
- Updates in real-time

### Manage Orders
- Approve pending orders
- Reject if needed
- Adjust prices
- Add notes
- Mark as completed

## 🔒 Security Best Practices

### Before Going Live

1. **Change Credentials**
   - Update admin password
   - Update 2FA code
   - Use strong passwords

2. **Secure Environment**
   - Never commit `.env.local`
   - Use HTTPS (automatic with hosts)
   - Keep dependencies updated

3. **Test Everything**
   - Complete customer flow
   - Admin dashboard
   - Payment flows
   - Mobile experience

4. **Monitor**
   - Check orders regularly
   - Respond to customers
   - Track revenue
   - Watch for errors

## 📈 Growth Tips

### Marketing
- Share your URL on social media
- Create Instagram posts with mockups
- Offer launch discount
- Collect customer testimonials

### Operations
- Process orders quickly
- Communicate with customers
- Maintain quality
- Track popular sizes

### Improvements
- Add more standard sizes
- Offer bulk discounts
- Create design templates
- Add customer accounts

## 🎯 Next Steps

1. ✅ **Test Locally** - Verify everything works
2. ✅ **Customize** - Update branding and prices
3. ✅ **Deploy** - Go live on hosting platform
4. ✅ **Market** - Share with customers
5. ✅ **Monitor** - Track orders and revenue

## 📞 Need Help?

### Documentation
- **START_HERE.md** - Quick overview
- **QUICKSTART.md** - 5-minute guide
- **README.md** - Full documentation
- **FEATURES.md** - Feature details
- **DEPLOYMENT.md** - Deployment guides
- **TESTING.md** - Testing checklist

### Code
- Check inline comments
- Review component files
- Test with demo data

### Issues
- Check browser console (F12)
- Review error messages
- Test in different browser

## ✨ You're Ready!

Your Paperpatch webstore is fully installed and ready to use. Start the development server and begin testing:

```bash
npm run dev
```

Then visit: **http://localhost:3000**

---

**Happy selling! 🎨**

Everything is set up and ready for your poster business.
