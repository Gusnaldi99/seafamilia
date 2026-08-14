import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Sea Familia",
  description: "Two people in Labuan Bajo, answering on WhatsApp and email. Waitlists, charter enquiries, crewing and anything else.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16 lg:pt-32">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
            <Link href="/" className="hover:text-flame-600">Home</Link>
            <span className="px-2 text-mist-300" aria-hidden="true">/</span>
            <span className="text-ink-700">Contact</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Contact</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                Two people,<br className="hidden sm:block" /> one small office
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              Ratih and Sari answer everything that comes in, from a corner room above a dive shop in
              Labuan Bajo. No ticket numbers, no chatbot. Usually within a few hours, always within a
              working day.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          {/* ==================================================================
               FORM
               ================================================================ */}
          <div>
            <ContactForm />
          </div>

          {/* ==================================================================
               CHANNELS
               ================================================================ */}
          <aside className="space-y-4">
            <div className="rounded-3xl bg-ink p-6 text-white lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-300">Fastest</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                WhatsApp. It is the number the crew use too, so if you are already on board, message the
                same one.
              </p>
              <a href="https://wa.me/6281100000000" target="_blank" rel="noopener noreferrer"
                 className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:bg-sand">
                +62 811 0000 0000
              </a>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">By email</h2>
              <dl className="mt-4 space-y-3.5 text-sm">
                <div>
                  <dt className="text-ink/60">Anything and everything</dt>
                  <dd><a href="mailto:hello@seafamilia.com" className="text-ink-700 underline decoration-mist-300 underline-offset-4 hover:text-flame-600">hello@seafamilia.com</a></dd>
                </div>
                <div>
                  <dt className="text-ink/60">Private charter</dt>
                  <dd><a href="mailto:charter@seafamilia.com" className="text-ink-700 underline decoration-mist-300 underline-offset-4 hover:text-flame-600">charter@seafamilia.com</a></dd>
                </div>
                <div>
                  <dt className="text-ink/60">Travel agents</dt>
                  <dd><a href="mailto:agents@seafamilia.com" className="text-ink-700 underline decoration-mist-300 underline-offset-4 hover:text-flame-600">agents@seafamilia.com</a></dd>
                </div>
                <div>
                  <dt className="text-ink/60">On board, urgently</dt>
                  <dd className="text-ink-700">Satellite: +870 776 000 000</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">The office</h2>
              <address className="mt-4 text-sm not-italic leading-relaxed text-ink/75">
                PT Keluarga Laut Nusantara<br />
                Jalan Soekarno Hatta 42, first floor<br />
                Labuan Bajo 86554<br />
                Flores, Nusa Tenggara Timur<br />
                Indonesia
              </address>
              <dl className="mt-5 space-y-2 border-t border-sand-200 pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">Monday – Friday</dt>
                  <dd className="text-ink-700">08:00 – 18:00 WITA</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">Saturday</dt>
                  <dd className="text-ink-700">09:00 – 14:00 WITA</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">Sunday</dt>
                  <dd className="text-ink-700">WhatsApp only</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-ink/55">
                WITA is UTC+8. If you are in Europe, morning for you is late afternoon here — messages
                sent before noon your time usually get an answer the same day.
              </p>
            </div>

            <div className="rounded-3xl bg-sand p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Second office</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Bira, South Sulawesi — the boatyard. Bimo is there most of the off season, arguing about
                ribs.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
