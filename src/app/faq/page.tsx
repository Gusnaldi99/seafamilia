import { Suspense } from "react";
import { faq } from "@/lib/api/data";
import FaqClient from "./FaqClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequent questions — Sea Familia",
  description: "Deposits, cancellation, diving certification, children on board, wifi, dietary needs and currencies — answered plainly.",
};

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
            <a href="/" className="hover:text-flame-600">Home</a>
            <span className="px-2 text-mist-300" aria-hidden="true">/</span>
            <span className="text-ink-700">Frequent questions</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Frequent questions</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                The things people<br className="hidden sm:block" /> actually ask
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              Twelve questions the office answers every week, written out properly so you do not have to
              ask them. If yours is not here, it is a genuinely new one and we would like to hear it.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-sand-200"></div>}>
          <FaqClient faqData={faq} />
        </Suspense>
      </section>
    </>
  );
}
