'use client';

/** Ported from data.js's `badge()` (§11). An unknown status falls back to
 * `open` rather than rendering the raw string; never colour alone — every
 * badge carries a text label. */
import { useLocale } from '@/components/providers/locale-provider';
import type { TranslationKey } from '@/lib/i18n/dictionaries';
import type { DepartureStatus } from '@/lib/data/types';
import { cn } from '@/lib/utils';

const STATUS: Record<DepartureStatus, { key: TranslationKey; cls: string }> = {
  open: { key: 'st.open', cls: 'bg-mist-100 text-ink-700 ring-mist-300' },
  limited: { key: 'st.limited', cls: 'bg-flame/10 text-flame-700 ring-flame/30' },
  waitlist: { key: 'st.waitlist', cls: 'bg-sand-200 text-deep-700 ring-sand-300' },
  closed: { key: 'st.closed', cls: 'bg-sand-200 text-ink/50 ring-sand-300' },
};

export function StatusBadge({ status, extra }: { status: DepartureStatus; extra?: string }) {
  const { t } = useLocale();
  const s = STATUS[status] ?? STATUS.open;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mark font-medium uppercase tracking-[0.12em] ring-1 ring-inset',
        s.cls
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {t(s.key)}
      {extra ? ` · ${extra}` : ''}
    </span>
  );
}
