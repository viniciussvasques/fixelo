import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'pt', 'es'];
const defaultLocale = 'en';

function hasAuthTokenCookie(request: NextRequest) {
  return !!request.cookies.get('auth_token')?.value
}

export default function middleware(request: NextRequest) {
  // Get locale from cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // Get locale from URL
  const pathname = request.nextUrl.pathname;

  // Proteger rotas do dashboard (server side)
  const dashboardRegex = /^\/(en|pt|es)\/dashboard(\/.*)?$/
  if (dashboardRegex.test(pathname)) {
    if (!hasAuthTokenCookie(request)) {
      const localeFromPath = pathname.split('/')[1] as string
      const loginURL = new URL(`/${localeFromPath}/auth`, request.url)
      return NextResponse.redirect(loginURL)
    }
  }
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If URL doesn't have locale, redirect to locale from cookie or default
  if (!pathnameHasLocale) {
    const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // If URL has locale but cookie has different locale, update URL to match cookie
  if (cookieLocale && locales.includes(cookieLocale)) {
    const currentLocale = pathname.split('/')[1];
    if (currentLocale !== cookieLocale) {
      const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
      const newUrl = new URL(`/${cookieLocale}${pathWithoutLocale}`, request.url);
      return NextResponse.redirect(newUrl);
    }
  }

  // Continue with next-intl middleware
  const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
  });

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 