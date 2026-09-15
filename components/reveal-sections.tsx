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
 *
 * That "commits synchronously" assumption doesn't hold for a <section>
 * owned by a Suspense boundary that hydrates on its own schedule — a
 * useSearchParams()-driven listing filter, say. The global scan below can
 * reach and tag one of those before React gets around to hydrating it,
 * which then surfaces as a hydration mismatch (React diffs its own
 * data-reveal-less markup against DOM we already mutated). Those sections
 * skip the global scan via a static `data-reveal-owner` marker and call
 * `useRevealSection` themselves instead, so the reveal logic only ever runs
 * after their own hydration has committed — whenever that happens to be.
 */
import { useEffect, useRef, type RefObject } from 'react';
import { usePathname } from 'next/navigation';

const GLOBAL_SELECTOR = 'main section:not([data-reveal]):not([data-reveal-owner])';

function revealEnabled() {
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) return false;
  // Funnel screens (a later phase) opt out via <body data-sticky-bar>: their
  // steps already animate via their own transitions.
  if (document.body.hasAttribute('data-sticky-bar')) return false;
  return true;
}

/** Arms one <section>: tag it, and either mark it visible immediately (already
 * on screen) or watch it. Returns the cleanup for that one element. */
function armReveal(el: Element): () => void {
  el.setAttribute('data-reveal', '');
  // Already on screen: mark visible in the same tick so it never animates.
  if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
    el.classList.add('is-visible');
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.04 }
  );
  observer.observe(el);

  return () => {
    observer.disconnect();
    // Dev-mode Strict Mode mounts, cleans up, then mounts again for the same
    // DOM. A section still pending (not yet `.is-visible`) needs its
    // `data-reveal` marker undone so the next run can re-arm it with a live
    // observer — otherwise it's stuck at opacity:0 with nothing watching it.
    // A section already marked `.is-visible` is left untouched.
    if (!el.classList.contains('is-visible')) {
      el.removeAttribute('data-reveal');
    }
  };
}

/**
 * For a <section> that lives inside a Suspense boundary hydrating on its
 * own schedule. Attach the returned ref to that section, and give the
 * section a static `data-reveal-owner` prop so the global scan below skips
 * it — this hook's own effect (which only fires once *this* section's own
 * hydration has committed) is what arms it instead.
 */
export function useRevealSection<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !revealEnabled()) return;
    return armReveal(el);
  }, []);

  return ref;
}

export function RevealSections() {
  const pathname = usePathname();

  useEffect(() => {
    if (!revealEnabled()) return;

    const cleanups: Array<() => void> = [];
    document.querySelectorAll(GLOBAL_SELECTOR).forEach((el) => {
      cleanups.push(armReveal(el));
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname]);

  return null;
}
