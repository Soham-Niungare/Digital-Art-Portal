// src/middleware.js
import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request) {
  const token = request.cookies.get('token');
  const path = request.nextUrl.pathname;
  console.log(token);
  console.log('Current path:', path);
  // Check if it's an auth page
  if (path.startsWith('/auth')) {
    if (token) {
      try {
        const decoded = jwtDecode(token.value);
        const role = decoded.role?.toLowerCase();
        console.log(role);
        if (!role) {
          return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protected routes
  if (path.startsWith('/dashboard')) {
    if (!token) {
      console.log('No token, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    try {
      const decoded = jwtDecode(token.value);
      console.log('Decoded token:', decoded);
      const role = decoded.role;
      console.log('User role:', role);

      // Role-based access control
      if (path.includes('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/customer', request.url));
      }
      if (path.includes('/artist') && role !== 'ARTIST') {
        return NextResponse.redirect(new URL('/dashboard/customer', request.url));
      }
      return NextResponse.next();
    } catch(error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
};