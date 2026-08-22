import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { JoiningForm } from './joining-form';

export const metadata: Metadata = {
  title: 'Joining form',
  description: 'Who is coming, what they eat, and what they are certified to dive — the details the crew need before you board.',
  // Reached from a confirmation screen or an emailed link, never from search.
  robots: { index: false },
};

export default function JoiningFormPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <PageBreadcrumb label="Joining form" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Before you board</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                Who is
                <br className="hidden sm:block" /> actually coming?
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              One row per guest. The kitchen plans from the dietary answers and the dive deck plans from the certifications, so a guess now is worse than a correction later — send it
              again whenever something changes.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <Suspense fallback={<div className="h-96" />}>
            <JoiningForm />
          </Suspense>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-ink p-6 text-white lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-300">Where this came from</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Your booking reference is on the confirmation screen you saw when you reserved, and at the top of the confirmation email. It looks like SF-26A7K4.
              </p>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">No rush</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Nothing here is a deadline until sixty days before you sail, when the crew list is drawn up. Certifications and dietary needs can arrive later than names.
              </p>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Insurance</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Everyone sailing needs cover for emergency evacuation, and for the depth they intend to dive. We are DAN-affiliated and will ask for policy numbers closer to departure.
              </p>
            </div>

            <div className="rounded-3xl bg-sand p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Something wrong?</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                If the reference will not take, message the office on WhatsApp — <span className="text-ink-700">+62 811 0000 0000</span> — and quote it. Ratih or Sari will sort it by
                hand.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
