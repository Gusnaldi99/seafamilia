"use client";

import { useState, useEffect, useCallback } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";

type GalleryItem = {
  photo: string;
  caption: string;
  ph: string;
};

export function TripGallery({ tripSlug, tripTitle }: { tripSlug: string, tripTitle: string }) {
  // Mock gallery like in the original static site
  const gallery: GalleryItem[] = [
    { photo: `/media/trips/${tripSlug}-1.jpg`, caption: `Morning in ${tripTitle}`, ph: "reef" },
    { photo: `/media/trips/${tripSlug}-2.jpg`, caption: "The crossing", ph: "deep" },
    { photo: `/media/trips/${tripSlug}-3.jpg`, caption: "Anchor down", ph: "jungle" },
    { photo: `/media/trips/${tripSlug}-4.jpg`, caption: "Last light", ph: "sunset" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => setIsOpen(false), []);
  const nextImage = useCallback(() => setCurrentIndex((prev) => (prev + 1) % gallery.length), [gallery.length]);
  const prevImage = useCallback(() => setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1)), [gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  return (
    <>
      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">On this route</h2>
            <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
              {gallery.length} images
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {gallery.map((g, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(i)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-mist"
              >
                <span
                  className={`ph ph-${g.ph} absolute inset-0 block transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]`}
                >
                  <ImageSlot
                    className="h-full w-full object-cover"
                    src={g.photo}
                    alt={g.caption}
                  />
                </span>
                <span className="scrim-soft absolute inset-0 block" />
                <span className="absolute inset-x-3 bottom-2.5 text-left font-mark text-[10px] uppercase tracking-[0.14em] text-white/85">
                  {g.caption}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-ink-950/95 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <div className="flex items-center justify-between px-5 py-4 text-white/80">
            <p className="font-mark text-[11px] uppercase tracking-[0.16em]">
              {currentIndex + 1} / {gallery.length}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close viewer"
              className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/10"
            >
              <span className="icon icon-cross h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 lg:left-8 z-10"
            >
              <span className="icon icon-chevron-left h-5 w-5" aria-hidden="true" />
            </button>
            <figure className="w-full max-w-4xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-ink">
                <div className={`ph ph-${gallery[currentIndex].ph} absolute inset-0`}>
                  <ImageSlot
                    className="h-full w-full object-cover"
                    src={gallery[currentIndex].photo}
                    alt={gallery[currentIndex].caption}
                  />
                </div>
              </div>
              <figcaption className="mt-4 text-center text-sm text-white/70">
                {gallery[currentIndex].caption}
              </figcaption>
            </figure>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 lg:right-8 z-10"
            >
              <span className="icon icon-chevron-right h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
