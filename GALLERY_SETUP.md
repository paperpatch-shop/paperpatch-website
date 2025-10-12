# Gallery Management Setup

## Database Setup Required

To enable the gallery management feature, you need to create a table and storage bucket in Supabase.

### 1. Create Gallery Images Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create gallery_images table
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('previous_orders', 'reviews')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON gallery_images
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON gallery_images
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON gallery_images
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_gallery_images_created_at ON gallery_images(created_at DESC);
```

### 2. Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `gallery`
4. Make it **Public**
5. Click **Create bucket**

### 3. Set Storage Policies

Run this SQL to set up storage policies:

```sql
-- Allow public read access to gallery bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
);
```

## How to Use

1. **Access Gallery Manager**: 
   - Log in to admin panel at `/ahnaf`
   - Click the **Gallery** button in the header

2. **Upload Images**:
   - Select category: "Previous Orders" or "Reviews"
   - Click upload area or drag & drop images
   - Supports JPEG, PNG, WebP (max 10MB each)
   - Can upload multiple images at once

3. **Delete Images**:
   - Hover over any image
   - Click the red trash icon
   - Confirm deletion

4. **View Gallery**:
   - Images automatically appear on `/gallery` page
   - Organized by category
   - Sorted by newest first

## Features

- ✅ Upload multiple images at once
- ✅ Separate categories for Previous Orders and Reviews
- ✅ Delete images with confirmation
- ✅ Real-time updates
- ✅ Image optimization and storage in Supabase
- ✅ Responsive grid layout
- ✅ Automatic public URL generation

## Notes

- Images are stored in Supabase Storage
- URLs are saved in the database
- Deleting an image removes both the file and database entry
- The gallery page will need to be updated to fetch from database instead of using hardcoded arrays
