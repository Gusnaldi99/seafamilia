'use client';

/**
 * Ported from partials/header.html's two <nav>s (desktop + mobile drawer) —
 * same markup, same active-state contract (aria-current="page", styled via
 * the attribute-selector rules in styles/chrome.css), just driven by
 * usePathname() + lib/nav.ts instead of tools/sync-partials.js's build-time
 * string injection.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navSection, PRIMARY_NAV } from '@/lib/nav';
import { useLocale } from '@/components/providers/locale-provider';

export function PrimaryNav({
  className,
  mobile = false,
  onNavigate,
}: {
  className?: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = navSection(pathname);
  const { t } = useLocale();

  if (mobile) {
    return (
      <nav aria-label="Primary mobile">
        {PRIMARY_NAV.map((item, i) => (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            aria-current={active === item.key ? 'page' : undefined}
            className="flex items-baseline justify-between border-b border-white/10 py-4 text-white"
          >
            <span className="font-display text-3xl">{t(item.i18n)}</span>
            <span className="font-mark text-[11px] tracking-[0.2em] text-white/40">
              {String(i + 1).padStart(2, '0')}
            </span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={className} aria-label="Primary">
      {PRIMARY_NAV.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={active === item.key ? 'page' : undefined}
          className="relative rounded-full px-3 py-2 font-mark text-[13px] uppercase tracking-[0.14em] text-ink-700 transition hover:text-flame-600"
        >
          <span>{t(item.i18n)}</span>
        </Link>
      ))}
    </nav>
  );
}
