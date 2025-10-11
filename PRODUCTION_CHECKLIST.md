# Production Deployment Checklist

## ✅ Completed
- [x] Customer order flow (upload, configure, checkout)
- [x] Admin panel with order management
- [x] Image storage (Supabase Storage)
- [x] Order database (Supabase PostgreSQL)
- [x] Bulk image download with folder organization
- [x] Status management (pending/approved/completed)
- [x] Search and filter functionality
- [x] Responsive design
- [x] Gallery page
- [x] Secure admin authentication (API-based)

---

## 🔧 Required Before Production

### 1. **Change Admin Password** ⚠️ CRITICAL
**Current:** Default password is `admin123`

**Action Required:**
1. Add to your `.env.local` file:
   ```env
   ADMIN_PASSWORD=YourVerySecurePassword123!
   ```
2. **Never commit** `.env.local` to git (already in .gitignore)
3. In production, set this environment variable in your hosting platform

---

### 2. **Update bKash Phone Number**
**Location:** `components/CheckoutForm.tsx` line ~278

**Current:** Placeholder number

**Action Required:**
```typescript
// Update this with your actual bKash merchant number
<p className="text-sm text-paper-700 mb-2">
  Send payment to: <strong className="text-warm-700">01XXXXXXXXX</strong>
</p>
```

---

### 3. **Email Notifications** (Optional but Recommended)
**Current:** Just displays a message, no actual email sent

**Options:**
- **Resend** (recommended, free tier available)
- **SendGrid**
- **AWS SES**
- **Mailgun**

**Implementation needed:**
1. Install email service SDK
2. Create API route: `app/api/send-email/route.ts`
3. Update `OrderConfirmation.tsx` to trigger email
4. Send emails for:
   - Order confirmation to customer
   - New order notification to admin
   - Order status updates

---

### 4. **Supabase Row Level Security (RLS)** (Optional - Enhanced Security)
**Current:** Open policies (anyone can read/write)

**For better security:**
```sql
-- In Supabase SQL Editor
-- Restrict updates to authenticated users only
DROP POLICY IF EXISTS "Enable all access for orders" ON orders;

CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read orders" ON orders
  FOR SELECT TO public
  USING (true);

-- For UPDATE/DELETE, you'd need proper auth
-- For now, keep it open or implement Supabase Auth
```

---

### 5. **Error Tracking** (Recommended)
**Options:**
- **Sentry** (recommended)
- **LogRocket**
- **Bugsnag**

**Benefits:**
- Track runtime errors
- Monitor performance
- Debug production issues

---

### 6. **Analytics** (Optional)
**Options:**
- **Google Analytics 4**
- **Plausible** (privacy-focused)
- **Umami** (self-hosted)

**Track:**
- Page views
- Order completions
- Conversion rate
- Popular poster sizes

---

## 🚀 Deployment Steps

### Option A: Vercel (Recommended - Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `ADMIN_PASSWORD`
   - Click "Deploy"

3. **Custom Domain:**
   - Add your domain in Vercel settings
   - Update DNS records as instructed

---

### Option B: Other Platforms

**Netlify:**
- Similar to Vercel
- Add build command: `npm run build`
- Publish directory: `.next`

**DigitalOcean App Platform:**
- Connect GitHub repo
- Auto-detects Next.js
- Add environment variables

**AWS Amplify:**
- Connect repository
- Configure build settings
- Add environment variables

---

## 🔒 Security Best Practices

### Before Going Live:

1. **Environment Variables:**
   - ✅ Never commit `.env.local` to git
   - ✅ Use different Supabase projects for dev/prod
   - ✅ Rotate API keys if accidentally exposed

2. **Admin Access:**
   - ✅ Use strong password (20+ characters)
   - ✅ Consider adding IP whitelist
   - ✅ Enable 2FA (future enhancement)

3. **Database:**
   - ✅ Regular backups (Supabase does this automatically)
   - ✅ Monitor usage and quotas
   - ✅ Set up alerts for unusual activity

4. **File Uploads:**
   - ✅ Already limited to 10MB per image
   - ✅ Only JPEG/PNG allowed
   - ✅ Consider adding virus scanning (optional)

---

## 📊 Monitoring Checklist

After deployment, monitor:

- [ ] Order submission success rate
- [ ] Image upload success rate
- [ ] Admin panel accessibility
- [ ] Page load times
- [ ] Error rates
- [ ] Storage usage (Supabase free tier: 1GB)
- [ ] Database rows (Supabase free tier: 500MB)

---

## 🧪 Pre-Launch Testing

Test on multiple devices:

- [ ] Desktop (Chrome, Firefox, Safari, Edge)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet
- [ ] Different screen sizes

Test scenarios:

- [ ] Place order with 1 image
- [ ] Place order with 10+ images
- [ ] Upload large images (near 10MB limit)
- [ ] Test both payment methods (COD & bKash)
- [ ] Test admin login
- [ ] Test order approval flow
- [ ] Test image download (ZIP)
- [ ] Test back navigation
- [ ] Test form validation errors

---

## 📱 Optional Enhancements

### Future Features to Consider:

1. **Customer Order Tracking:**
   - Let customers check order status with order number
   - Email notifications on status changes

2. **Bulk Operations:**
   - Admin can approve/reject multiple orders at once
   - Bulk export orders to CSV

3. **Advanced Admin Features:**
   - Sales dashboard with charts
   - Revenue analytics
   - Customer database
   - Inventory management

4. **Payment Integration:**
   - bKash Payment Gateway API integration
   - Automatic payment verification
   - Invoice generation

5. **Customer Features:**
   - Save designs for later
   - Reorder previous designs
   - Customer accounts

6. **Marketing:**
   - Discount codes
   - Referral system
   - Social media sharing

---

## 🆘 Support & Maintenance

### Regular Tasks:

**Weekly:**
- Check for new orders
- Monitor error logs
- Review customer feedback

**Monthly:**
- Check Supabase usage/quotas
- Review and optimize slow queries
- Update dependencies: `npm update`

**Quarterly:**
- Security audit
- Performance optimization
- Feature planning

---

## 📞 Emergency Contacts

**If site goes down:**
1. Check Vercel/hosting status page
2. Check Supabase status: status.supabase.com
3. Review error logs in hosting dashboard
4. Check environment variables are set

**Common Issues:**
- **Orders not saving:** Check Supabase connection
- **Images not uploading:** Check storage policies
- **Admin can't login:** Check ADMIN_PASSWORD env var
- **Slow performance:** Check image optimization

---

## ✅ Final Pre-Launch Checklist

- [ ] Admin password changed from default
- [ ] bKash number updated
- [ ] All environment variables set in production
- [ ] Tested on multiple devices
- [ ] Tested complete order flow
- [ ] Admin panel tested
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Error tracking set up (optional)
- [ ] Analytics set up (optional)
- [ ] Backup plan documented
- [ ] Customer support email/phone ready

---

## 🎉 You're Ready to Launch!

Once all critical items are complete, you're good to go live!

**Post-Launch:**
1. Monitor closely for first 24-48 hours
2. Be ready to respond to customer questions
3. Collect feedback for improvements
4. Celebrate! 🎊
