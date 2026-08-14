"use client";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  experiences, 
  waters, 
  lengths, 
  parties, 
  trips, 
  departures,
  filterTrips,
  filterDepartures
} from "@/lib/api/data";
import { TripCard, DepartureCard } from "@/components/ui/Cards";

const stepLabels = [
  { key: "experience", label: "Experience" },
  { key: "water", label: "Waters" },
  { key: "length", label: "Length" },
  { key: "party", label: "Party" },
  { key: "matches", label: "Matches" },
];

export default function DiscoverClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialStep = Math.min(5, Math.max(1, Number(searchParams.get("step")) || 1));
  const [step, setStep] = useState(initialStep);
  const [furthest, setFurthest] = useState(initialStep);

  const [answers, setAnswers] = useState({
    experience: searchParams.get("experience") || null,
    water: searchParams.get("water") || null,
    length: searchParams.get("length") || null,
    party: searchParams.get("party") || null,
    guests: Math.min(20, Math.max(1, Number(searchParams.get("guests")) || 2)),
  });

  const [state, setState] = useState<"loading" | "ready">("ready");
  const [matches, setMatches] = useState<typeof trips>([]);
  const [matchDepartures, setMatchDepartures] = useState<typeof departures>([]);

  // Derived state
  const filters = {
    experience: answers.experience || undefined,
    water: answers.water || undefined,
    length: answers.length || undefined,
    party: answers.party || undefined,
  };

  const currentStepKey = stepLabels[step - 1]?.key;
  const canContinue = answers[currentStepKey as keyof typeof answers] !== null;

  const getFurthestEarned = () => {
    const order = ["experience", "water", "length", "party"];
    for (let i = 0; i < order.length; i++) {
      if (answers[order[i] as keyof typeof answers] === null) return i + 1;
    }
    return 5;
  };

  useEffect(() => {
    const queryStep = Number(searchParams.get("step")) || 1;
    const earned = getFurthestEarned();
    const targetStep = Math.min(Math.max(1, queryStep), earned, 5);
    
    if (step !== targetStep) setStep(targetStep);
    if (targetStep > furthest) setFurthest(targetStep);

    if (targetStep === 5) {
      computeMatches();
    }
  }, [searchParams, answers]);

  const computeMatches = () => {
    setState("loading");
    // Simulate slight delay for effect
    setTimeout(() => {
      const filtered = filterTrips(filters);
      setMatches(filtered);
      
      const tripSlugs = filtered.map(t => t.slug);
      const filteredDeps = filterDepartures({ available: true })
        .filter(d => tripSlugs.includes(d.trip))
        .slice(0, 3);
      setMatchDepartures(filteredDeps);
      
      setState("ready");
    }, 400);
  };

  const updateUrl = (newStep: number, currentAnswers: typeof answers) => {
    const params = new URLSearchParams();
    params.set("step", newStep.toString());
    if (currentAnswers.experience) params.set("experience", currentAnswers.experience);
    if (currentAnswers.water) params.set("water", currentAnswers.water);
    if (currentAnswers.length) params.set("length", currentAnswers.length);
    if (currentAnswers.party) params.set("party", currentAnswers.party);
    params.set("guests", currentAnswers.guests.toString());
    
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const handlePick = (key: keyof typeof answers, value: string) => {
    const newAnswers = { ...answers, [key]: value || null };
    setAnswers(newAnswers);
    if (step < 5) {
      updateUrl(step + 1, newAnswers);
    } else {
      updateUrl(5, newAnswers);
    }
  };

  const handleClear = (key: string) => {
    const newAnswers = { ...answers, [key]: null };
    setAnswers(newAnswers);
    const order = ["experience", "water", "length", "party"];
    const idx = order.indexOf(key);
    updateUrl(idx + 1, newAnswers);
  };

  const handleNext = () => {
    if (!canContinue) return;
    updateUrl(Math.min(5, step + 1), answers);
  };

  const handleBack = () => {
    updateUrl(Math.max(1, step - 1), answers);
  };

  const handleReset = () => {
    const newAnswers = { experience: null, water: null, length: null, party: null, guests: 2 };
    setAnswers(newAnswers);
    updateUrl(1, newAnswers);
  };

  const handleGoto = (n: number) => {
    if (n > furthest && n > getFurthestEarned()) return;
    updateUrl(n, answers);
  };

  const getFooterHint = () => {
    if (canContinue && step < 5) {
      const n = filterTrips(filters).length;
      return `${n} ${n === 1 ? 'itinerary still fits' : 'itineraries still fit'}`;
    }
    return [
      "Choose what matters most",
      "Choose a region, or say surprise me",
      "Choose how long",
      "Choose who is coming"
    ][step - 1] || "";
  };

  const getChips = () => {
    const out = [];
    if (answers.experience) {
      const e = experiences.find(x => x.slug === answers.experience);
      out.push({ key: "experience", label: e?.name || "Any experience" });
    } else if (answers.experience === "") out.push({ key: "experience", label: "Any experience" });
    
    if (answers.water) {
      const w = waters.find(x => x.slug === answers.water);
      out.push({ key: "water", label: w?.short || "Anywhere" });
    } else if (answers.water === "") out.push({ key: "water", label: "Anywhere" });

    if (answers.length) {
      const l = lengths.find(x => x.slug === answers.length);
      out.push({ key: "length", label: l?.label || "Any length" });
    } else if (answers.length === "") out.push({ key: "length", label: "Any length" });

    if (answers.party) {
      const p = parties.find(x => x.slug === answers.party);
      out.push({ key: "party", label: p?.label || "Anyone" });
    } else if (answers.party === "") out.push({ key: "party", label: "Anyone" });

    return out;
  };

  const getRelaxOptions = () => {
    const out = [];
    const keys = ["experience", "water", "length", "party"] as const;
    for (const k of keys) {
      if (!answers[k]) continue;
      const testFilters = { ...filters, [k]: undefined };
      const count = filterTrips(testFilters).length;
      if (count > 0) {
        const labels = { experience: 'Any experience', water: 'Anywhere', length: 'Any length', party: 'Anyone' };
        out.push({ key: k, count, label: labels[k] });
      }
    }
    return out.sort((a, b) => b.count - a.count);
  };

  const chips = getChips();
  const relaxOptions = getRelaxOptions();

  const getMatchHeadline = () => {
    const n = matches.length;
    if (n === 0) return 'Nothing fits — which is worth knowing';
    if (n === 1) return 'One route does exactly this';
    return `${n} routes fit what you asked for`;
  };

  const getMatchSubline = () => {
    const bits = chips.map(c => c.label.toLowerCase());
    return bits.length
      ? `Based on ${bits.join(', ')}. Open any of them for the day-by-day.`
      : 'You kept every option open, so this is the whole programme.';
  };

  return (
    <main id="main" className="pb-28 lg:pb-32 bg-sand min-h-screen">
      {/* FUNNEL HEADER */}
      <div className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Guided discovery</p>
              <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                Step {step} of 5 · {stepLabels[step - 1]?.label}
              </p>
            </div>
            <Link href="/" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-ink/60 hover:text-flame-600">
              <span className="icon icon-cross h-4 w-4" aria-hidden="true"></span>
              Leave the funnel
            </Link>
          </div>

          {/* Progress bar */}
          <ol className="mt-5 flex gap-1.5" aria-label="Progress">
            {stepLabels.map((s, i) => (
              <li key={s.key} className="flex-1">
                <button 
                  type="button" 
                  onClick={() => handleGoto(i + 1)} 
                  disabled={i + 1 > furthest}
                  aria-current={step === i + 1 ? 'step' : undefined}
                  className="group block w-full text-left disabled:cursor-not-allowed"
                >
                  <span className={`block h-1 rounded-full transition ${i + 1 < step ? 'bg-flame' : i + 1 === step ? 'bg-ink' : 'bg-sand-300'}`}></span>
                  <span className={`mt-2 hidden font-mark text-[10px] uppercase tracking-[0.14em] sm:block ${i + 1 <= step ? 'text-ink-700' : 'text-mist-400'}`}>
                    {s.label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* CHIPS */}
      {chips.length > 0 && (
        <div className="border-b border-sand-300 bg-white/60">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-5 py-3 sm:px-6 lg:px-8">
            <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">So far</span>
            {chips.map(c => (
              <button 
                key={c.key} 
                type="button" 
                onClick={() => handleClear(c.key)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-1.5 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-flame hover:text-flame-600"
              >
                <span>{c.label}</span>
                <span className="icon icon-cross h-3 w-3 opacity-50 group-hover:opacity-100" aria-hidden="true"></span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
        {/* STEP 1: Experience */}
        {step === 1 && (
          <section className="animate-in fade-in duration-200">
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              What do you most want out of the week?
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
              Pick the one that matters most. You will probably get two of them anyway — that is how
              these routes tend to work.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {experiences.map(e => (
                <button 
                  key={e.slug} 
                  type="button" 
                  onClick={() => handlePick("experience", e.slug)}
                  aria-pressed={answers.experience === e.slug}
                  className={`group relative flex flex-col items-start rounded-2xl border-2 bg-white p-5 text-left transition ${answers.experience === e.slug ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'}`}
                >
                  <span className={`absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border transition ${answers.experience === e.slug ? 'border-flame bg-flame text-white' : 'border-sand-300 text-transparent'}`}>
                    <span className="icon icon-check h-3.5 w-3.5" aria-hidden="true"></span>
                  </span>
                  <span className={`icon h-8 w-8 text-mist-700 icon-exp-${e.slug}`} aria-hidden="true"></span>
                  <span className="mt-4 pr-8 font-display text-xl leading-tight text-ink-700">{e.name}</span>
                  <span className="mt-1.5 text-sm leading-relaxed text-ink/65">{e.tagline}</span>
                </button>
              ))}

              <button 
                type="button" 
                onClick={() => handlePick("experience", "")}
                aria-pressed={answers.experience === ""}
                className="flex flex-col items-start justify-center rounded-2xl border-2 border-dashed border-sand-300 p-5 text-left transition hover:border-mist"
              >
                <span className="font-display text-xl leading-tight text-ink-700">Not sure yet</span>
                <span className="mt-1.5 text-sm leading-relaxed text-ink/65">Show me everything and I will react to it.</span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: Waters */}
        {step === 2 && (
          <section className="animate-in fade-in duration-200">
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Which water pulls at you?
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
              Each region has its own season, so this partly decides when you sail.
              If you have no preference, say so — it widens what we can offer.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {waters.map(w => {
                const matchCount = filterTrips({ ...filters, water: w.slug }).length;
                return (
                  <button 
                    key={w.slug} 
                    type="button" 
                    onClick={() => handlePick("water", w.slug)}
                    aria-pressed={answers.water === w.slug}
                    className={`group relative overflow-hidden rounded-2xl border-2 text-left transition flex flex-col ${answers.water === w.slug ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'}`}
                  >
                    <span className="relative block h-28 w-full">
                      <span className={`ph ph-${w.ph} absolute inset-0 block`}>
                        <ImageSlot className="img-slot object-cover w-full h-full" src={`/media/photos/waters/${w.slug}.jpg`} alt={w.name} loading="lazy" />
                      </span>
                      <span className="scrim-soft absolute inset-0 block"></span>
                      <span className="absolute bottom-2.5 left-4 font-mark text-[10px] uppercase tracking-[0.16em] text-white/80">
                        {w.season}
                      </span>
                      {answers.water === w.slug && (
                        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-flame text-white">
                          <span className="icon icon-check h-3.5 w-3.5" aria-hidden="true"></span>
                        </span>
                      )}
                    </span>
                    <span className="block bg-white p-4 flex-grow">
                      <span className="block font-display text-lg leading-tight text-ink-700">{w.name}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink/60">
                        {matchCount} matching {matchCount === 1 ? 'itinerary' : 'itineraries'} · from {w.gateway}
                      </span>
                    </span>
                  </button>
                );
              })}

              <button 
                type="button" 
                onClick={() => handlePick("water", "")}
                className="flex flex-col items-start justify-center rounded-2xl border-2 border-dashed border-sand-300 p-5 text-left transition hover:border-mist"
              >
                <span className="font-display text-xl leading-tight text-ink-700">Surprise me</span>
                <span className="mt-1.5 text-sm leading-relaxed text-ink/65">
                  Anywhere we sail. The crew have opinions and are happy to share them.
                </span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: Length */}
        {step === 3 && (
          <section className="animate-in fade-in duration-200">
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              How long can you be away?
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
              Count the flights. Getting to Sorong or Ambon eats a day at each end, which is why our
              remote crossings are long ones.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {lengths.map(l => {
                const matchCount = filterTrips({ ...filters, length: l.slug }).length;
                return (
                  <button 
                    key={l.slug} 
                    type="button" 
                    onClick={() => handlePick("length", l.slug)}
                    aria-pressed={answers.length === l.slug}
                    className={`group relative flex flex-col items-start rounded-2xl border-2 bg-white p-6 text-left transition ${answers.length === l.slug ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'}`}
                  >
                    <span className="font-display text-3xl font-light text-ink-700">{l.label}</span>
                    <span className="mt-2 font-mark text-[11px] uppercase tracking-[0.14em] text-flame">{l.note}</span>
                    <span className="mt-4 text-sm text-ink/60">
                      {matchCount} {matchCount === 1 ? 'route' : 'routes'} at this length
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              type="button" 
              onClick={() => handlePick("length", "")}
              className="mt-3 w-full rounded-2xl border-2 border-dashed border-sand-300 p-5 text-left transition hover:border-mist"
            >
              <span className="font-display text-xl text-ink-700">Flexible</span>
              <span className="mt-1 block text-sm text-ink/65">Show me every length and I will work around it.</span>
            </button>
          </section>
        )}

        {/* STEP 4: Party */}
        {step === 4 && (
          <section className="animate-in fade-in duration-200">
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Who is coming with you?
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
              This changes the boat more than the route. Some hulls are built for children;
              one is built for eight people who want quiet.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {parties.map(p => {
                const matchCount = filterTrips({ ...filters, party: p.slug }).length;
                return (
                  <button 
                    key={p.slug} 
                    type="button" 
                    onClick={() => handlePick("party", p.slug)}
                    aria-pressed={answers.party === p.slug}
                    className={`group relative flex items-center justify-between gap-4 rounded-2xl border-2 bg-white p-5 text-left transition ${answers.party === p.slug ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'}`}
                  >
                    <span>
                      <span className="block font-display text-xl leading-tight text-ink-700">{p.label}</span>
                      <span className="mt-1 block text-sm text-ink/65">{p.note}</span>
                      <span className="mt-2 block font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
                        {matchCount} matching
                      </span>
                    </span>
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition ${answers.party === p.slug ? 'border-flame bg-flame text-white' : 'border-sand-300 text-transparent'}`}>
                      <span className="icon icon-check h-4 w-4" aria-hidden="true"></span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-white p-5">
              <label className="flex flex-wrap items-center gap-3">
                <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Roughly how many of you?</span>
                <span className="inline-flex items-center rounded-full border border-sand-300">
                  <button 
                    type="button" 
                    onClick={() => setAnswers({...answers, guests: Math.max(1, answers.guests - 1)})}
                    className="grid h-11 w-11 place-items-center rounded-l-full text-ink-700 transition hover:bg-sand"
                    aria-label="One fewer guest"
                  >
                    <span className="icon icon-minus h-4 w-4" aria-hidden="true"></span>
                  </button>
                  <input 
                    type="number" 
                    min="1" max="20" 
                    value={answers.guests}
                    onChange={(e) => setAnswers({...answers, guests: Math.min(20, Math.max(1, Number(e.target.value) || 1))})}
                    className="counter-input h-11 w-14 border-0 bg-transparent p-0 text-center font-display text-lg text-ink-700 focus:ring-0"
                    aria-label="Number of guests" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setAnswers({...answers, guests: Math.min(20, answers.guests + 1)})}
                    className="grid h-11 w-11 place-items-center rounded-r-full text-ink-700 transition hover:bg-sand"
                    aria-label="One more guest"
                  >
                    <span className="icon icon-plus h-4 w-4" aria-hidden="true"></span>
                  </button>
                </span>
                {answers.guests >= 8 && (
                  <span className="text-sm text-ink/60">
                    At {answers.guests} you may be better off taking a whole boat — <Link href="/charter" className="text-flame-600 underline underline-offset-4">see charter</Link>.
                  </span>
                )}
              </label>
            </div>
          </section>
        )}

        {/* STEP 5: Matches */}
        {step === 5 && (
          <section className="animate-in fade-in duration-200">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="font-mark text-eyebrow uppercase text-flame">Your matches</p>
                <h1 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
                  {getMatchHeadline()}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-ink/70">
                  {getMatchSubline()}
                </p>
              </div>
              <button 
                type="button" 
                onClick={handleReset}
                className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4"
              >
                Start the five questions again
              </button>
            </div>

            {state === "loading" && (
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-sand-300 aspect-[4/3] rounded-2xl"></div>
                    <div className="mt-4 h-5 w-3/4 bg-sand-300 rounded"></div>
                    <div className="mt-2 h-3.5 w-full bg-sand-300 rounded"></div>
                    <div className="mt-1.5 h-3.5 w-2/3 bg-sand-300 rounded"></div>
                    <div className="mt-4 h-4 w-1/3 bg-sand-300 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {state === "ready" && matches.length === 0 && (
              <div className="mt-10">
                <div className="rounded-3xl border border-dashed border-mist-300 bg-white px-6 py-12 text-center">
                  <span className="icon icon-empty-state mx-auto h-12 w-12 text-mist-400" aria-hidden="true"></span>
                  <h2 className="mt-5 font-display text-2xl text-ink-700">Nothing fits all four answers</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                    That is useful information rather than a dead end. Loosen one answer and see what
                    appears — or let us build it as a private charter, which is where most impossible
                    combinations end up.
                  </p>

                  {relaxOptions.length > 0 && (
                    <div className="mt-7">
                      <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Drop one answer</p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {relaxOptions.map(r => (
                          <button 
                            key={r.key}
                            type="button" 
                            onClick={() => handleClear(r.key)}
                            className="rounded-full border border-sand-300 px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-flame hover:text-flame-600"
                          >
                            <span>{r.label}</span>
                            <span className="text-mist-700"> · {r.count} match</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <Link href="/charter" className="inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                      Build it as a charter
                    </Link>
                    <Link href="/contact" className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">
                      Ask a person
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {state === "ready" && matches.length > 0 && (
              <div className="mt-10 space-y-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:gap-6">
                  {matches.map(t => (
                    <TripCard key={t.slug} trip={t} />
                  ))}
                </div>

                {matchDepartures.length > 0 && (
                  <div className="rounded-3xl bg-white p-6 lg:p-8">
                    <h2 className="font-display text-2xl font-light text-ink-700">The next dates on these routes</h2>
                    <p className="mt-2 text-sm text-ink/65">Straight to a cabin, if you already know.</p>
                    <div className="mt-6 space-y-3">
                      {matchDepartures.map(d => (
                        <DepartureCard key={d.id} departure={d} />
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-ink/60">
                  Not quite it? <Link href="/experiences#matching" className="text-flame-600 underline underline-offset-4">Open these filters in the full index</Link> and adjust freely.
                </p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* STICKY FOOTER */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-300 bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3.5 sm:px-6 lg:px-8">
          <button 
            type="button" 
            onClick={handleBack} 
            disabled={step === 1}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-sand-300 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink disabled:opacity-40 disabled:hover:border-sand-300"
          >
            <span className="icon icon-chevron-left h-4 w-4" aria-hidden="true"></span>
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
              {step < 5 ? (
                <span>{getFooterHint()}</span>
              ) : (
                <span>{matches.length} {matches.length === 1 ? 'match' : 'matches'}</span>
              )}
            </p>
          </div>

          {step < 5 ? (
            <button 
              type="button" 
              onClick={handleNext} 
              disabled={!canContinue}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-40"
            >
              <span>{step === 4 ? 'See matches' : 'Continue'}</span>
              <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
            </button>
          ) : (
            <Link href="/departures" className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
              All departures
              <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
