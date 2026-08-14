'use client';

/**
 * Fade-and-rise on scroll, once per <section>, ported from layout.js. The
 * hidden state is only ever applied here — so no-JS and reduced-motion
 * visitors see plain, fully visible content (see the [data-reveal] rules in
 * styles/chrome.css).
 *
 * The original re-armed itself via a MutationObserver because Alpine
 * injected content after this script had already run. React instead
 * commits a page's DOM synchronously before this effect fires, so the
 * MutationObserver is replaced with a `pathname` dependency: this component
 * lives once in the root layout (which persists across client-side
 * navigations), and re-arms whenever the route changes.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function RevealSections() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) return;
    // Funnel screens (a later phase) opt out via <body data-sticky-bar>: their
    // steps already animate via their own transitions.
    if (document.body.hasAttribute('data-sticky-bar')) return;

    const pending = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
          pending.delete(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.04 }
    );

    document.querySelectorAll('main section:not([data-reveal])').forEach((el) => {
      el.setAttribute('data-reveal', '');
      // Already on screen: mark visible in the same tick so it never animates.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add('is-visible');
        return;
      }
      observer.observe(el);
      pending.add(el);
    });

    return () => {
      observer.disconnect();
      // Dev-mode Strict Mode mounts, cleans up, then mounts again for the
      // same DOM. Disconnecting above kills any observer still waiting on a
      // section, but that section already has `data-reveal` — so the next
      // run's `:not([data-reveal])` query would skip it, leaving it stuck at
      // opacity:0 with nothing left watching it. Undoing the marker on
      // exactly the sections still pending lets a re-run re-arm them with a
      // live observer; sections already marked `.is-visible` are untouched.
      pending.forEach((el) => el.removeAttribute('data-reveal'));
    };
  }, [pathname]);

  return null;
}
