/**
 * Component inventory — internal reference, ported from components.html.
 * Rendered from the same code the live pages use, so this doubles as the
 * visual-parity check for each phase as its component kit lands. Sections
 * present in the original but not yet built in this migration (form
 * controls beyond Phase 2's primitives, funnel layout/overlays, the
 * integration contract) are left for the phases that introduce them.
 */
import type { Metadata } from 'next';
import { ArticleCard } from '@/components/cards/article-card';
import { BoatCard } from '@/components/cards/boat-card';
import { CabinCard } from '@/components/cards/cabin-card';
import { DepartureCard } from '@/components/cards/departure-card';
import { ExperienceCard } from '@/components/cards/experience-card';
import { StatusBadge } from '@/components/cards/status-badge';
import { TripCard } from '@/components/cards/trip-card';
import { WaterCard } from '@/components/cards/water-card';
import { CardSkeleton } from '@/components/states/card-skeleton';
import { Button } from '@/components/ui/button';
import { ChevronRight, Cross, WarningTriangle } from '@/components/icons';
import { articles, boats, departures, experiences, trips, waters } from '@/lib/data';
import type { DepartureStatus } from '@/lib/data/types';
import { EmptyStateDemo, ErrorStateDemo, ToastPlayground } from './state-demos';

export const metadata: Metadata = {
  title: 'Component inventory',
  description: 'Every component, variant and runtime state in the Sea Familia frontend, on one page.',
  robots: { index: false, follow: false },
};

const NAV: [string, string][] = [
  ['tokens', 'Colour & type'],
  ['motifs', 'Brand motifs'],
  ['buttons', 'Buttons & links'],
  ['badges', 'Badges'],
  ['cards', 'Cards'],
  ['feedback', 'Feedback & states'],
];

const TOKENS = [
  { name: 'deep', hex: '#780000', use: 'Quiet headings, prices, footer wash', on: 'text-white' },
  { name: 'flame', hex: '#C1121F', use: 'Primary action, accent, active state', on: 'text-white' },
  { name: 'ink', hex: '#003049', use: 'Body text, dark sections, header', on: 'text-white' },
  { name: 'mist', hex: '#669BBC', use: 'Secondary, water, quiet UI, meta', on: 'text-ink-900' },
  { name: 'sand', hex: '#F7F5F2', use: 'Alternating sections, input fills', on: 'text-ink-900' },
  { name: 'white', hex: '#FFFFFF', use: 'Page ground, cards', on: 'text-ink-900' },
];

const PH_VARIANTS = [
  'reef', 'deep', 'lagoon', 'volcano', 'sunset', 'village', 'jungle', 'boat', 'cabin', 'market', 'night', 'portrait',
] as const;

const BADGE_STATUSES: DepartureStatus[] = ['open', 'limited', 'waitlist', 'closed'];

