import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Redirects the legacy static site's `*.html?query` URLs to their clean
 * Next routes, carrying over whichever query params still apply — filters
 * (destinations.html?length=short), the `?state=` QA override, and funnel
 * entry params (reserve.html?dep=X&step=3) all use the same param names on
 * both sides, so a verbatim querystring copy is correct for every listing/
 * funnel target. Detail pages are the exception: `?slug=`/`?id=` become a
 * path segment instead of surviving as a query param.
 */
const STATIC_MAP: Record<string, string> = {
  '/index.html': '/',
  '/experiences.html': '/experiences',
  '/destinations.html': '/destinations',
  '/boats.html': '/boats',
  '/departures.html': '/departures',
  '/journal.html': '/journal',
  '/discover.html': '/plan',
  '/charter.html': '/charter',
  '/reserve.html': '/reserve',
  '/our-story.html': '/our-story',
  '/faq.html': '/faq',
  '/contact.html': '/contact',
  '/policies.html': '/policies',
  '/partners.html': '/partners',
  '/components.html': '/design-system',
  '/404.html': '/',
};

const DETAIL_MAP: Record<string, { base: string; param: 'slug' | 'id' }> = {
  '/experience.html': { base: '/experiences', param: 'slug' },
  '/destination.html': { base: '/destinations', param: 'slug' },
  '/boat.html': { base: '/boats', param: 'slug' },
  '/trip.html': { base: '/itineraries', param: 'slug' },
  '/article.html': { base: '/journal', param: 'slug' },
  '/departure.html': { base: '/departures', param: 'id' },
};

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === '/itineraries') {
    return NextResponse.redirect(new URL('/destinations#itineraries', request.url));
  }

  if (pathname === '/error.html') {
    const dest = searchParams.get('mode') === 'maintenance' ? '/maintenance' : '/';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  const detail = DETAIL_MAP[pathname];
  if (detail) {
    const value = searchParams.get(detail.param);
    const url = new URL(value ? `${detail.base}/${value}` : detail.base, request.url);
    const state = searchParams.get('state');
    if (state) url.searchParams.set('state', state);
    return NextResponse.redirect(url);
  }

  const target = STATIC_MAP[pathname];
  if (target) {
    const url = new URL(target, request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/itineraries', '/(.*)\\.html'],
};
