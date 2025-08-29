import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/create', '/my-posts', '/posts/[id]/edit'];
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => {
    // Handle dynamic routes
    if (route.includes('[id]')) {
      const pattern = route.replace(/\[id\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return pathname.startsWith(route);
  });

  if (isProtectedRoute) {
    // Check for token in request (this is basic - in production you'd verify the JWT)
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      // Redirect to login if no token found
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create/:path*', '/my-posts/:path*', '/posts/:path*/edit/:path*']
};