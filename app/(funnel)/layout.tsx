'use client';

/**
 * Shared shell for /plan, /charter, /reserve. RevealSections (root layout)
 * already skips any page with `<body data-sticky-bar>` — the funnels' own
 * step transitions are the animation, so the scroll-reveal fade-up would
 * otherwise double up or fight the sticky footer's layout. HelpButton
 * suppresses itself via a pathname check already, so nothing to do here
 * for that.
 */
import { useEffect } from 'react';

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.setAttribute('data-sticky-bar', '');
    return () => {
      document.body.removeAttribute('data-sticky-bar');
    };
  }, []);

  return <>{children}</>;
}
