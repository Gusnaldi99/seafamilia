/**
 * Formatters, ported from assets/js/data.js's `fmt` object (§1) — but pure:
 * the original implicitly read `SEA.store.currency`/`.lang` from
 * localStorage, which works in a browser-global script but is unsafe in a
 * Server Component (no localStorage) and a hydration hazard in a Client one.
 * Every formatter here takes currency/lang explicitly instead; callers
 * (components consuming useLocale(), Server Components reading a cookie)
 * decide where those come from.
 *
 * Defaults ({currency: 'USD', lang: 'en'}) match what the original static
 * markup shipped before any client-side hydration ran.
 */
import { CURRENCIES, DEFAULT_CURRENCY, type CurrencyCode } from './i18n/currencies';
import { DEFAULT_LANG, type Lang } from './i18n/dictionaries';

export interface FormatOpts {
  currency?: CurrencyCode;
  lang?: Lang;
}

const MONTHS: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
};
const MONTHS_LONG: Record<Lang, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  id: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
};

/** Parses a YYYY-MM-DD string using local calendar fields (not UTC), so it's
 * timezone-safe for SSR: this only ever reads back getFullYear/Month/Date. */
export function parseISO(iso: string | null | undefined): Date | null {
  if (!iso || typeof iso !== 'string') return null;
  const p = iso.split('-');
  if (p.length !== 3) return null;
  const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function addDays(iso: string, n: number): string | null {
  const d = parseISO(iso);
  if (!d) return null;
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/** Price in the requested currency. null/undefined/NaN → "On request". */
export function formatMoney(usd: number | null | undefined, opts?: FormatOpts & { fallback?: string }): string {
  const { currency = DEFAULT_CURRENCY, lang = DEFAULT_LANG, fallback } = opts ?? {};
  if (usd === null || usd === undefined || Number.isNaN(Number(usd))) {
    return fallback ?? (lang === 'id' ? 'Atas permintaan' : 'On request');
  }
  const c = CURRENCIES[currency] ?? CURRENCIES.USD;
  let v = Number(usd) * c.rate;
  // Indonesian rupiah reads better rounded to the nearest 10k.
  if (c.code === 'IDR') v = Math.round(v / 10000) * 10000;
  try {
    return new Intl.NumberFormat(c.locale, {
      style: 'currency',
      currency: c.code,
      minimumFractionDigits: c.decimals,
      maximumFractionDigits: c.decimals,
    }).format(v);
  } catch {
    return c.symbol + Math.round(v).toLocaleString();
  }
}

export function formatDate(iso: string, opts?: FormatOpts & { long?: boolean; fallback?: string }): string {
  const { lang = DEFAULT_LANG, long, fallback = '—' } = opts ?? {};
  const d = parseISO(iso);
  if (!d) return fallback;
  const m = (long ? MONTHS_LONG : MONTHS)[lang][d.getMonth()];
  return lang === 'id' ? `${d.getDate()} ${m} ${d.getFullYear()}` : `${m} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "Sep 12 – 19, 2026" / "12 – 19 Sep 2026" — collapses shared month+year. */
export function formatDateRange(iso: string, nights: number, opts?: FormatOpts): string {
  const { lang = DEFAULT_LANG } = opts ?? {};
  const a = parseISO(iso);
  if (!a) return '—';
  const b = new Date(a.getTime());
  b.setDate(b.getDate() + (Number(nights) || 0));
  const ma = MONTHS[lang][a.getMonth()];
  const mb = MONTHS[lang][b.getMonth()];
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  if (lang === 'id') {
    return sameMonth
      ? `${a.getDate()}–${b.getDate()} ${ma} ${b.getFullYear()}`
      : `${a.getDate()} ${ma} – ${b.getDate()} ${mb} ${b.getFullYear()}`;
  }
  return sameMonth
    ? `${ma} ${a.getDate()}–${b.getDate()}, ${b.getFullYear()}`
    : `${ma} ${a.getDate()} – ${mb} ${b.getDate()}, ${b.getFullYear()}`;
}

export function formatMonthLabel(iso: string, opts?: FormatOpts): string {
  const { lang = DEFAULT_LANG } = opts ?? {};
  const d = parseISO(iso);
  if (!d) return '—';
  return `${MONTHS_LONG[lang][d.getMonth()]} ${d.getFullYear()}`;
}

export function formatNights(n: number | null | undefined, opts?: FormatOpts): string {
  const { lang = DEFAULT_LANG } = opts ?? {};
  if (!n && n !== 0) return '—';
  const word = lang === 'id' ? 'malam' : n === 1 ? 'night' : 'nights';
  return `${n} ${word}`;
}

/** Human duration, never "Pax"-style jargon. */
export function formatGuests(n: number | null | undefined, opts?: FormatOpts): string {
  const { lang = DEFAULT_LANG } = opts ?? {};
  if (!n) return '—';
  const word = lang === 'id' ? 'tamu' : n === 1 ? 'guest' : 'guests';
  return `${n} ${word}`;
}

/**
 * Booking reference: SF-26A7K4 — deterministic length, safe to read aloud.
 * MUST be called with an explicit seed from a Server Action, never with the
 * original's `performance.now()` fallback — that's a render-time side
 * effect and unavailable during SSR. Production should let the server issue
 * the reference instead of generating one here at all (HANDOFF §11 item 6).
 */
export function formatReference(seed: number): string {
  const alphabet = 'ACDEFGHJKLMNPQRTUVWXY3479';
  let n = Math.abs(Math.floor(seed));
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += alphabet[n % alphabet.length];
    n = Math.floor(n / alphabet.length) + (i + 7) * 13;
  }
  return 'SF-' + out;
}
