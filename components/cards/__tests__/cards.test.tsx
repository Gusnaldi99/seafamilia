/**
 * Renders every card/state component against every real content record and
 * greps for leaked undefined/NaN/null/[object — the React-component
 * equivalent of what tools/check-data.js did against the old
 * `SEA.cards.*` HTML-string renderers (see lib/data/__tests__/integrity.test.ts's
 * header comment). Kept in its own file rather than folded into that one:
 * this is the first place in the repo that needs jsdom + @testing-library/react
 * rendering rather than plain function calls.
 */
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// `server-only`'s real export unconditionally throws unless the bundler sets
// Next.js's "react-server" resolve condition — which Vitest doesn't. PhotoSlot
// (via lib/photo.ts) imports it purely to prevent an accidental client bundle
// in the real app; that guard has nothing to check under jsdom.
vi.mock('server-only', () => ({}));
import { LocaleProvider } from '@/components/providers/locale-provider';
import { ArticleCard } from '../article-card';
import { BoatCard } from '../boat-card';
import { CabinCard } from '../cabin-card';
import { DepartureCard } from '../departure-card';
import { ExperienceCard } from '../experience-card';
import { StatusBadge } from '../status-badge';
import { TripCard } from '../trip-card';
import { WaterCard } from '../water-card';
import { CardSkeleton, type SkeletonKind } from '@/components/states/card-skeleton';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { articles, boats, departures, experiences, trips, waters } from '@/lib/data';
import type { DepartureStatus } from '@/lib/data/types';

afterEach(() => cleanup());

const BAD = /undefined|NaN|null|\[object/i;

// Checked against innerHTML, not textContent: textContent concatenates
// adjacent block-level siblings with no separator (e.g. "...Kaimana" next to
// "Nov 15…" becomes "...KaimanaNov…", which contains "aNov" → a false-positive
// "NaN" match). innerHTML keeps the tag boundaries between them.

function renderCard(node: React.ReactNode) {
  return render(<LocaleProvider>{node}</LocaleProvider>);
}

describe('cards render every record with no leaked undefined/NaN/null', () => {
  it.each(trips)('TripCard — %s', (trip) => {
    const { container } = renderCard(<TripCard trip={trip} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });

  it.each(departures)('DepartureCard — %s', (departure) => {
    const { container } = renderCard(<DepartureCard departure={departure} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });

  it.each(boats)('BoatCard — %s', (boat) => {
    const { container } = renderCard(<BoatCard boat={boat} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });

  it.each(waters)('WaterCard — %s', (water) => {
    const { container } = renderCard(<WaterCard water={water} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });

  it.each(articles)('ArticleCard — %s', (article) => {
    const { container } = renderCard(<ArticleCard article={article} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });

  it.each(experiences)('ExperienceCard — %s', (experience) => {
    const { container } = renderCard(<ExperienceCard experience={experience} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });

  const cabins = boats.flatMap((b) => b.cabinTypes.map((cabin) => ({ boatSlug: b.slug, cabin })));
  it.each(cabins)('CabinCard — $boatSlug/$cabin.code', ({ cabin, boatSlug }) => {
    const { container } = renderCard(<CabinCard cabin={cabin} boatSlug={boatSlug} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });
});

describe('status badge', () => {
  const statuses: DepartureStatus[] = ['open', 'limited', 'waitlist', 'closed'];
  it.each(statuses)('renders %s without leaking', (status) => {
    const { container } = renderCard(<StatusBadge status={status} extra="2 left" />);
    expect(container.innerHTML).not.toMatch(BAD);
  });

  it('falls back to open for an unknown status rather than rendering it raw', () => {
    const { container } = renderCard(<StatusBadge status={'something-new' as unknown as DepartureStatus} />);
    expect(container.innerHTML).not.toMatch(BAD);
    expect(container.textContent).not.toContain('something-new');
  });
});

describe('skeleton kit', () => {
  const kinds: SkeletonKind[] = ['trip', 'departure', 'boat', 'water', 'article', 'cabin'];
  it.each(kinds)('renders the %s skeleton without throwing', (kind) => {
    expect(() => render(<CardSkeleton kind={kind} count={2} />)).not.toThrow();
  });

  it('falls back to a generic box for an unlisted kind', () => {
    expect(() => render(<CardSkeleton count={1} />)).not.toThrow();
  });
});

describe('empty / error states', () => {
  it('EmptyState renders its defaults with no leaked bad text', () => {
    const { container } = renderCard(<EmptyState onReset={() => {}} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });

  it('ErrorState renders its defaults with no leaked bad text', () => {
    const { container } = renderCard(<ErrorState onRetry={() => {}} />);
    expect(container.innerHTML).not.toMatch(BAD);
  });
});
