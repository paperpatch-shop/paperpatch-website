import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add your IP addresses here (find yours at: https://whatismyipaddress.com/)
const ALLOWED_IPS = [
  '127.0.0.1', // localhost
  '::1', // localhost IPv6
  // Add your home/office IP here:
  // '123.456.789.012',
];

// Set to true to enable IP restriction, false to disable
const ENABLE_IP_RESTRICTION = false;

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/ahnaf')) {
    
    if (ENABLE_IP_RESTRICTION) {
      // Get client IP
      const ip = request.ip || 
                 request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 
                 'unknown';

      // Check if IP is allowed
      if (!ALLOWED_IPS.includes(ip)) {
        console.log(`Blocked access from IP: ${ip}`);
        return new NextResponse('Access Denied', { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/ahnaf/:path*',
};