export default function DesignSystemPage() {
  const soldCabin = { ...boats[1].cabinTypes[3], left: 0 };

  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-12 lg:pt-12">
          <p className="font-mark text-eyebrow uppercase text-flame">Internal · Design system</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl">
            Component inventory
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
            Every component and every runtime state in one place, rendered from the same code the live pages
            use.
          </p>
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Sections">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-sand-300 bg-white px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
        {/* ================= TOKENS ================= */}
        <section id="tokens" className="border-b border-sand-300 py-14 lg:py-20">
          <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Colour &amp; type</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
            Five brand colours plus one warm neutral sampled from the light lockup. Every numbered step is a
            tint or shade of those six — no new hues.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOKENS.map((c) => (
              <div key={c.name} className="overflow-hidden rounded-2xl border border-sand-300">
                <div className="flex h-28 items-end p-4" style={{ backgroundColor: c.hex }}>
                  <span className={`font-mark text-[11px] uppercase tracking-[0.16em] ${c.on}`}>{c.hex}</span>
                </div>
                <div className="p-4">
                  <p className="font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">{c.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink/65">{c.use}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Fraunces · font-display</p>
              <p className="mt-3 font-display text-4xl font-light leading-tight text-ink-700">
                Come sailing with the familia
              </p>
              <p className="mt-2 text-xs text-ink/55">Headlines, pull-quotes, numbers in data cells.</p>
            </div>
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Jost · font-mark</p>
              <p className="mt-3 font-mark text-2xl uppercase tracking-[0.22em] text-ink-700">Sea Familia</p>
              <p className="mt-2 text-xs text-ink/55">Wordmark, nav, eyebrows, buttons, data labels.</p>
            </div>
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Inter · font-sans</p>
              <p className="mt-3 text-base leading-relaxed text-ink/80">
                Body copy, forms and tables. Set with generous leading for phones in bright sun.
              </p>
            </div>
          </div>
        </section>

        {/* ================= MOTIFS ================= */}
        <section id="motifs" className="border-b border-sand-300 py-14 lg:py-20">
          <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Brand motifs</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
            Three devices lifted directly from the logo, so the site reads as the same object as the mark.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div>
              <div className="arch-soft relative aspect-[3/4] overflow-hidden bg-ink">
                <div className="ph ph-lagoon absolute inset-0" />
              </div>
              <p className="mt-3 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">.arch-soft</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                The dome that frames the phinisi. Destination cards, portraits, author avatars.
              </p>
            </div>
            <div>
              <div className="flex h-full min-h-40 flex-col justify-center gap-6 rounded-2xl border border-sand-300 p-6">
                <span className="wave-rule block" />
                <span className="wave-rule wave-rule-flame block" />
                <span className="block bg-ink p-4">
                  <span className="wave-rule wave-rule-light block" />
                </span>
              </div>
              <p className="mt-3 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">.wave-rule</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                The three dashed lines under the wordmark, as a section divider.
              </p>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-2">
                {PH_VARIANTS.map((p) => (
                  <div key={p} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <div className={`ph ph-${p} absolute inset-0`} />
                    <span className="absolute bottom-1 left-1.5 font-mark text-[8px] uppercase tracking-[0.1em] text-white/80">
                      {p}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">.ph-*</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                Image placeholders. Every real image slot keeps this aspect box, so PhotoSlot shifts nothing
                when a real photo lands.
              </p>
            </div>
          </div>
        </section>

        {/* ================= BUTTONS ================= */}
        <section id="buttons" className="border-b border-sand-300 py-14 lg:py-20">
          <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Buttons &amp; links</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">One primary action per view.</p>
          <div className="mt-8 space-y-8">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">On light</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button size="xl">
                  Primary large
                  <ChevronRight data-icon="inline-end" className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button>Primary</Button>
                <Button variant="dark">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button disabled>Disabled</Button>
                <a href="#buttons" className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                  Inline text link
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-ink p-6">
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-300">On dark</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="ghost" className="bg-white text-ink-700 hover:bg-sand">
                  Inverse
                </Button>
                <Button variant="outline-light">Outline</Button>
              </div>
            </div>
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Chips &amp; filter pills</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-ink bg-ink px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] text-white"
                >
                  Selected
                </button>
                <button
                  type="button"
                  className="rounded-full border border-sand-300 px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-mist"
                >
                  Unselected
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-1.5 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700"
                >
                  Removable
                  <Cross className="h-3 w-3 opacity-50" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BADGES ================= */}
        <section id="badges" className="border-b border-sand-300 py-14 lg:py-20">
          <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Availability badges</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
            Rendered by <code className="text-deep-700">StatusBadge</code>. An unknown value falls back to
            <code className="text-deep-700"> open</code> rather than the raw string.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {BADGE_STATUSES.map((s) => (
              <div key={s} className="text-center">
                <StatusBadge status={s} extra={s === 'limited' ? '2 left' : undefined} />
                <p className="mt-2 font-mark text-[9px] uppercase tracking-[0.1em] text-mist-700">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CARDS ================= */}
        <section id="cards" className="border-b border-sand-300 py-14 lg:py-20">
          <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Cards</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
            Seven renderers under <code className="text-deep-700">components/cards</code>, each taking one
            record.
          </p>

          <div className="mt-10 space-y-12">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">TripCard · discovery</p>
              <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {trips.slice(0, 3).map((t) => (
                  <TripCard key={t.slug} trip={t} />
                ))}
              </div>
            </div>

            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
                DepartureCard · commerce · all four statuses
              </p>
              <div className="mt-4 space-y-3">
                {(['open', 'limited', 'waitlist', 'closed'] as DepartureStatus[]).map((s) => {
                  const d = departures.find((x) => x.status === s) ?? departures[0];
                  return <DepartureCard key={s} departure={d} />;
                })}
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
                  CabinCard · available &amp; sold out
                </p>
                <div className="mt-4 space-y-3">
                  <CabinCard cabin={boats[0].cabinTypes[0]} boatSlug={boats[0].slug} />
                  <CabinCard cabin={soldCabin} boatSlug={boats[1].slug} />
                </div>
              </div>
              <div>
                <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">WaterCard · arch variant</p>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  {waters.slice(0, 2).map((w) => (
                    <WaterCard key={w.slug} water={w} />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">BoatCard</p>
                <div className="mt-4">
                  <BoatCard boat={boats[0]} />
                </div>
              </div>
              <div>
                <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
                  ArticleCard &amp; ExperienceCard
                </p>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <ArticleCard article={articles[0]} />
                  <ExperienceCard experience={experiences[0]} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEEDBACK & STATES ================= */}
        <section id="feedback" className="py-14 lg:py-20">
          <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Feedback &amp; runtime states</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
            The states that normally get missed. Every listing can be forced into any of them with{' '}
            <code className="text-deep-700">?state=loading|empty|error</code> (see lib/qa.ts).
          </p>

          <div className="mt-10 space-y-12">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
                Skeletons · same box as the loaded card, so nothing shifts
              </p>
              <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                <CardSkeleton kind="trip" count={3} />
              </div>
              <div className="mt-4 space-y-3">
                <CardSkeleton kind="departure" count={2} />
              </div>
            </div>

            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
                Empty · always offers a way out
              </p>
              <div className="mt-4">
                <EmptyStateDemo />
              </div>
            </div>

            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
                Error · never shows the raw message, always offers retry
              </p>
              <div className="mt-4">
                <ErrorStateDemo />
              </div>
            </div>

            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Inline notices</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-flame/20 bg-flame/5 p-4">
                  <WarningTriangle className="mt-0.5 h-5 w-5 shrink-0 text-flame" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-ink/80">
                    <strong className="text-ink-700">Nearly full.</strong> One cabin left on this date.
                    Reserving holds it for 72 hours before any payment is taken.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Toasts · three variants, live</p>
              <div className="mt-4">
                <ToastPlayground />
              </div>
            </div>

            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
                Progress · determinate steps and indeterminate submit
              </p>
              <div className="mt-4 max-w-md space-y-5">
                <ol className="flex gap-1.5" aria-label="Example progress">
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((i) => (
                    <li key={i} className="flex-1">
                      <span className={`block h-1 rounded-full ${i < 4 ? 'bg-flame' : i === 4 ? 'bg-ink' : 'bg-sand-300'}`} />
                    </li>
                  ))}
                </ol>
                <div className="bar-indeterminate h-0.5 w-full bg-sand-300" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
