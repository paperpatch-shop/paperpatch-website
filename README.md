# Paperpatch - Custom Poster Webstore

A fully functional, responsive e-commerce platform for custom poster printing with a cozy, crumpled-paper aesthetic.

## Features

### Customer Features
- **Multi-Image Upload**: Upload multiple images at once with drag-and-drop
- **Product Selection**: Choose from 4 standard sizes (12×8, 18×12, 24×16, 35×24)
- **Board Options**: Select posters with or without mounting board
- **Live Preview**: Interactive preview with repositioning and background selection
- **Flexible Checkout**: Cash on Delivery or bKash payment options
- **Order Tracking**: Receive order confirmation with unique order number
- **Gallery**: View previous work and customer reviews

### Admin Features
- **Secure API Authentication**: Server-side password verification
- **Order Management**: Approve/reject/complete orders with status tracking
- **Bulk Image Download**: Download all order images organized by size and board option in ZIP format
- **Dynamic Pricing**: Adjust prices for individual items
- **Revenue Tracking**: View total revenue and order statistics
- **Customer Data**: Access all customer information and uploaded images
- **Search & Filter**: Search by order number, name, phone, email; filter by status

## Tech Stack

- **Framework**: Next.js 14 (Static Export)
- **Styling**: Tailwind CSS with custom paper texture theme
- **Icons**: Lucide React
- **Storage**: Supabase (optional) or localStorage fallback
- **Deployment**: GitHub Pages / Cloudflare Pages ready

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd Paperpatch
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials if you want to use cloud storage. Otherwise, the app will use localStorage.

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Supabase Setup (Optional)

If you want to use Supabase for image storage and order management:

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Create a storage bucket named `poster-images`:
   - Go to Storage in Supabase dashboard
   - Create new bucket: `poster-images`
   - Make it public

3. Create an `orders` table:
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  item JSONB NOT NULL,
  shipping JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  bkash_transaction_id TEXT,
  shipping_cost INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);
```

4. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Admin Access

**Demo Credentials:**
- Password: `admin123`
- 2FA Code: `123456`

**For Production:**
1. Change the demo credentials in `components/admin/AdminLogin.tsx`
2. Implement proper password hashing with bcrypt
3. Set up Google Authenticator for real 2FA

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized static export in the `out` directory.

### Deploy to GitHub Pages

1. Update `next.config.js` with your repository name if needed
2. Build the project: `npm run build`
3. Deploy the `out` folder to GitHub Pages

### Deploy to Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `out`
4. Deploy

## Pricing Structure

### Standard Sizes (Without Board)
- 12" × 8": ৳350
- 18" × 12": ৳550
- 24" × 16": ৳850
- 35" × 24": ৳1500

### Standard Sizes (With Board)
- 12" × 8": ৳450
- 18" × 12": ৳700
- 24" × 16": ৳1050
- 35" × 24": Not available

### Custom Sizes
- Minimum height: 12 inches
- Calculated based on area: ~৳2.8-3.5 per square inch
- Board premium: +৳200

### Shipping
- Inside Dhaka: ৳80
- Outside Dhaka: ৳120

## Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
- `paper`: Main paper tones
- `warm`: Accent warm tones

### Pricing
Edit `lib/types.ts` to modify standard sizes and prices.

### Payment Methods
Update bKash number in `components/CheckoutForm.tsx` (line 195).

## Project Structure

```
Paperpatch/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main customer page
│   ├── globals.css         # Global styles
│   └── admin/
│       └── page.tsx        # Admin dashboard page
├── components/
│   ├── Header.tsx          # Site header
│   ├── ProductSelector.tsx # Size selection
│   ├── ImageUpload.tsx     # Image upload
│   ├── MockupPreview.tsx   # Wall mockup preview
│   ├── CheckoutForm.tsx    # Checkout form
│   ├── OrderConfirmation.tsx # Order success
│   └── admin/
│       ├── AdminLogin.tsx      # Admin authentication
│       ├── AdminDashboard.tsx  # Admin overview
│       └── OrderCard.tsx       # Order management card
├── lib/
│   ├── types.ts            # TypeScript types
│   ├── supabase.ts         # Database functions
│   └── pricing.ts          # Pricing calculations
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies

```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images with Next.js Image component
- Static site generation for fast loading
- Lazy loading for images
- Minimal JavaScript bundle size

## Security Notes

⚠️ **Important for Production:**

1. **Admin Authentication**: Replace demo credentials with secure password hashing
2. **2FA**: Implement proper Google Authenticator integration
3. **API Keys**: Never commit `.env.local` to version control
4. **Input Validation**: All user inputs are validated client-side and should be validated server-side
5. **HTTPS**: Always use HTTPS in production

## Support

For issues or questions:
- Check the documentation above
- Review the code comments
- Contact: [your-email@example.com]

## License

This project is proprietary and confidential.

## Credits

Built with:
- Next.js
- Tailwind CSS
- Lucide Icons
- Supabase

---

Made with ❤️ for Paperpatch
