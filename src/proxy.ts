import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleIntl = createIntlMiddleware(routing);

// Protected routes: Pfade die eine Session benötigen
const protectedRoutes = [
  '/admin',
  '/dashboard',
  '/profile',
  '/api/protected',
];

// Prüft, ob der Pfad durch einen der protectedRoutes abgedeckt wird
function isProtectedPath(pathname: string) {
  let normalizedPath = pathname;
  for (const locale of routing.locales) {
    if (normalizedPath.startsWith(`/${locale}/`) || normalizedPath === `/${locale}`) {
      normalizedPath = normalizedPath.replace(`/${locale}`, '');
      if (normalizedPath === '') normalizedPath = '/';
      break;
    }
  }
  return protectedRoutes.some(route => normalizedPath.startsWith(route));
}

// Neue Next.js "proxy" Entrypoint (empfohlene Methode für Middleware-ähnliche Logike)
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isProtectedPath(pathname)) {
    // Better-Auth Session-Cookie prüfen
    const sessionCookie = request.cookies.get('better-auth.session_token');

    if (!sessionCookie) {
      // Redirect unauthenticated users to the login page
      // Determine locale to redirect to the correct login page
      let locale = routing.defaultLocale;
      for (const l of routing.locales) {
        if (pathname.startsWith(`/${l}`)) {
          locale = l;
          break;
        }
      }

      const url = new URL(`/${locale}/login`, request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return handleIntl(request);
}

// Backwards compatibility: alte "middleware" Weiterleitung auf "proxy"
// export async function middleware(request: NextRequest) {
//   return proxy(request);
// }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (server API routes should not be proxied; they must remain at `/api/...`)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
