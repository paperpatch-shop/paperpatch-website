# Testing Checklist for Paperpatch

Use this checklist to verify all features work correctly before deployment.

## Pre-Testing Setup

- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Browser console open (F12)
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile device or responsive mode

## Customer Flow Testing

### 1. Product Selection

- [ ] Page loads without errors
- [ ] All 4 standard sizes display correctly
- [ ] Prices show for each size
- [ ] Can select each standard size
- [ ] Selected size highlights properly
- [ ] "Without Board" option works
- [ ] "With Board" option works
- [ ] Board option disabled for 35"×24" size
- [ ] Prices update when board option changes
- [ ] Can switch to "Custom Size" tab
- [ ] Custom height input accepts numbers
- [ ] Custom width input accepts numbers
- [ ] Error shows if height < 12 inches
- [ ] Custom price calculates correctly
- [ ] "Continue" button works
- [ ] Progress indicator updates to step 2

### 2. Image Upload

- [ ] Upload area displays correctly
- [ ] Can click to browse files
- [ ] File picker opens
- [ ] Can select JPEG image
- [ ] Can select PNG image
- [ ] Image preview appears after selection
- [ ] Can drag and drop image
- [ ] Drag feedback shows (border highlight)
- [ ] Error shows for non-image files
- [ ] Error shows for files > 10MB
- [ ] "Back" button returns to step 1
- [ ] "Continue" button works with image
- [ ] "Continue" disabled without image
- [ ] Progress indicator updates to step 3

### 3. Mockup Preview (Right Column)

- [ ] Preview card displays throughout flow
- [ ] Shows placeholder when no image
- [ ] Shows uploaded image when selected
- [ ] Image maintains aspect ratio
- [ ] Board frame shows when "With Board" selected
- [ ] Board frame hidden when "Without Board"
- [ ] Dimensions display correctly
- [ ] Board option displays correctly
- [ ] Wall texture background visible
- [ ] Shadow effects render properly
- [ ] Responsive on mobile

### 4. Checkout Form

- [ ] Form displays correctly
- [ ] All input fields present
- [ ] Name field accepts text
- [ ] Phone field accepts numbers
- [ ] Email field accepts email format
- [ ] Address textarea accepts text
- [ ] City field accepts text
- [ ] "Inside Dhaka" option selectable
- [ ] "Outside Dhaka" option selectable
- [ ] Shipping cost updates based on location
- [ ] Total amount calculates correctly
- [ ] COD payment option selectable
- [ ] bKash payment option selectable
- [ ] bKash instructions show when selected
- [ ] Transaction ID field appears for bKash
- [ ] Validation errors show for empty fields
- [ ] Phone validation works (BD format)
- [ ] Email validation works
- [ ] Order summary shows all details
- [ ] "Back" button returns to step 2
- [ ] "Place Order" button works
- [ ] Button disabled during submission
- [ ] Progress indicator updates to step 4

### 5. Order Confirmation

- [ ] Confirmation page displays
- [ ] Success icon shows
- [ ] Order number displays
- [ ] Order number is unique
- [ ] All order details correct
- [ ] Poster specifications shown
- [ ] Delivery address shown
- [ ] Payment method shown
- [ ] Total amount shown
- [ ] "What's Next" steps display
- [ ] Email confirmation message shows
- [ ] "Create Another Poster" button works
- [ ] Returns to step 1 when clicked
- [ ] Form resets properly

## Admin Flow Testing

### 1. Admin Login

- [ ] Admin page loads (`/admin`)
- [ ] Login form displays
- [ ] Password field is masked
- [ ] Can enter password
- [ ] Demo password works (`admin123`)
- [ ] Wrong password shows error
- [ ] Advances to 2FA step
- [ ] 2FA code field displays
- [ ] Can enter 6-digit code
- [ ] Demo code works (`123456`)
- [ ] Wrong code shows error
- [ ] "Back" button returns to password
- [ ] Successfully logs in
- [ ] Dashboard displays

### 2. Admin Dashboard

- [ ] Dashboard loads without errors
- [ ] Header shows "Paperpatch Admin"
- [ ] Logout button visible
- [ ] Stats cards display
- [ ] Total orders count correct
- [ ] Pending orders count correct
- [ ] Approved orders count correct
- [ ] Rejected orders count correct
- [ ] Total revenue calculates correctly
- [ ] Search bar present
- [ ] Status filter dropdown present
- [ ] Orders list displays

### 3. Order Management

- [ ] Test orders appear in list
- [ ] Order cards show summary info
- [ ] Order number displays
- [ ] Status badge shows correct color
- [ ] Customer name visible
- [ ] Poster size visible
- [ ] Total amount visible
- [ ] Quick approve button works (pending orders)
- [ ] Quick reject button works (pending orders)
- [ ] Can click to expand order
- [ ] Expanded view shows all details

### 4. Order Details (Expanded)

- [ ] Order details section shows
- [ ] Poster size correct
- [ ] Board option correct
- [ ] Poster price shown
- [ ] Can click edit icon on price
- [ ] Price input field appears
- [ ] Can enter new price
- [ ] Save button works
- [ ] Cancel button works
- [ ] Shipping cost shown
- [ ] Total recalculates
- [ ] Customer info section shows
- [ ] Name, phone, email correct
- [ ] Address displays properly
- [ ] Payment info section shows
- [ ] Payment method correct
- [ ] bKash transaction ID shows (if applicable)
- [ ] Order date formatted correctly
- [ ] Approved date shows (if approved)
- [ ] Uploaded image displays
- [ ] Can click "View Full Size"
- [ ] Image opens in new tab
- [ ] Admin notes textarea present
- [ ] Can type notes
- [ ] Notes save with status update

