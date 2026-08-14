'use client';

/**
 * Replaces `SEA.store` + `SEA.hydrate()` (assets/js/data.js §1, §12). One
 * React Context instead of a global plus a DOM-mutation pass: components
 * read `useLocale()` and render the right string/price directly, so there's
 * nothing to "hydrate" after the fact and no MutationObserver watching for
 * late content.
 *
 * Server-rendered markup always starts at the defaults (USD/en) — the same
 * thing the original static pages shipped before any client JS ran. The
 * stored preference, if any, is applied in an effect on mount, same timing
 * as the original's hydration pass.
 */
import * as React from 'react';
import { CURRENCIES, DEFAULT_CURRENCY, type CurrencyCode } from '@/lib/i18n/currencies';
import { DEFAULT_LANG, DICTIONARIES, type Lang, type TranslationKey } from '@/lib/i18n/dictionaries';
import {
  formatDate,
  formatDateRange,
  formatGuests,
  formatMoney,
  formatMonthLabel,
  formatNights,
  type FormatOpts,
} from '@/lib/format';
import { toast } from '@/lib/toast';

const CURRENCY_KEY = 'sf.currency';
const LANG_KEY = 'sf.lang';

const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];
const LANGS = Object.keys(DICTIONARIES) as Lang[];

interface LocaleContextValue {
  currency: CurrencyCode;
  lang: Lang;
  setCurrency: (next: CurrencyCode) => void;
  setLang: (next: Lang) => void;
  t: (key: TranslationKey) => string;
  money: (usd: number | null | undefined, opts?: { fallback?: string }) => string;
  date: (iso: string, opts?: { long?: boolean }) => string;
  dateRange: (iso: string, nights: number) => string;
  monthLabel: (iso: string) => string;
  nights: (n: number | null | undefined) => string;
  guests: (n: number | null | undefined) => string;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

/** localStorage can throw (Safari private browsing, disabled storage, a
 * test environment with no storage backend) — same defensive posture as
 * the original's `store.currency`/`store.lang` getters/setters. */
function readStored<T extends string>(key: string, valid: readonly T[], fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v && (valid as readonly string[]).includes(v) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Nothing to do — the preference just won't survive a reload.
  }
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = React.useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [lang, setLangState] = React.useState<Lang>(DEFAULT_LANG);

  React.useEffect(() => {
    // localStorage doesn't exist during SSR, so the stored preference (if
    // any) can only be read once mounted on the client — the same timing
    // as the original's SEA.hydrate() pass.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrencyState(readStored(CURRENCY_KEY, CURRENCY_CODES, DEFAULT_CURRENCY));
    setLangState(readStored(LANG_KEY, LANGS, DEFAULT_LANG));
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setCurrency = React.useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    writeStored(CURRENCY_KEY, next);
    toast({
      title: `Prices now in ${next}`,
      body: 'Converted at our weekly rate. Your invoice is issued in the currency you choose at checkout.',
      variant: 'info',
    });
  }, []);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    writeStored(LANG_KEY, next);
  }, []);

  const value = React.useMemo<LocaleContextValue>(() => {
    const opts: FormatOpts = { currency, lang };
    return {
      currency,
      lang,
      setCurrency,
      setLang,
      t: (key) => DICTIONARIES[lang][key],
      money: (usd, o) => formatMoney(usd, { ...opts, ...o }),
      date: (iso, o) => formatDate(iso, { ...opts, ...o }),
      dateRange: (iso, nights) => formatDateRange(iso, nights, opts),
      monthLabel: (iso) => formatMonthLabel(iso, opts),
      nights: (n) => formatNights(n, opts),
      guests: (n) => formatGuests(n, opts),
    };
  }, [currency, lang, setCurrency, setLang]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale() must be called within a <LocaleProvider>');
  return ctx;
}

/** Renders a dictionary string for the current language — replaces the
 * original's `data-i18n="key"` attribute-rewrite convention. */
export function T({ k }: { k: TranslationKey }) {
  return <>{useLocale().t(k)}</>;
}

/** Renders a USD amount converted into the current currency — replaces the
 * original's `data-usd="1234"` attribute-rewrite convention. */
export function Money({ usd, fallback }: { usd: number | null | undefined; fallback?: string }) {
  return <>{useLocale().money(usd, { fallback })}</>;
}

/** "7 nights" / "7 malam" — language-dependent pluralization. */
export function Nights({ n }: { n: number | null | undefined }) {
  return <>{useLocale().nights(n)}</>;
}

/** "8 guests" / "8 tamu". */
export function Guests({ n }: { n: number | null | undefined }) {
  return <>{useLocale().guests(n)}</>;
}

export function DateLabel({ iso, long }: { iso: string; long?: boolean }) {
  return <>{useLocale().date(iso, { long })}</>;
}

export function DateRangeLabel({ iso, nights }: { iso: string; nights: number }) {
  return <>{useLocale().dateRange(iso, nights)}</>;
}
