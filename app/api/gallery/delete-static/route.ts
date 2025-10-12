import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl || !imageUrl.startsWith('/gallery/')) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    // Extract the file path from the URL
    // e.g., /gallery/Previous/filename.webp -> public/gallery/Previous/filename.webp
    const filePath = join(process.cwd(), 'public', imageUrl);

    try {
      await unlink(filePath);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, consider it already deleted
        return NextResponse.json({ success: true });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting static image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
