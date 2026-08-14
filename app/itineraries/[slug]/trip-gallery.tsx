'use client';

/** Gallery grid + lightbox, ported from trip.html's `openLightbox`/
 * `nextImage`/`prevImage`. Photos are resolved server-side (page.tsx) and
 * passed down already-resolved, since this client component can't import
 * the server-only photoIfExists check. */
import * as React from 'react';
import { PhotoPlate } from '@/components/media/photo-plate';
import { ChevronLeft, ChevronRight, Cross } from '@/components/icons';
import { PHOTO_SIZES } from '@/lib/photo-paths';
import type { PhVariant } from '@/lib/data/types';

export interface GalleryItem {
  ph: PhVariant;
  caption: string;
  src: string | null;
}

export function TripGallery({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const next = React.useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = React.useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, next, prev]);

  const current = items[index];

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((g, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink"
          >
            <PhotoPlate
              ph={g.ph}
              src={g.src}
              alt={g.caption}
              sizes={PHOTO_SIZES.gallery}
              className="transition-transform duration-700 ease-swell group-hover:scale-[1.05]"
            />
            <span className="scrim-soft absolute inset-0 block" aria-hidden="true" />
            <span className="absolute inset-x-3 bottom-2.5 text-left font-mark text-[10px] uppercase tracking-[0.14em] text-white/85">{g.caption}</span>
          </button>
        ))}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink-950/95" role="dialog" aria-modal="true" aria-label="Image viewer">
          <div className="flex items-center justify-between px-5 py-4 text-white/80">
            <p className="font-mark text-[11px] uppercase tracking-[0.16em]">
              {index + 1} / {items.length}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close viewer"
              className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/10"
            >
              <Cross className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 lg:left-8"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <figure className="w-full max-w-4xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-ink">
                <PhotoPlate ph={current.ph} src={current.src} alt={current.caption} sizes="(min-width: 1024px) 60rem, 100vw" />
              </div>
              <figcaption className="mt-4 text-center text-sm text-white/70">{current.caption}</figcaption>
            </figure>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 lg:right-8"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
