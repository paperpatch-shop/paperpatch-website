import { NextRequest, NextResponse } from 'next/server';
import { executeBkashPayment } from '@/lib/bkash';

export async function POST(request: NextRequest) {
  try {
    const { paymentID } = await request.json();

    if (!paymentID) {
      return NextResponse.json(
        { error: 'paymentID is required' },
        { status: 400 }
      );
    }

    const paymentData = await executeBkashPayment(paymentID);

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error('bKash execute payment error:', error);
    return NextResponse.json(
      { error: 'Failed to execute bKash payment' },
      { status: 500 }
    );
  }
}