### 5. Order Status Updates

- [ ] Approve button works for pending orders
- [ ] Status updates to "approved"
- [ ] Approved timestamp set
- [ ] Stats update immediately
- [ ] Reject button works for pending orders
- [ ] Status updates to "rejected"
- [ ] Stats update immediately
- [ ] Mark completed button shows for approved
- [ ] Status updates to "completed"
- [ ] Revenue includes completed orders
- [ ] Order card updates without page refresh

### 6. Filtering & Search

- [ ] "All Orders" filter shows all
- [ ] "Pending" filter shows only pending
- [ ] "Approved" filter shows only approved
- [ ] "Rejected" filter shows only rejected
- [ ] "Completed" filter shows only completed
- [ ] Search by order number works
- [ ] Search by customer name works
- [ ] Search by phone number works
- [ ] Search by email works
- [ ] Search is case-insensitive
- [ ] Filters and search work together
- [ ] Results update in real-time

### 7. Session Management

- [ ] Session persists on page refresh
- [ ] Logout button works
- [ ] Redirects to login after logout
- [ ] Session expires after 8 hours (test timestamp)
- [ ] Expired session redirects to login

## Responsive Design Testing

### Mobile (< 640px)

- [ ] Header displays properly
- [ ] Logo and title readable
- [ ] Navigation accessible
- [ ] Product selection cards stack
- [ ] Size options readable
- [ ] Board options stack vertically
- [ ] Image upload area sized correctly
- [ ] Preview shows below form
- [ ] Checkout form fields full width
- [ ] Buttons full width
- [ ] Admin dashboard stats stack
- [ ] Order cards readable
- [ ] Expanded order details scroll

### Tablet (640px - 1024px)

- [ ] Two-column layout works
- [ ] Stats cards in 2 columns
- [ ] Forms properly sized
- [ ] Preview visible alongside
- [ ] Touch targets adequate size

### Desktop (> 1024px)

- [ ] Full layout displays
- [ ] Preview sticky on scroll
- [ ] Stats in 5 columns
- [ ] Order details in 2 columns
- [ ] All spacing correct

## Data Persistence Testing

### LocalStorage (Default)

- [ ] Orders save to localStorage
- [ ] Orders persist after page refresh
- [ ] Multiple orders accumulate
- [ ] Order updates save
- [ ] Status changes persist
- [ ] Price changes persist
- [ ] Notes save correctly

### Supabase (If Configured)

- [ ] Images upload to storage
- [ ] Image URLs generated
- [ ] Images accessible via URL
- [ ] Orders save to database
- [ ] Orders fetch on dashboard load
- [ ] Order updates save to database
- [ ] Status changes persist
- [ ] Multiple sessions see same data

## Error Handling Testing

- [ ] Invalid image format shows error
- [ ] Large file shows error
- [ ] Empty form fields show validation
- [ ] Invalid phone shows error
- [ ] Invalid email shows error
- [ ] Network errors handled gracefully
- [ ] Missing Supabase config falls back to localStorage
- [ ] Console shows no critical errors

## Performance Testing

- [ ] Initial page load < 3 seconds
- [ ] Image upload processes quickly
- [ ] Preview updates instantly
- [ ] Form submission responsive
- [ ] Admin dashboard loads fast
- [ ] Order list renders smoothly
- [ ] No lag when expanding orders
- [ ] Filtering/search instant

## Browser Compatibility

### Chrome/Edge
- [ ] All features work
- [ ] Styling correct
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Styling correct
- [ ] No console errors

### Safari
- [ ] All features work
- [ ] Styling correct
- [ ] No console errors

### Mobile Browsers
- [ ] iOS Safari works
- [ ] Chrome Mobile works
- [ ] Touch interactions work

## Build & Deployment Testing

- [ ] `npm run build` completes successfully
- [ ] No build errors
- [ ] No build warnings (critical)
- [ ] `out` folder generated
- [ ] All pages in `out` folder
- [ ] Static assets copied
- [ ] Can serve `out` folder locally
- [ ] Production build works correctly

## Security Testing

- [ ] Admin page requires login
- [ ] Cannot access dashboard without auth
- [ ] Session tokens secure
- [ ] No sensitive data in console
- [ ] No API keys in client code
- [ ] XSS protection working
- [ ] Input sanitization working

## Accessibility Testing

- [ ] Can navigate with keyboard
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Buttons have hover states
- [ ] Form labels present
- [ ] Error messages clear
- [ ] Color contrast adequate
- [ ] Images have alt text (where applicable)

## Final Checks

- [ ] No console errors
- [ ] No console warnings (critical)
- [ ] All images load
- [ ] All fonts load
- [ ] Favicon displays (if added)
- [ ] Page titles correct
- [ ] Meta descriptions present
- [ ] Social sharing works (if configured)
- [ ] Analytics tracking (if configured)

## Production Readiness

- [ ] Change admin demo credentials
- [ ] Update bKash payment number
- [ ] Configure Supabase (if using)
- [ ] Set up email notifications (if using)
- [ ] Add custom domain (if applicable)
- [ ] Enable HTTPS
- [ ] Test on production URL
- [ ] Monitor for errors
- [ ] Set up backups
- [ ] Document admin procedures

---

## Bug Reporting Template

If you find issues, document them:

**Issue**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happens]
**Browser**: [Chrome/Firefox/Safari/etc.]
**Device**: [Desktop/Mobile/Tablet]
**Console Errors**: [Any errors from console]

---

✅ **All tests passed? You're ready to deploy!**
