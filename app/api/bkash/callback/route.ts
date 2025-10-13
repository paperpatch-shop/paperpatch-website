import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentID = searchParams.get('paymentID');
  const status = searchParams.get('status');

  // Redirect to a page that handles the payment result
  if (status === 'success' && paymentID) {
    return NextResponse.redirect(
      new URL(`/payment-result?paymentID=${paymentID}&status=success`, request.url)
    );
  } else if (status === 'failure') {
    return NextResponse.redirect(
      new URL(`/payment-result?status=failure`, request.url)
    );
  } else if (status === 'cancel') {
    return NextResponse.redirect(
      new URL(`/payment-result?status=cancel`, request.url)
    );
  }

  return NextResponse.redirect(new URL('/', request.url));
}
