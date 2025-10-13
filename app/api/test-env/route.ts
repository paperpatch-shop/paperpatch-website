import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    resendKeyLength: process.env.RESEND_API_KEY?.length || 0,
    adminEmail: process.env.ADMIN_EMAIL || 'not set',
  });
}
