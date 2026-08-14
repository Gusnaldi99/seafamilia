// Ported verbatim from assets/js/data.js §1.
export type CurrencyCode = 'USD' | 'IDR' | 'EUR' | 'AUD' | 'SGD';

export interface CurrencyDef {
  code: CurrencyCode;
  symbol: string;
  /** Multiplier from USD. */
  rate: number;
  decimals: number;
  /** BCP 47 locale used for Intl.NumberFormat. */
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  USD: { code: 'USD', symbol: '$', rate: 1, decimals: 0, locale: 'en-US' },
  IDR: { code: 'IDR', symbol: 'Rp', rate: 16250, decimals: 0, locale: 'id-ID' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, decimals: 0, locale: 'de-DE' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.52, decimals: 0, locale: 'en-AU' },
  SGD: { code: 'SGD', symbol: 'S$', rate: 1.34, decimals: 0, locale: 'en-SG' },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';
