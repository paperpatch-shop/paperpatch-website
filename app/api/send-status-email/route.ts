import { NextRequest, NextResponse } from 'next/server';
import { sendReadyToShipEmail, sendDeliveredEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Received status email request:', {
      orderId: data.orderId,
      customerEmail: data.customerEmail,
      status: data.status,
    });
    
    // Validate required fields
    if (!data.orderId || !data.customerEmail || !data.customerName || !data.status) {
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

    // Send appropriate email based on status
    console.log('Attempting to send status email...');
    
    if (data.status === 'ready_to_ship') {
      await sendReadyToShipEmail({
        orderId: data.orderId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
      });
    } else if (data.status === 'completed') {
      await sendDeliveredEmail({
        orderId: data.orderId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid status for email notification' },
        { status: 400 }
      );
    }
    
    console.log('Status email sent successfully!');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send status email:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
