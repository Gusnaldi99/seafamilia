'use client';

/**
 * The locale-reactive fragments of DepartureCard (availability sentence,
 * CTA, details link) — split into their own client-boundary file because
 * DepartureCard itself must stay a Server Component (it renders PhotoSlot,
 * which touches the filesystem via `server-only`). Same rationale as
 * <T>/<Money> in locale-provider.tsx: ship the default-locale text
 * server-side, react to a locale change client-side.
 */
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from '@/components/icons';
import { useLocale } from '@/components/providers/locale-provider';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { DepartureStatus } from '@/lib/data/types';

export function DepartureAvailability({
  status,
  cabinsLeft,
}: {
  status: DepartureStatus;
  cabinsLeft: number;
}) {
  const { t } = useLocale();
  const closed = status === 'closed';
  const waitlisted = status === 'waitlist';
  const urgent = status !== 'open';
  const text = closed
    ? t('note.fullybooked')
    : waitlisted
      ? t('note.waitlistopen')
      : `${cabinsLeft} ${cabinsLeft === 1 ? t('note.cabin_singular') : t('note.cabin_plural')}`;
  return <p className={cn('mt-1.5 text-sm font-medium', urgent ? 'text-flame-600' : 'text-ink/70')}>{text}</p>;
}

export function DepartureCta({
  status,
  departureId,
}: {
  status: DepartureStatus;
  departureId: string;
}) {
  const { t } = useLocale();

  if (status === 'closed') {
    return (
      <span className="inline-flex h-11 items-center rounded-full bg-sand-200 px-5 font-mark text-sm uppercase tracking-[0.12em] text-ink/70">
        {t('cta.soldout')}
      </span>
    );
  }
  if (status === 'waitlist') {
    return (
      <Button asChild variant="outline" size="lg" className="hover:border-ink hover:bg-ink hover:text-white">
        <Link href={routes.contact({ ref: departureId, topic: 'waitlist' })}>{t('cta.waitlist')}</Link>
      </Button>
    );
  }
  return (
    <Button asChild size="lg">
      <Link href={routes.departure(departureId)}>{t('cta.select')}</Link>
    </Button>
  );
}

export function DepartureDetailsLink({ tripSlug }: { tripSlug: string }) {
  const { t } = useLocale();
  return (
    <Link
      href={routes.trip(tripSlug)}
      className="mt-2 inline-flex items-center gap-1 font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4"
    >
      {t('cta.details')}
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
}
