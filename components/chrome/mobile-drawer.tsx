'use client';

/**
 * Ported from partials/header.html's mobile drawer — nav, primary CTAs,
 * currency/language, WhatsApp — now a shadcn Sheet instead of an
 * x-transition panel. The close button and the two selects stay on plain
 * markup (see utility-bar.tsx's note on why the NativeSelect wrapper
 * doesn't fit this compact, dark-on-ink control).
 */
import Link from 'next/link';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronRight, Cross, Mark, SignIn as SignInIcon, WhatsApp } from '@/components/icons';
import { PrimaryNav } from './primary-nav';
import { useLocale } from '@/components/providers/locale-provider';
import { routes } from '@/lib/routes';
import { CURRENCIES, type CurrencyCode } from '@/lib/i18n/currencies';
import type { Lang } from '@/lib/i18n/dictionaries';

const WHATSAPP_HREF = 'https://wa.me/6281100000000';
const SELECT_CLASSNAME =
  'mt-1.5 h-11 w-full rounded-xl border border-white/20 bg-white/5 px-3 font-mark text-sm text-white';

export function MobileDrawer({
  open,
  onClose,
  onSignIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
}) {
  const { currency, lang, setCurrency, setLang, t } = useLocale();

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent
        id="sf-mobile-panel"
        side="right"
        showCloseButton={false}
        aria-label="Menu"
        className="w-full max-w-sm gap-0 border-0 bg-ink p-0 text-white sm:max-w-sm"
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <span className="flex items-center gap-2.5 text-white">
            <Mark className="h-8 w-auto" aria-hidden="true" />
            <span className="font-mark text-[13px] uppercase tracking-[0.28em]">Sea Familia</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('nav.close')}
            className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition hover:bg-white/10"
          >
            <Cross className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <PrimaryNav mobile onNavigate={onClose} />

          <div className="mt-6 grid gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href={routes.plan()} onClick={onClose}>
                Plan your trip
                <ChevronRight data-icon="inline-end" className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline-light" size="lg" className="w-full">
              <Link href={routes.charter()} onClick={onClose}>
                {t('cta.charter')}
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline-light"
              size="lg"
              className="w-full"
              onClick={() => {
                onClose();
                onSignIn();
              }}
            >
              <SignInIcon data-icon="inline-start" className="h-4 w-4" aria-hidden="true" />
              <span>{t('nav.signin')}</span>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
            <label className="block">
              <span className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/50">
                {t('lbl.currency')}
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className={SELECT_CLASSNAME}
              >
                {Object.keys(CURRENCIES).map((code) => (
                  <option key={code} value={code} className="text-ink-700">
                    {code}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/50">
                {t('lbl.language')}
              </span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className={SELECT_CLASSNAME}
              >
                <option value="en" className="text-ink-700">English</option>
                <option value="id" className="text-ink-700">Bahasa Indonesia</option>
              </select>
            </label>
          </div>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener"
            className="mt-4 flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-white/70"
          >
            <WhatsApp className="h-4 w-4" aria-hidden="true" />
            WhatsApp the office
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
