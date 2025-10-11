# 🖼️ Preview Window Feature Guide

## ✨ What's New

The upload interface now includes a **live preview window** that shows how your posters will look in real-world settings!

## 🎯 Features

### 1. **Square Upload Box**
- When you upload images, the upload box becomes square
- Maintains aspect ratio for clean layout
- Still accepts drag & drop and click to upload

### 2. **Live Preview Window**
- Appears next to the upload box when images are uploaded
- Shows your poster in a real-world setting
- **3 background images** you can slide through
- Your uploaded image appears as a framed poster

### 3. **Interactive Preview**
- **Drag to reposition**: Click and drag your poster around the scene
- **4 size presets**: Poster scales to match real-life proportions
  - 12" × 8" (smallest)
  - 18" × 12" (medium)
  - 24" × 16" (large)
  - 35" × 24" (largest)
- **Background slider**: Navigate through 3 different room settings

### 4. **Image Controls**
Each uploaded image has:
- **Thumbnail preview** with remove button
- **4 size buttons** (2×2 grid)
- **Board toggle** (slider switch)
- **Price display** (updates instantly)
- **Click to select** for preview

## 📸 Adding Your Background Images

### Step 1: Prepare Your Images
You have 3 images at **2000×1700px**. Perfect!

### Step 2: Add to Public Folder
1. Place your 3 images in `/public` folder
2. Name them:
   - `background-1.jpg`
   - `background-2.jpg`
   - `background-3.jpg`

### Step 3: Update the Component (if needed)
If you want different names, edit `components/MultiImageUpload.tsx`:

```tsx
const BACKGROUND_IMAGES = [
  '/your-image-name-1.jpg',
  '/your-image-name-2.jpg',
  '/your-image-name-3.jpg',
];
```

## 🎨 Layout Structure

```
┌─────────────────────────────────────────────┐
│  ┌──────────┐    ┌──────────────────┐      │
│  │          │    │   [< 1/3 >]      │      │
│  │  Upload  │    │                  │      │
│  │   Box    │    │   [Background]   │      │
│  │ (Square) │    │                  │      │
│  │          │    │   [Your Poster]  │      │
│  │          │    │                  │      │
│  └──────────┘    │  Drag to move    │      │
│                  └──────────────────┘      │
│                                             │
│  ┌─────────────────────────────────┐       │
│  │ [Thumb] [Size Buttons] [Toggle] │       │
│  │ [Thumb] [Size Buttons] [Toggle] │       │
│  └─────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

## 🎯 User Flow

1. **Upload images** → Upload box becomes square
2. **Preview appears** → Shows first background
3. **Click poster card** → That image shows in preview
4. **Drag poster** → Reposition in the scene
5. **Change size** → Poster scales proportionally
6. **Slide backgrounds** → See in different settings
7. **Toggle board** → See with/without frame
8. **Continue** → Proceed to checkout

## 🎨 Poster Sizes in Preview

The poster sizes are scaled proportionally to represent real-life dimensions:

| Size | Display Size | Aspect Ratio |
|------|--------------|--------------|
| 12" × 8" | 240px × 160px | 3:2 |
| 18" × 12" | 270px × 180px | 3:2 |
| 24" × 16" | 300px × 200px | 3:2 |
| 35" × 24" | 350px × 240px | ~3:2 |

## 🖱️ Interactive Features

### Drag & Drop:
- **Upload area**: Drop files to upload
- **Preview poster**: Click and drag to reposition

### Click Actions:
- **Poster cards**: Click to select for preview
- **Size buttons**: Click to change poster size
- **Background arrows**: Navigate through scenes
- **Remove button**: Delete a poster

### Visual Feedback:
- **Selected poster**: Highlighted with orange border
- **Hover states**: All buttons have hover effects
- **Active size**: Orange background
- **Drag cursor**: Changes to move cursor

## 🎨 Customization Options

### Background Images:
- **Format**: JPG or PNG
- **Size**: 2000×1700px (or similar aspect ratio)
- **Content**: Room settings, walls, living spaces
- **Suggestions**:
  - Modern living room
  - Bedroom wall
  - Office space
  - Gallery wall
  - Minimalist setting

### Poster Frame:
The poster has a white border (frame) that's always visible:
```tsx
<div className="border-4 border-white">
```

You can customize:
- Border width: `border-4` → `border-2` or `border-8`
- Border color: `border-white` → `border-gray-100`
- Shadow: `shadow-2xl` → `shadow-xl`

### Preview Container:
- **Aspect ratio**: `aspect-square` (1:1)
- **Background**: Your uploaded images
- **Overlay**: Semi-transparent controls

## 📱 Responsive Design

### Desktop (lg+):
- Upload box and preview side by side
- Full interactive features
- Drag and drop works perfectly

### Tablet:
- Stacked vertically
- Preview below upload box
- All features functional

### Mobile:
- Single column layout
- Touch-friendly drag
- Optimized button sizes

## 🚀 Technical Details

### Image Positioning:
```tsx
position: { x: number, y: number }
```
- Starts at (0, 0) - center
- Updates on drag
- Persists per image

### Size Scaling:
```tsx
displayWidth: number
displayHeight: number
```
- Proportional to real sizes
- Maintains aspect ratio
- Smooth transitions

### Background Navigation:
```tsx
currentBgIndex: 0-2
```
- Cycles through 3 images
- Wraps around (3 → 0, -1 → 2)
- Smooth transitions

## 💡 Tips for Best Results

### Background Images:
1. **Use high-quality photos** (2000×1700px)
2. **Show clear wall space** for poster placement
3. **Good lighting** to see poster details
4. **Neutral colors** to not clash with user images
5. **Different styles** (modern, cozy, minimal)

### User Experience:
1. **First image auto-selects** for preview
2. **Click any poster** to switch preview
3. **Drag freely** to find perfect position
4. **Size changes** update preview instantly
5. **Background slides** show different contexts

## 🎯 Example Background Suggestions

### Background 1: Modern Living Room
- Clean white wall
- Contemporary furniture
- Good natural light
- Minimalist decor

### Background 2: Cozy Bedroom
- Warm tones
- Bed visible
- Soft lighting
- Intimate setting

### Background 3: Gallery Wall
- Multiple frames
- Art collection
- Professional look
- Inspiration for customers

## ✅ Checklist

Before going live:
- [ ] Add 3 background images to `/public`
- [ ] Name them `background-1.jpg`, `background-2.jpg`, `background-3.jpg`
- [ ] Test upload functionality
- [ ] Test drag and drop in preview
- [ ] Test size changes
- [ ] Test background navigation
- [ ] Test on mobile devices
- [ ] Verify all images load correctly

---

**Your interactive preview window is ready!** 🎉

Just add your 3 background images to the `/public` folder and you're all set!
