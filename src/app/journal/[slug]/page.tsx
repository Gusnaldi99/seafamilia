import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, team, waters, filterTrips, experiences } from "@/lib/api/data";
import { formatDate } from "@/lib/utils";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { TripCard, ArticleCard } from "@/components/ui/Cards";
import type { Metadata } from "next";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = articles.find((a) => a.slug === resolvedParams.slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} — Journal — Sea Familia`,
    description: article.dek,
  };
}

function getBody(article: typeof articles[0]) {
  if (article.body && article.body.length > 0) return article.body;
  return [
    { t: "p" as const, v: article.dek },
    { t: "h2" as const, v: "From the boat" },
    { t: "p" as const, v: "This piece is part of the Sea Familia journal, written by the people who are actually on the water — crew, cooks, captains and the biologists who join us as guest lecturers." },
    { t: "quote" as const, v: "Nobody on this boat is a content producer. That is rather the point." },
    { t: "p" as const, v: "If you would like the full piece as soon as it is edited, the familia letter goes out monthly and contains no marketing beyond the occasional note that a departure has opened up." },
  ];
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = articles.find((a) => a.slug === resolvedParams.slug);
  if (!article) notFound();

  const body = getBody(article);
  const member = team.find((p) => p.name === article.author);
  const authorNote = member ? member.note : "Writes for the Sea Familia journal from on board.";

  const sameCat = articles.filter(x => x.slug !== article.slug && x.category === article.category);
  const sameTag = articles.filter(x =>
    x.slug !== article.slug && sameCat.indexOf(x) === -1 &&
    (x.tags || []).some(tg => (article.tags || []).indexOf(tg) !== -1));
  const related = sameCat.concat(sameTag).slice(0, 3);

  const tags = article.tags || [];
  const byWater = tags.map(tg => waters.find(w => w.slug === tg)).filter(Boolean);
  const byExp = tags.map(tg => experiences.find(e => e.slug === tg)).filter(Boolean);
  
  let relatedTripsRaw: typeof import("@/lib/api/data").trips = [];
  byWater.forEach(w => { if (w) relatedTripsRaw = relatedTripsRaw.concat(filterTrips({ water: w.slug })); });
  byExp.forEach(e => { if (e) relatedTripsRaw = relatedTripsRaw.concat(filterTrips({ experience: e.slug })); });

  const seen: Record<string, boolean> = {};
  const relatedTrips = relatedTripsRaw.filter(t => {
    if (seen[t.slug]) return false;
    seen[t.slug] = true;
    return true;
  }).slice(0, 3);

  return (
    <>
      <article>
        <header className="border-b border-sand-300 bg-sand">
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-8 sm:px-6 lg:pb-14 lg:pt-12">
            <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
              <Link href="/" className="hover:text-flame-600">Home</Link>
              <span className="px-2 text-mist-300" aria-hidden="true">/</span>
              <Link href="/journal" className="hover:text-flame-600">Journal</Link>
              <span className="px-2 text-mist-300" aria-hidden="true">/</span>
              <Link href={`/journal?category=${article.category}`} className="text-ink-700 hover:text-flame-600">{article.category}</Link>
            </nav>

            <h1 className="mt-8 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 font-display text-lg font-light leading-relaxed text-ink/80 sm:text-xl">{article.dek}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-sand-300 pt-6">
              <div className="relative h-12 w-11 shrink-0 overflow-hidden bg-ink arch">
                <div className="ph ph-portrait absolute inset-0">
                  <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/team/${member?.slug || 'default'}.jpg`} alt={article.author} loading="lazy" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-ink-700">{article.author}</p>
                <p className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{article.role}</p>
              </div>
              <span className="hidden h-8 w-px bg-sand-300 sm:block"></span>
              <p className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
                <span>{formatDate(article.date, true)}</span>
                <span aria-hidden="true"> · </span>
                <span>{article.read} min read</span>
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <figure className="-mt-0 pt-8 lg:pt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-ink">
              <div className={`ph absolute inset-0 ph-${article.ph}`}>
                <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/articles/${article.slug}.jpg`} alt={article.title} loading="lazy" />
              </div>
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-ink/55">
              <span>{article.title}</span> — photographed on board by the crew.
              Image slot: 16:9, served responsive.
            </figcaption>
          </figure>
        </div>

        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
          <div className="prose prose-familia max-w-none prose-headings:font-display prose-headings:font-light prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-[1.0625rem]">
            {body.map((block, i) => {
              if (block.t === 'h2') {
                return <h2 key={i}>{block.v}</h2>;
              }
              if (block.t === 'quote') {
                return (
                  <blockquote key={i} className="not-prose my-9">
                    <p className="pull-quote">{block.v}</p>
                  </blockquote>
                );
              }
              return (
                <p key={i} className={i === 0 ? 'dropcap' : ''}>{block.v}</p>
              );
            })}
          </div>

          {(tags.length > 0) && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-sand-300 pt-6">
              <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Filed under</span>
              {tags.map((tag) => (
                <Link key={tag} href={`/journal?q=${tag}`} className="rounded-full border border-sand-300 px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>

      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="relative h-40 w-32 shrink-0 overflow-hidden bg-ink arch-soft">
              <div className="ph ph-portrait absolute inset-0">
                <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/team/${member?.slug || 'default'}.jpg`} alt={article.author} loading="lazy" />
              </div>
            </div>
            <div>
              <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-flame">Written by</p>
              <h2 className="mt-2 font-display text-2xl text-ink-700">{article.author}</h2>
              <p className="mt-0.5 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">{article.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{authorNote}</p>
              <Link href="/our-story#familia" className="mt-4 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                Meet the rest of the familia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">Related stories</h2>
            <Link href="/journal" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
              The whole journal
              <span className="icon icon-chevron-right h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true"></span>
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {related.map(r => (
              <ArticleCard key={r.slug} article={r} />
            ))}
          </div>
        </section>
      )}

      {relatedTrips.length > 0 && (
        <section className="border-t border-sand-300 bg-ink text-white">
          <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-xl">
              <span className="wave-rule wave-rule-light block"></span>
              <p className="mt-5 font-mark text-eyebrow uppercase text-mist-300">Where this happens</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                You can go and see it
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/75">
                Everything in this piece happened on a route we still sail. Here are the ones it
                belongs to.
              </p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {relatedTrips.map(t => (
                <div key={t.slug} className="rounded-2xl bg-white p-1">
                  <TripCard trip={t} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
