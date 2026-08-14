'use client';

/** Empty result — always offers a way out. Ported from data.js's
 * `states.empty()`. The original dispatched a bubbling `sf-reset` custom
 * event because Alpine's x-html output can't carry real handlers; here
 * `onReset` is just a callback prop. */
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmptyStateIcon } from '@/components/icons';
import { useLocale } from '@/components/providers/locale-provider';
import { routes } from '@/lib/routes';

export interface EmptyStateProps {
  title?: string;
  body?: string;
  onReset?: () => void;
  resetLabel?: string;
  altHref?: string;
  altLabel?: string;
}

export function EmptyState({ title, body, onReset, resetLabel, altHref, altLabel }: EmptyStateProps) {
  const { t } = useLocale();
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-mist-300 bg-sand/70 px-6 py-14 text-center">
      <EmptyStateIcon className="mx-auto h-12 w-12 text-mist-400" aria-hidden="true" />
      <h3 className="mt-5 font-display text-xl text-ink-700">{title ?? 'No matches — yet'}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
        {body ??
          'Nothing fits every filter at once. Widen one of them, or let us suggest something — a lot of our best weeks never make it onto a search page.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onReset ? (
          <Button type="button" variant="dark" size="lg" onClick={onReset}>
            {resetLabel ?? 'Clear filters'}
          </Button>
        ) : null}
        <Button asChild variant="outline" size="lg" className="hover:border-ink hover:bg-ink hover:text-white">
          <Link href={altHref ?? routes.contact()}>{altLabel ?? t('cta.help')}</Link>
        </Button>
      </div>
    </div>
  );
}
