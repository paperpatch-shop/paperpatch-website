import { NextResponse } from 'next/server';

// In production, use environment variables and proper hashing
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // In production, generate a proper JWT token
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      return NextResponse.json({ 
        success: true, 
        token,
        message: 'Login successful' 
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
