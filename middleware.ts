// ./middleware.ts

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;
    const isAuthPage = pathname === '/admin/login';

    // If user is on the login page and is already authenticated,
    // redirect them to the dashboard
    if (isAuthPage && token?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If user is trying to access admin routes and is not authenticated,
    // or is authenticated but not an admin
    if (pathname.startsWith('/admin') && !isAuthPage) {
      if (!token || token.role !== 'ADMIN') {
        const redirectUrl = new URL('/admin/login', request.url);
        redirectUrl.searchParams.set('callbackUrl', encodeURIComponent(request.url));
        return NextResponse.redirect(redirectUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Always allow the middleware to run
        return true;
      }
    }
  }
);

// Update matcher to be more specific
export const config = {
  matcher: ['/admin/:path*']
};
