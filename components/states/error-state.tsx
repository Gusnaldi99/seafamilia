'use client';

/** Error — never shows the raw message, always offers retry. Ported from
 * data.js's `states.error()`. `onRetry` replaces the original's bubbling
 * `sf-retry` custom event with a plain callback prop. */
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Refresh, WarningTriangle } from '@/components/icons';
import { useLocale } from '@/components/providers/locale-provider';
import { routes } from '@/lib/routes';

export interface ErrorStateProps {
  title?: string;
  body?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, body, onRetry }: ErrorStateProps) {
  const { t } = useLocale();
  return (
    <div
      role="alert"
      className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-flame/25 bg-flame/5 px-6 py-14 text-center"
    >
      <WarningTriangle className="h-12 w-12 text-flame" aria-hidden="true" />
      <h3 className="mt-5 font-display text-xl text-ink-700">{title ?? t('sys.error')}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
        {body ??
          'The connection dropped on the way to our schedule service. Nothing is wrong with your booking — try again, and if it keeps happening the office answers on WhatsApp.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button type="button" onClick={onRetry} size="lg">
            <Refresh data-icon="inline-start" className="h-4 w-4" aria-hidden="true" />
            {t('cta.retry')}
          </Button>
        ) : null}
        <Button asChild variant="outline" size="lg" className="hover:border-ink hover:bg-ink hover:text-white">
          <Link href={routes.contact()}>{t('cta.help')}</Link>
        </Button>
      </div>
    </div>
  );
}
