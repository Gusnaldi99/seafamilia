import Link from "next/link";
import { articles } from "@/lib/api/data";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal — Sea Familia",
  description: "Written on the boat, mostly. Stories, guides and field notes from eastern Indonesia.",
};

export default function JournalPage() {
  const featured = articles.filter((a) => a.featured);
  const others = articles.filter((a) => !a.featured);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-sand pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="wave-rule wave-rule-flame block" />
            <h1 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
              Written on the boat, mostly
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">
              Stories, field notes and occasionally opinions from the crew, the cooks, the captains
              and the biologists who actually sail these routes.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Featured Articles ---------- */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {featured.map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="group flex flex-col gap-6 sm:flex-row lg:flex-col xl:flex-row">
                <div className={`ph ph-${a.ph} relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-3xl sm:w-64 lg:w-full xl:w-72`}>
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-5 bottom-4">
                    <span className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/70">
                      {a.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="font-display text-2xl leading-tight text-ink-700 transition-colors group-hover:text-flame-600 sm:text-3xl">
                    {a.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75 line-clamp-3">
                    {a.dek}
                  </p>
                  <p className="mt-4 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                    {a.author} · {formatDate(a.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Other Articles Grid ---------- */}
      <section className="border-t border-sand-300 bg-sand py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-ink-700">From the archive</h2>
          
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {others.map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="group block">
                <div className={`ph ph-${a.ph} relative aspect-[4/3] overflow-hidden rounded-2xl`}>
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-4 bottom-4">
                    <span className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/70">
                      {a.category}
                    </span>
                  </div>
                </div>
                <h3 className="mt-5 font-display text-xl text-ink-700 transition-colors group-hover:text-flame-600">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-2">
                  {a.dek}
                </p>
                <p className="mt-3 font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
                  {a.author} · {formatDate(a.date)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
