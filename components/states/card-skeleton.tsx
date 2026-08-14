/** Loading skeletons, in the same box as the loaded card so nothing shifts
 * on swap (HANDOFF §7's promise) — ported from data.js's
 * `states.skeleton(kind, n)`. Pure Server Component: no PhotoSlot, no
 * locale text, just `.skeleton` boxes shaped like each card. */
import { Fragment } from 'react';

export type SkeletonKind = 'trip' | 'departure' | 'boat' | 'water' | 'article' | 'cabin';

const RENDER: Record<SkeletonKind, () => React.ReactNode> = {
  trip: () => (
    <div>
      <div className="skeleton aspect-[4/3] rounded-2xl" />
      <div className="skeleton mt-4 h-5 w-3/4" />
      <div className="skeleton mt-2 h-3.5 w-full" />
      <div className="skeleton mt-1.5 h-3.5 w-2/3" />
      <div className="skeleton mt-4 h-4 w-1/3" />
    </div>
  ),
  departure: () => (
    <div className="rounded-2xl border border-sand-300 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="skeleton h-28 w-full rounded-xl sm:h-24 sm:w-32" />
        <div className="flex-1">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton mt-3 h-5 w-2/3" />
          <div className="skeleton mt-2.5 h-3.5 w-3/4" />
        </div>
        <div className="skeleton h-11 w-full rounded-full sm:w-40" />
      </div>
    </div>
  ),
  boat: () => (
    <div>
      <div className="skeleton aspect-[3/2] rounded-2xl" />
      <div className="skeleton mt-4 h-3.5 w-full" />
      <div className="skeleton mt-4 h-12 w-full" />
    </div>
  ),
  water: () => (
    <div>
      <div className="skeleton arch-soft aspect-[3/4]" />
      <div className="skeleton mx-auto mt-3 h-3.5 w-2/3" />
    </div>
  ),
  article: () => (
    <div>
      <div className="skeleton aspect-[16/10] rounded-2xl" />
      <div className="skeleton mt-4 h-5 w-4/5" />
      <div className="skeleton mt-2 h-3.5 w-full" />
      <div className="skeleton mt-3 h-3 w-1/2" />
    </div>
  ),
  cabin: () => (
    <div className="flex gap-4 rounded-2xl border border-sand-300 p-4">
      <div className="skeleton h-24 w-24 rounded-xl sm:h-28 sm:w-32" />
      <div className="flex-1">
        <div className="skeleton h-5 w-1/2" />
        <div className="skeleton mt-2 h-3.5 w-2/3" />
        <div className="skeleton mt-3 h-3.5 w-1/3" />
      </div>
    </div>
  ),
};

export function CardSkeleton({ kind, count = 3 }: { kind?: SkeletonKind; count?: number }) {
  const render = kind ? RENDER[kind] : () => <div className="skeleton h-40 rounded-2xl" />;
  return (
    <div className="contents" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Fragment key={i}>{render()}</Fragment>
      ))}
    </div>
  );
}
