import { NextRequest, NextResponse } from 'next/server';
import { createBkashPayment } from '@/lib/bkash';

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId } = await request.json();

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    // Callback URL for bKash to redirect after payment
    const callbackURL = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bkash/callback`;

    const paymentData = await createBkashPayment(amount, orderId, callbackURL);

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error('bKash create payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create bKash payment' },
      { status: 500 }
    );
  }
}
