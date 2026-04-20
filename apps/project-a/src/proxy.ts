import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'pp_session_a';
const PROTECTED_SEGMENTS = ['product', 'admin'];
const ADMIN_SEGMENTS = ['admin'];

function getRouteSegment(pathname: string): string | undefined {
  return pathname.split('/').filter(Boolean)[1];
}

function isProtected(pathname: string): boolean {
  const segment = getRouteSegment(pathname);
  return segment !== undefined && PROTECTED_SEGMENTS.includes(segment);
}

function isAdminRoute(pathname: string): boolean {
  const segment = getRouteSegment(pathname);
  return segment !== undefined && ADMIN_SEGMENTS.includes(segment);
}

function redirectToLogin(request: NextRequest): NextResponse {
  const market = request.nextUrl.pathname.split('/')[1] ?? 'en';
  const loginUrl = new URL(`/${market}/login`, request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function redirectToHome(request: NextRequest): NextResponse {
  const market = request.nextUrl.pathname.split('/')[1] ?? 'en';
  return NextResponse.redirect(new URL(`/${market}`, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('[proxy]', pathname, 'protected:', isProtected(pathname));

  if (!isProtected(pathname)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return redirectToLogin(request);

  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');

  try {
    const { payload } = await jwtVerify(token, secret);

    if (isAdminRoute(pathname) && payload.role !== 'admin') {
      return redirectToHome(request);
    }

    return NextResponse.next();
  } catch {
    const response = redirectToLogin(request);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: [
    '/:market/product/:slug*',
    '/:market/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
