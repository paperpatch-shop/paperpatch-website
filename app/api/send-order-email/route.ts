import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Received order email request:', {
      orderId: data.orderId,
      customerEmail: data.customerEmail,
      hasApiKey: !!process.env.RESEND_API_KEY,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
    });
    
    // Validate required fields
    if (!data.orderId || !data.customerEmail || !data.customerName) {
      console.error('Missing required fields:', data);
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!process.env.ADMIN_EMAIL) {
      console.error('ADMIN_EMAIL not configured');
      return NextResponse.json(
        { error: 'Admin email not configured' },
        { status: 500 }
      );
    }

    // Send emails
    console.log('Attempting to send emails...');
    await sendOrderConfirmationEmail(data);
    console.log('Emails sent successfully!');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send order emails:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Failed to send emails', details: error.message },
      { status: 500 }
    );
  }
}
