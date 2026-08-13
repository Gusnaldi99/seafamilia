import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/api/data";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} — Journal — Sea Familia`,
    description: article.dek,
  };
}

// Fallback text if the article body is missing in mock data
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

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const body = getBody(article);

  return (
    <>
      <article className="bg-white pb-24 pt-32 sm:pb-32 sm:pt-40">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 font-mark text-[10px] uppercase tracking-[0.18em] text-mist-700">
              <Link href="/journal" className="transition hover:text-ink-700">Journal</Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink-700">{article.category}</span>
            </nav>

            <h1 className="font-display text-4xl font-light leading-[1.1] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-ink/70">
              {article.dek}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-sand-300 pb-10">
              <div className="flex items-center gap-4">
                <div className={`ph ph-${article.ph} h-12 w-12 rounded-full`} />
                <div>
                  <div className="font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">
                    {article.author}
                  </div>
                  <div className="mt-0.5 text-xs text-mist-700">
                    {article.role}
                  </div>
                </div>
              </div>
              <div className="ml-auto font-mark text-[10px] uppercase tracking-[0.18em] text-mist-700">
                {formatDate(article.date)} · {article.read} min read
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className={`ph ph-${article.ph} relative aspect-[16/9] w-full overflow-hidden rounded-3xl lg:aspect-[2/1]`} />
          </div>

          {/* Body */}
          <div className="mx-auto mt-16 max-w-3xl space-y-8 text-lg leading-[1.8] text-ink/80 sm:mt-20">
            {body.map((block, i) => {
              if (block.t === "h2") {
                return (
                  <h2 key={i} className="mt-16 font-display text-3xl text-ink-700">
                    {block.v}
                  </h2>
                );
              }
              if (block.t === "quote") {
                return (
                  <blockquote key={i} className="pull-quote my-12">
                    &ldquo;{block.v}&rdquo;
                  </blockquote>
                );
              }
              return (
                <p key={i} className={i === 0 ? "dropcap" : ""}>
                  {block.v}
                </p>
              );
            })}
          </div>

          {/* Share/Tags footer */}
          <div className="mx-auto mt-20 max-w-3xl border-t border-sand-300 pt-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="inline-flex rounded-full bg-sand px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.18em] text-mist-700">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="flex h-10 items-center gap-2 rounded-full border border-sand-300 px-4 font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700 transition hover:bg-sand">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Share
              </button>
            </div>
          </div>
          
        </div>
      </article>

      {/* More from Journal */}
      <section className="border-t border-sand-300 bg-sand py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl text-ink-700">More from the journal</h2>
            <Link href="/journal" className="hidden font-mark text-[11px] uppercase tracking-[0.18em] text-flame hover:text-flame-600 sm:block">
              View all
            </Link>
          </div>
          
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.filter(a => a.slug !== article.slug).slice(0, 3).map((a) => (
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
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
