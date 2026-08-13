"use client";

import { useState } from "react";
import Link from "next/link";
import { filterDepartures, trips, findWater } from "@/lib/api/data";
import { formatDateRange, formatMoney } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5;

export default function DiscoverFunnel() {
  const [step, setStep] = useState<Step>(1);
  
  // Selections
  const [who, setWho] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [pace, setPace] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  const handleNext = () => setStep((s) => Math.min(s + 1, 5) as Step);
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1) as Step);

  // In a real app, this would query based on state. We'll just show some matches.
  // We'll mock the filter logic for now
  const matchedDepartures = filterDepartures({ available: true }).slice(0, 3);

  return (
    <>
      <section className="bg-sand min-h-screen pt-24 pb-16 lg:pt-32">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          
          <div className="mx-auto max-w-3xl">
            {/* Header / Progress */}
            <div className="mb-12">
              <Link href="/" className="mb-6 inline-flex font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700 hover:text-ink-700">
                ← Back to home
              </Link>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-flame" : "bg-sand-300"}`} 
                  />
                ))}
              </div>
              <div className="mt-3 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700 text-right">
                {step < 5 ? `Step ${step} of 4` : "Your Matches"}
              </div>
            </div>

            <div className="rounded-3xl border border-sand-300 bg-white p-8 sm:p-12 shadow-card">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="font-display text-3xl text-ink-700 sm:text-4xl">Who is coming?</h2>
                  <p className="mt-3 text-ink/70">
                    The atmosphere on the boat changes completely depending on the mix.
                  </p>
                  
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      { id: "solo", label: "Just me", desc: "No single supplement on our trips." },
                      { id: "couple", label: "Two of us", desc: "Double or twin cabin." },
                      { id: "family", label: "Family", desc: "Traveling with children." },
                      { id: "group", label: "A group", desc: "Four or more adults." },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setWho(opt.id); handleNext(); }}
                        className={`text-left rounded-2xl border p-5 transition ${
                          who === opt.id 
                            ? "border-flame bg-flame/5" 
                            : "border-sand-300 hover:border-mist-400"
                        }`}
                      >
                        <div className={`font-display text-xl ${who === opt.id ? "text-flame" : "text-ink-700"}`}>
                          {opt.label}
                        </div>
                        <div className="mt-1 text-sm text-ink/60">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <button onClick={handlePrev} className="mb-6 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700 hover:text-ink-700">← Back</button>
                  <h2 className="font-display text-3xl text-ink-700 sm:text-4xl">How long do you have?</h2>
                  <p className="mt-3 text-ink/70">
                    Including time to get to eastern Indonesia.
                  </p>
                  
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                      { id: "short", label: "3–5 nights", desc: "Quick escapes, mostly Komodo." },
                      { id: "classic", label: "6–8 nights", desc: "Our classic itineraries." },
                      { id: "long", label: "9+ nights", desc: "Crossing seas, deep exploration." },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setLength(opt.id); handleNext(); }}
                        className={`text-left rounded-2xl border p-5 transition ${
                          length === opt.id 
                            ? "border-flame bg-flame/5" 
                            : "border-sand-300 hover:border-mist-400"
                        }`}
                      >
                        <div className={`font-display text-xl ${length === opt.id ? "text-flame" : "text-ink-700"}`}>
                          {opt.label}
                        </div>
                        <div className="mt-1 text-sm text-ink/60">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <button onClick={handlePrev} className="mb-6 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700 hover:text-ink-700">← Back</button>
                  <h2 className="font-display text-3xl text-ink-700 sm:text-4xl">What&apos;s the pace?</h2>
                  <p className="mt-3 text-ink/70">
                    Some trips dive three times a day. Others barely once.
                  </p>
                  
                  <div className="mt-8 space-y-4">
                    {[
                      { id: "dive", label: "Dive-focused", desc: "You are here for the reef. Up to 3 dives a day, advanced sites." },
                      { id: "balanced", label: "A bit of everything", desc: "Diving, snorkeling, hikes, and reading on deck." },
                      { id: "leisure", label: "Slow and easy", desc: "Mostly snorkeling, calm bays, beaches, and villages." },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setPace(opt.id); handleNext(); }}
                        className={`w-full flex items-center justify-between text-left rounded-2xl border p-5 transition ${
                          pace === opt.id 
                            ? "border-flame bg-flame/5" 
                            : "border-sand-300 hover:border-mist-400"
                        }`}
                      >
                        <div>
                          <div className={`font-display text-xl ${pace === opt.id ? "text-flame" : "text-ink-700"}`}>
                            {opt.label}
                          </div>
                          <div className="mt-1 text-sm text-ink/60">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="animate-fade-in">
                  <button onClick={handlePrev} className="mb-6 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700 hover:text-ink-700">← Back</button>
                  <h2 className="font-display text-3xl text-ink-700 sm:text-4xl">Any region in mind?</h2>
                  
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      { id: "komodo", label: "Komodo", desc: "Dragons, currents, dry savannah. Best Apr-Nov." },
                      { id: "raja", label: "Raja Ampat", desc: "Jungle islands, soft corals. Best Oct-Apr." },
                      { id: "banda", label: "Banda Sea", desc: "Volcanoes, history, hammerheads. Oct & Apr only." },
                      { id: "any", label: "Open to anything", desc: "Show me the best trips for my dates." },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setRegion(opt.id); handleNext(); }}
                        className={`text-left rounded-2xl border p-5 transition ${
                          region === opt.id 
                            ? "border-flame bg-flame/5" 
                            : "border-sand-300 hover:border-mist-400"
                        }`}
                      >
                        <div className={`font-display text-xl ${region === opt.id ? "text-flame" : "text-ink-700"}`}>
                          {opt.label}
                        </div>
                        <div className="mt-1 text-sm text-ink/60">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5 (Results) */}
              {step === 5 && (
                <div className="animate-fade-in">
                  <button onClick={() => setStep(1)} className="mb-6 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700 hover:text-ink-700">
                    ↺ Start over
                  </button>
                  
                  <div className="text-center">
                    <span className="wave-rule wave-rule-flame mx-auto block" />
                    <h2 className="mt-4 font-display text-3xl text-ink-700 sm:text-4xl">Matches for you</h2>
                    <p className="mt-3 text-ink/70 max-w-lg mx-auto">
                      Based on your preferences, these are the departures we think you&apos;ll enjoy the most.
                    </p>
                  </div>
                  
                  <div className="mt-10 space-y-4">
                    {matchedDepartures.map((d) => {
                      const trip = trips.find((t) => t.slug === d.trip);
                      const water = trip ? findWater(trip.water) : null;
                      if (!trip) return null;
                      
                      return (
                        <div key={d.id} className="rounded-2xl border border-sand-300 bg-sand/30 p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <div className="font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                                {water?.short} · {formatDateRange(d.start, d.nights)}
                              </div>
                              <h3 className="mt-1 font-display text-xl text-ink-700">
                                {trip.title}
                              </h3>
                              <div className="mt-2 text-sm text-ink/60 line-clamp-2">
                                {trip.summary}
                              </div>
                            </div>
                            <div className="shrink-0 sm:text-right">
                              <div className="tnum font-display text-xl text-deep-700">
                                {formatMoney(d.price)}
                              </div>
                              <Link 
                                href={`/trip/${trip.slug}`}
                                className="mt-3 inline-block rounded-full bg-flame px-6 py-2.5 font-mark text-[11px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600"
                              >
                                View trip
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-10 border-t border-sand-300 pt-8 text-center">
                    <p className="text-sm text-ink/70">
                      Not quite right? We can always draw something from scratch.
                    </p>
                    <Link href="/charter" className="mt-4 inline-block font-mark text-[11px] uppercase tracking-[0.14em] text-flame hover:text-flame-600">
                      Explore private charter →
                    </Link>
                  </div>
                  
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
