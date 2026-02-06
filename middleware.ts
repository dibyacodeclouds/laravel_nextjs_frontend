// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const allCookies = request.cookies.getAll();
  console.log('--- Middleware Debug ---');
  console.log('Path:', request.nextUrl.pathname);
  console.log('All Cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 10)}...`));
  const token = request.cookies.get('jwt_token')?.value;
  console.log('Token found:', !!token);
  console.log('------------------------');

  // Check if user is authenticated
  if (!token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Optional: Verify token validity here
  // You can decode JWT or make API calls if needed

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    // Add other protected routes
  ],
};