'use client';

/**
 * Currency/language switcher + WhatsApp link, ported from
 * partials/header.html's utility bar. Plain <select>s rather than the
 * shadcn NativeSelect primitive: that component's wrapper div + chevron
 * icon is built for form-style dropdowns (used elsewhere from Phase 6 on),
 * not this compact, chevron-less inline control — forcing it here would
 * fight the very specific sizing this bar already had.
 */
import { WhatsApp } from '@/components/icons';
import { useLocale } from '@/components/providers/locale-provider';
import { CURRENCIES, type CurrencyCode } from '@/lib/i18n/currencies';
import type { Lang } from '@/lib/i18n/dictionaries';

const WHATSAPP_HREF = 'https://wa.me/6281100000000';

const SELECT_CLASSNAME =
  'cursor-pointer rounded-md border-0 bg-transparent py-0 pl-2 pr-6 font-mark text-[11px] uppercase tracking-[0.16em] text-white/80 hover:text-white focus-visible:outline-offset-0';

export function UtilityBar() {
  const { currency, lang, setCurrency, setLang, t } = useLocale();

  return (
    <div className="hidden bg-ink text-white/80 lg:block">
      <div className="mx-auto flex h-9 max-w-8xl items-center justify-between px-6 lg:px-8">
        <p className="font-mark text-[11px] uppercase tracking-[0.18em]">
          Open trips &amp; private charter · Labuan Bajo, Sumbawa &amp; Alor
        </p>
        <div className="flex items-center gap-1">
          <label className="sr-only" htmlFor="sf-currency">
            {t('lbl.currency')}
          </label>
          <select
            id="sf-currency"
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
          <span className="h-3 w-px bg-white/20" aria-hidden="true" />
          <label className="sr-only" htmlFor="sf-lang">
            {t('lbl.language')}
          </label>
          <select
            id="sf-lang"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className={SELECT_CLASSNAME}
          >
            <option value="en" className="text-ink-700">EN</option>
            <option value="id" className="text-ink-700">ID</option>
          </select>
          <span className="h-3 w-px bg-white/20" aria-hidden="true" />
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 px-2 font-mark text-[11px] uppercase tracking-[0.16em] hover:text-white"
          >
            <WhatsApp className="h-3.5 w-3.5" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
