# 🏠 Homepage Design - Landing Page

## ✨ Overview

A beautiful, modern landing page with a video background and two large clickable sections.

## 🎯 Features

### 1. **Background Video**
- Full-screen video playing in the background
- Subtle opacity (30%) for aesthetic motion
- Dark overlay gradient for text readability
- Auto-plays, loops, and is muted
- **Placeholder video**: Mixkit sunset landscape video
- **You can replace** with your own video by changing the `src` in `Homepage.tsx`

### 2. **Two Main Sections**

#### Left Section - Gallery
- **Purpose**: View reference images and customer reviews
- **Design**: 
  - Glass morphism effect (frosted glass look)
  - Image icon
  - Subtle hover effects
  - Decorative corner elements
- **Link**: `/gallery`

#### Right Section - Start Creating (More Attractive)
- **Purpose**: Begin creating custom posters
- **Design**:
  - Vibrant orange gradient background
  - Sparkle icons with pulse animation
  - Stronger hover effects
  - Call-to-action button style
  - Glowing shadow on hover
- **Link**: `/create`

### 3. **Layout**
```
┌─────────────────────────────────────────┐
│         PAPERPATCH                      │
│   Transform Your Memories Into Art      │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │              │  │              │   │
│  │   Gallery    │  │Start Creating│   │
│  │              │  │  (Vibrant)   │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  Handcrafted with care in Dhaka        │
└─────────────────────────────────────────┘
```

## 📱 Responsive Design

### Desktop (lg+):
- Two sections side by side
- Each section: 500px height
- Full video background

### Tablet/Mobile:
- Sections stack vertically
- Each section: 400px height
- Video still covers background

## 🎨 Visual Effects

### Gallery Section:
- ✅ Frosted glass backdrop blur
- ✅ White border with opacity
- ✅ Hover: Border brightens
- ✅ Icon scales on hover
- ✅ Arrow slides right on hover
- ✅ Decorative corner circles

### Start Creating Section:
- ✅ Orange gradient background
- ✅ Sparkle animations (pulse effect)
- ✅ Icon rotates on hover
- ✅ Glowing shadow effect
- ✅ Call-to-action button with background
- ✅ Border pulse on hover
- ✅ Decorative elements scale on hover

### Background Video:
- ✅ Full-screen coverage
- ✅ Object-fit: cover
- ✅ 30% opacity
- ✅ Dark gradient overlay
- ✅ Smooth loop

## 🗂️ File Structure

### New Files Created:
1. **`components/Homepage.tsx`** - Main homepage component
2. **`app/gallery/page.tsx`** - Gallery page (placeholder)
3. **`app/create/page.tsx`** - Create/order page (moved from main page)

### Modified Files:
1. **`app/page.tsx`** - Now shows Homepage component

## 🔗 Navigation Flow

```
Homepage (/)
├── Gallery (/gallery)
│   └── Reference images & reviews
└── Start Creating (/create)
    ├── Upload Images
    ├── Checkout
    └── Confirmation
```

## 🎬 Video Replacement

To replace the placeholder video with your own:

1. Add your video file to the `public` folder
2. Update the video source in `components/Homepage.tsx`:

```tsx
<video autoPlay loop muted playsInline>
  <source src="/your-video.mp4" type="video/mp4" />
</video>
```

Or use an external URL:
```tsx
<source src="https://your-cdn.com/video.mp4" type="video/mp4" />
```

### Video Recommendations:
- **Format**: MP4 (H.264 codec)
- **Duration**: 10-30 seconds (loops seamlessly)
- **Resolution**: 1920×1080 or higher
- **File size**: < 10MB for fast loading
- **Content**: Subtle motion, not too distracting
- **Suggestions**: 
  - Paper textures
  - Printing process
  - Workspace scenes
  - Abstract art movements
  - Nature scenes (current placeholder)

## 🎨 Customization Options

### Colors:
Change gradient colors in `Homepage.tsx`:
```tsx
// Gallery section
from-paper-600/20 to-warm-600/20

// Start Creating section
from-warm-500 to-warm-600
```

### Text:
Update the title and subtitle:
```tsx
<h1>Paperpatch</h1>
<p>Transform Your Memories Into Art</p>
```

### Section Heights:
Adjust in the className:
```tsx
h-[400px] lg:h-[500px]
```

## 🚀 Features Summary

### Homepage:
- ✅ Full-screen video background
- ✅ Two large clickable sections
- ✅ Modern glass morphism design
- ✅ Smooth animations
- ✅ Responsive layout
- ✅ Clear call-to-action

### Gallery Page:
- ✅ Placeholder grid for images
- ✅ Section for customer reviews
- ✅ Back to home link
- ✅ Ready for content

### Create Page:
- ✅ Full order flow
- ✅ Upload images
- ✅ Size selection
- ✅ Checkout
- ✅ Confirmation

## 💡 User Experience

### First Visit:
1. User lands on homepage
2. Sees beautiful video background
3. Two clear options presented
4. Clicks "Start Creating" (primary action)
5. Or explores "Gallery" first

### Navigation:
- Clear back buttons on subpages
- Logo in header links to homepage
- Footer on all pages

### Visual Hierarchy:
1. **Primary**: Start Creating (orange, vibrant)
2. **Secondary**: Gallery (subtle, elegant)
3. **Background**: Video (ambient, non-distracting)

## 🎯 Design Philosophy

### Minimalist:
- Only two main choices
- Clear purpose for each
- No clutter

### Motion:
- Video background adds life
- Subtle animations
- Not overwhelming

### Modern:
- Glass morphism
- Gradients
- Smooth transitions
- Contemporary UI patterns

## 📊 Technical Details

### Performance:
- Video lazy loads
- Optimized opacity for performance
- CSS transitions (hardware accelerated)
- Responsive images

### Accessibility:
- Semantic HTML
- Clear labels
- Keyboard navigation
- Screen reader friendly

### Browser Support:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback for no video support
- Mobile optimized

---

**Your beautiful homepage is ready!** 🎉

Replace the video with your own and customize the colors/text to match your brand.
