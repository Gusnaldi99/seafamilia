'use client';

/**
 * Ported from partials/header.html + layout.js's `seaChrome()`. The
 * original's single Alpine `x-data` scope (open panel, search term, sign-in
 * form) is now just component state — no `display:contents` wrapper needed,
 * since a React fragment already doesn't box.
 */
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Magnifier, Menu as MenuIcon, SignIn as SignInIcon } from '@/components/icons';
import { UtilityBar } from './utility-bar';
import { PrimaryNav } from './primary-nav';
import { SearchPanel } from './search-panel';
import { MobileDrawer } from './mobile-drawer';
import { SignInDialog } from './signin-dialog';
import { routes } from '@/lib/routes';
import { useLocale } from '@/components/providers/locale-provider';

type Panel = 'search' | 'menu' | 'signin' | null;

export function Header() {
  const [open, setOpen] = React.useState<Panel>(null);
  const { t } = useLocale();
  const headerRef = React.useRef<HTMLElement>(null);

  const toggle = (panel: Panel) => setOpen((current) => (current === panel ? null : panel));
  const closeAll = React.useCallback(() => setOpen(null), []);

  // Covers the search panel (plain markup, not a Radix primitive); Sheet and
  // Dialog already close on Escape themselves — this is a harmless no-op
  // for those two.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAll();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeAll]);

  // Sticky header, compact state. Plain DOM mutation rather than React state
  // so scrolling never triggers a re-render — same rationale as the
  // original's choice of plain JS over Alpine state here.
  React.useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let queued = false;
    const applyCompact = () => {
      queued = false;
      el.dataset.compact = window.scrollY > 72 ? 'true' : 'false';
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(applyCompact);
    };
    applyCompact();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <UtilityBar />
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-ink/10 bg-white/[0.92] backdrop-blur-md"
      >
        <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
          <div className="sf-headbar flex h-16 items-center justify-between gap-3 lg:h-20">
            <Link href={routes.home()} className="flex shrink-0 items-center gap-3 text-ink-700">
              {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, not content photography (see lib/photo.ts) */}
              <img
                src="/assets/logo/logo_no_text.png"
                alt=""
                width={768}
                height={721}
                className="sf-mark h-9 w-auto lg:h-11"
                aria-hidden="true"
              />
              <span className="flex flex-col leading-none">
                <span className="font-mark text-[15px] font-medium uppercase tracking-[0.3em] lg:text-[17px]">
                  Sea
                </span>
                <span className="font-mark text-[15px] font-medium uppercase tracking-[0.3em] text-flame lg:text-[17px]">
                  Familia
                </span>
              </span>
              <span className="sr-only">Sea Familia — home</span>
            </Link>

            <PrimaryNav className="hidden items-center gap-0.5 lg:flex" />

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggle('search')}
                aria-expanded={open === 'search'}
                aria-controls="sf-search-panel"
                aria-label={t('nav.search')}
              >
                <Magnifier className="h-5 w-5" aria-hidden="true" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggle('signin')}
                className="hidden lg:inline-flex"
              >
                <SignInIcon data-icon="inline-start" className="h-4 w-4" aria-hidden="true" />
                <span>{t('nav.signin')}</span>
              </Button>

              <Button asChild size="sm" className="hidden lg:inline-flex">
                <Link href={routes.plan()}>
                  Plan your trip
                  <ChevronRight data-icon="inline-end" className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggle('menu')}
                aria-expanded={open === 'menu'}
                aria-controls="sf-mobile-panel"
                aria-label={t('nav.menu')}
                className="lg:hidden"
              >
                <MenuIcon className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        <SearchPanel open={open === 'search'} onClose={closeAll} />
      </header>

      <MobileDrawer open={open === 'menu'} onClose={closeAll} onSignIn={() => setOpen('signin')} />
      <SignInDialog open={open === 'signin'} onClose={closeAll} />
    </>
  );
}
