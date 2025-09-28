import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from './types/auth';

const protectedRoutes = ['/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.has('tnvn_auth');
  const role = request.cookies.get('tnvn_role')?.value as UserRole | undefined;
  const allowedRoles: UserRole[] = ['Landlord', 'Marketer', 'Broker'];

  if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile'],
};
