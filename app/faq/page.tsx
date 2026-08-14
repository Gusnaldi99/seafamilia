import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { FaqBrowser } from './faq-browser';

export const metadata: Metadata = {
  title: 'Frequent Questions',
  description: 'Twelve questions the office answers every week, written out properly so you do not have to ask them.',
};

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <PageBreadcrumb label="Frequent questions" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Frequent questions</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                The things people
                <br className="hidden sm:block" /> actually ask
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              Twelve questions the office answers every week, written out properly so you do not
              have to ask them. If yours is not here, it is a genuinely new one and we would like
              to hear it.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16" />}>
        <FaqBrowser />
      </Suspense>
    </>
  );
}
