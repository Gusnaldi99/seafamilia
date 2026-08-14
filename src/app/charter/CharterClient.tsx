"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { boats, waters, experiences, inclusions, type Boat } from "@/lib/api/data";

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US")}`;
};

const counters = [
  { key: "adults", label: "Adults", note: "16 and over", min: 0, max: 24 },
  { key: "teens", label: "Teenagers", note: "12 – 15", min: 0, max: 12 },
  { key: "children", label: "Children", note: "4 – 11 — younger, please ask", min: 0, max: 12 },
];

export default function CharterClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    from: "",
    to: "",
    flexible: false,
    nights: "",
    adults: 2,
    teens: 0,
    children: 0,
    boat: "",
    waters: [] as string[],
    experiences: [] as string[],
    notes: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    contactVia: "Email",
    consent: false,
    newsletter: false,
  });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("sf.charter");
      if (saved) {
        setForm((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {}

    const queryStep = searchParams.get("step");
    if (queryStep) {
      const wanted = Math.max(1, Math.min(4, Number(queryStep) || 1));
      setStep(wanted);
    }
    
    if (searchParams.get("sent") === "1") {
      setStep(5);
    }

    const qBoat = searchParams.get("boat");
    if (qBoat && boats.find(b => b.slug === qBoat)) {
      setForm(prev => ({ ...prev, boat: qBoat }));
    }

    const qWater = searchParams.get("water");
    if (qWater && waters.find(w => w.slug === qWater)) {
      setForm(prev => {
        if (!prev.waters.includes(qWater)) {
          return { ...prev, waters: [...prev.waters, qWater] };
        }
        return prev;
      });
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      sessionStorage.setItem("sf.charter", JSON.stringify(form));
    } catch (e) {}
  }, [form]);

  const stepLabel = { 2: "Dates and group", 3: "Preferences", 4: "Your details" }[step as 2 | 3 | 4] || "";
  const groupTotal = form.adults + form.teens + form.children;
  const fitsBoats = boats.filter((b) => b.guests >= groupTotal);
  
  const fits = (b: Boat) => b.guests >= groupTotal;

  const getFooterHint = () => {
    if (step === 1) return "Three minutes, nothing binding";
    if (step === 2) return `${groupTotal} guests${form.flexible ? " · dates flexible" : ""}`;
    if (step === 3) {
      const bits = [];
      if (form.boat) {
        const b = boats.find(x => x.slug === form.boat);
        bits.push(form.boat === "recommend" ? "boat: our pick" : b?.name || "");
      }
      if (form.waters.length) bits.push(`${form.waters.length} waters`);
      if (form.experiences.length) bits.push(`${form.experiences.length} interests`);
      return bits.length > 0 ? bits.join(" · ") : "All optional — skip if you like";
    }
    return "One reply, from a person, within a day";
  };

  const getSummaryRows = () => {
    const b = form.boat === "recommend" ? "Your recommendation" : 
              form.boat ? boats.find(x => x.slug === form.boat)?.name : "Not specified";
    const waterNames = form.waters.length > 0 
      ? form.waters.map(w => waters.find(x => x.slug === w)?.short).filter(Boolean).join(", ")
      : "Open to suggestions";
    const expNames = form.experiences.length > 0
      ? form.experiences.map(e => experiences.find(x => x.slug === e)?.name).filter(Boolean).join(", ")
      : "Not specified";
    
    const dateFormatted = form.flexible ? "Flexible — advise us" :
      (form.from || form.to) ? `${form.from} → ${form.to}` : "Not specified";

    return [
      { label: "Group", value: `${groupTotal} guests (${form.adults} adults, ${form.teens} teens, ${form.children} children)` },
      { label: "Dates", value: dateFormatted },
      { label: "Length", value: form.nights || "Not sure yet" },
      { label: "Boat", value: b },
      { label: "Waters", value: waterNames },
      { label: "Interests", value: expNames },
      { label: "Reply via", value: form.contactVia },
    ];
  };

  const has = (key: "waters" | "experiences", val: string) => form[key].includes(val);
  const toggle = (key: "waters" | "experiences", val: string) => {
    setForm(prev => {
      const arr = prev[key];
      if (arr.includes(val)) {
        return { ...prev, [key]: arr.filter(x => x !== val) };
      }
      return { ...prev, [key]: [...arr, val] };
    });
  };

  const bump = (key: "adults" | "teens" | "children", delta: number) => {
    const c = counters.find(x => x.key === key)!;
    setForm(prev => ({
      ...prev,
      [key]: Math.max(c.min, Math.min(c.max, prev[key] + delta))
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (step === 2) {
      if (!form.flexible && !form.from && !form.to) {
        newErrors.dates = "Give us a rough window, or tick “our dates are open”.";
      }
      if (!form.flexible && form.from && form.to && form.to < form.from) {
        newErrors.dates = "The return date is before the departure date.";
      }
      if (groupTotal < 1) newErrors.group = "There has to be at least one of you.";
    }
    if (step === 4) {
      if (!form.name.trim()) newErrors.name = "What should we call you?";
      if (!form.email.trim()) newErrors.email = "We need somewhere to send the quote.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
        newErrors.email = "That address is missing something — check for a typo.";
      }
      if (!form.consent) newErrors.consent = "We cannot reply without your permission to use these details.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goto = (n: number) => {
    const newStep = Math.max(1, Math.min(5, n));
    setStep(newStep);
    if (newStep <= 4) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", newStep.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    }
  };

  const next = () => {
    if (validate()) goto(step + 1);
  };
  const back = () => {
    setErrors({});
    goto(step - 1);
  };

  const submit = () => {
    if (!validate()) return;
    setBusy(true);
    setSubmitError(false);

    // Simulate API call
    setTimeout(() => {
      // success path
      const ref = `SF-${(groupTotal * 7919 + form.name.length).toString(16).toUpperCase()}`;
      setReference(ref);
      setBusy(false);
      setStep(5);
      try { sessionStorage.removeItem("sf.charter"); } catch (e) {}
      router.push(`${pathname}?sent=1`, { scroll: true });
    }, 900);
  };

  return (
    <main id="main" className="pb-28 lg:pb-32">
      {/* STEP 1 — INTRO */}
      {step === 1 && (
        <section className="animate-in fade-in duration-200">
          <div className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-ink">
            <div className="ph ph-sunset absolute inset-0">
              <ImageSlot className="img-slot h-full w-full object-cover" src="/media/photos/charter.jpg" alt="" loading="lazy" />
            </div>
            <div className="scrim absolute inset-0"></div>
            <div className="relative mx-auto w-full max-w-8xl px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
              <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
                <Link href="/" className="hover:text-white">Home</Link>
                <span className="px-2" aria-hidden="true">/</span>
                <Link href="/boats" className="hover:text-white">Boats</Link>
                <span className="px-2" aria-hidden="true">/</span>
                <span className="text-white">Private charter</span>
              </nav>
              <div className="mt-8 max-w-2xl">
                <span className="wave-rule wave-rule-light block"></span>
                <p className="mt-5 font-mark text-eyebrow uppercase text-white/70">Private charter</p>
                <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  The whole boat,<br className="hidden sm:block" /> and no strangers at dinner
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                  Eight to twenty of you, on any dates a boat is free, sailing a route we draw with you
                  rather than hand to you. Most of our charters are families, a few are dive clubs, and
                  one was a wedding.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
              <div>
                <p className="font-mark text-eyebrow uppercase text-flame">How it works</p>
                <ol className="mt-6 space-y-7">
                  <li className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                    <span className="font-display text-2xl text-mist">01</span>
                    <div>
                      <h2 className="font-display text-xl text-ink-700">You tell us four things</h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                        Roughly when, roughly how many, which water pulls at you, and what the group
                        actually enjoys. Three minutes, and nothing is binding.
                      </p>
                    </div>
                  </li>
                  <li className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                    <span className="font-display text-2xl text-mist">02</span>
                    <div>
                      <h2 className="font-display text-xl text-ink-700">Ratih replies within a working day</h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                        A real person, with which boats are free, a firm day rate, and usually an opinion
                        about your dates that you did not ask for.
                      </p>
                    </div>
                  </li>
                  <li className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                    <span className="font-display text-2xl text-mist">03</span>
                    <div>
                      <h2 className="font-display text-xl text-ink-700">We draw the route together</h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                        One or two calls with the cruise director. Anchorages, dive plan, what time your
                        teenagers are likely to surface, whether anyone gets seasick.
                      </p>
                    </div>
                  </li>
                  <li className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                    <span className="font-display text-2xl text-mist">04</span>
                    <div>
                      <h2 className="font-display text-xl text-ink-700">30% holds the boat</h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                        Balance 60 days out. Dates move once, free of charge, whatever the notice —
                        charter groups have school terms and grandparents to work around.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <aside className="space-y-4 lg:pt-12">
                <div className="rounded-3xl bg-white p-6 lg:p-7">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Indicative day rates</h2>
                  <p className="mt-2 text-xs leading-relaxed text-ink/60">
                    Per boat, per day, all guests included. High season and remote waters carry a
                    surcharge; long charters carry a discount. The quote you get is firm.
                  </p>
                  <ul className="mt-5 space-y-3">
                    {boats.map(b => (
                      <li key={b.slug} className="flex items-baseline justify-between gap-4 border-b border-sand-200 pb-3 last:border-0 last:pb-0">
                        <span>
                          <Link href={`/boats/${b.slug}`} className="font-display text-base text-ink-700 hover:text-flame-600">
                            {b.name}
                          </Link>
                          <span className="block font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
                            Up to {b.guests} guests
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="tnum font-display text-lg text-deep-700">{formatPrice(b.charterDay)}</span>
                          <span className="block text-[11px] text-ink/50">per day</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What that covers</h2>
                  <ul className="mt-4 space-y-2.5">
                    {inclusions.included.slice(0, 6).map(i => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                        <span className="icon icon-check mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true"></span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>

            <div className="mt-14 rounded-3xl border border-sand-300 bg-white p-6 lg:p-8">
              <h2 className="font-display text-2xl font-light text-ink-700">Not sure charter is the right shape?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
                If there are fewer than six of you, an open trip is usually better value and rather more
                sociable — you get the same boat, crew and route for a fraction of the cost, and most
                guests end up friends by day three.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/departures" className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">
                  Look at open trips
                </Link>
                <Link href="/faq" className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">
                  Read the questions we get
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STEPS 2-4 — ENQUIRY */}
      {step >= 2 && step <= 4 && (
        <div className="animate-in fade-in duration-200">
          <div className="border-b border-sand-300 bg-white">
            <div className="mx-auto max-w-3xl px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Charter enquiry</p>
                  <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                    Step {step - 1} of 3 · {stepLabel}
                  </p>
                </div>
                <button type="button" onClick={() => goto(1)} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-ink/60 hover:text-flame-600">
                  <span className="icon icon-cross h-4 w-4" aria-hidden="true"></span>
                  Save and leave
                </button>
              </div>
              <ol className="mt-5 flex gap-1.5" aria-label="Progress">
                {[2, 3, 4].map(n => (
                  <li key={n} className="flex-1">
                    <span className={`block h-1 rounded-full transition ${n < step ? 'bg-flame' : n === step ? 'bg-ink' : 'bg-sand-300'}`}></span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 lg:py-14">
            
            {step === 2 && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                  When, and how many of you?
                </h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  Approximate is fine. If your dates are flexible, say so — it usually gets you a better
                  boat and a better rate.
                </p>

                <div className="mt-8 space-y-6">
                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>Dates</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-ink/70">Earliest you could sail</span>
                        <input type="date" value={form.from} onChange={e => setForm({...form, from: e.target.value})} disabled={form.flexible} min="2026-08-01"
                               aria-invalid={errors.dates ? 'true' : 'false'}
                               className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40 disabled:opacity-50" />
                      </label>
                      <label className="block">
                        <span className="text-sm text-ink/70">Latest you would return</span>
                        <input type="date" value={form.to} onChange={e => setForm({...form, to: e.target.value})} disabled={form.flexible} min="2026-08-01"
                               aria-invalid={errors.dates ? 'true' : 'false'}
                               className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40 disabled:opacity-50" />
                      </label>
                    </div>

                    <label className="mt-4 flex items-start gap-3">
                      <input type="checkbox" checked={form.flexible} onChange={e => setForm({...form, flexible: e.target.checked})}
                             className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame focus:ring-mist/40" />
                      <span className="text-sm leading-relaxed text-ink/80">
                        Our dates are open — tell us when the sailing is best.
                        <span className="mt-0.5 block text-xs text-ink/55">
                          Seasons vary by region; this lets us match you to the right water rather than the
                          right week.
                        </span>
                      </span>
                    </label>

                    <label className="mt-4 block">
                      <span className="text-sm text-ink/70">How many nights, roughly?</span>
                      <select value={form.nights} onChange={e => setForm({...form, nights: e.target.value})}
                              className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40">
                        <option value="">Not sure yet</option>
                        <option value="3-5">3 – 5 nights</option>
                        <option value="6-8">6 – 8 nights</option>
                        <option value="9-12">9 – 12 nights</option>
                        <option value="13+">Longer than a fortnight</option>
                      </select>
                    </label>

                    {errors.dates && <p role="alert" className="mt-3 text-sm text-flame-600">{errors.dates}</p>}
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>Your group</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>
                    <p className="mt-1 text-xs text-ink/55">
                      We ask about children separately because it changes which boat we suggest, not the price.
                    </p>

                    <div className="mt-4 space-y-4">
                      {counters.map(c => (
                        <div key={c.key} className="flex items-center justify-between gap-4 border-b border-sand-200 pb-4 last:border-0 last:pb-0">
                          <span>
                            <span className="block text-sm text-ink-700">{c.label}</span>
                            <span className="block text-xs text-ink/55">{c.note}</span>
                          </span>
                          <span className="inline-flex shrink-0 items-center rounded-full border border-sand-300">
                            <button type="button" onClick={() => bump(c.key as any, -1)} disabled={form[c.key as keyof typeof form] as number <= c.min}
                                    className="grid h-11 w-11 place-items-center rounded-l-full text-ink-700 transition hover:bg-sand disabled:opacity-30">
                              <span className="icon icon-minus h-4 w-4" aria-hidden="true"></span>
                            </button>
                            <span className="w-12 text-center font-display text-lg text-ink-700">{form[c.key as keyof typeof form] as number}</span>
                            <button type="button" onClick={() => bump(c.key as any, 1)} disabled={form[c.key as keyof typeof form] as number >= c.max}
                                    className="grid h-11 w-11 place-items-center rounded-r-full text-ink-700 transition hover:bg-sand disabled:opacity-30">
                              <span className="icon icon-plus h-4 w-4" aria-hidden="true"></span>
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 rounded-xl bg-sand p-3.5 text-sm leading-relaxed text-ink/75" aria-live="polite">
                      {groupTotal} guests
                      {groupTotal > 0 && <span> · {fitsBoats.length} of our four boats fit you</span>}
                      {groupTotal > 20 && (
                        <span className="block text-flame-600">
                          Larger than our biggest boat — we can run two hulls together, which we have done twice.
                        </span>
                      )}
                      {groupTotal > 0 && groupTotal < 6 && (
                        <span className="block text-ink/60">
                          At this size an open trip is usually better value. We will say so in the reply, honestly.
                        </span>
                      )}
                    </p>
                    {errors.group && <p role="alert" className="mt-3 text-sm text-flame-600">{errors.group}</p>}
                  </fieldset>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                  What would make it yours?
                </h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  Pick as many as apply, or none — “we have no idea, surprise us” is a perfectly good brief
                  and one we rather enjoy.
                </p>

                <div className="mt-8 space-y-6">
                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>Boat</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {boats.map(b => (
                        <button key={b.slug} type="button" onClick={() => setForm({...form, boat: b.slug})} aria-pressed={form.boat === b.slug}
                                className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition ${form.boat === b.slug ? 'border-flame' : 'border-sand-300 hover:border-mist'}`}>
                          <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-ink">
                            <span className={`ph absolute inset-0 block ph-${b.ph}`}>
                              <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/boats/${b.slug}.jpg`} alt={b.name} loading="lazy" />
                            </span>
                          </span>
                          <span className="min-w-0">
                            <span className="block font-display text-base leading-tight text-ink-700">{b.name}</span>
                            <span className="block text-xs text-ink/60">
                              Up to {b.guests} · {formatPrice(b.charterDay)}/day
                            </span>
                            {!fits(b) && (
                              <span className="mt-0.5 block font-mark text-[10px] uppercase tracking-[0.12em] text-flame-600">
                                Too small for {groupTotal}
                              </span>
                            )}
                          </span>
                        </button>
                      ))}
                      <button type="button" onClick={() => setForm({...form, boat: 'recommend'})} aria-pressed={form.boat === 'recommend'}
                              className={`rounded-xl border-2 border-dashed p-4 text-left transition sm:col-span-2 ${form.boat === 'recommend' ? 'border-flame' : 'border-sand-300 hover:border-mist'}`}>
                        <span className="block font-display text-base text-ink-700">Recommend one for us</span>
                        <span className="block text-xs text-ink/60">Based on the group and the water. This is what most people choose.</span>
                      </button>
                    </div>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>Waters</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>
                    <p className="mt-1 text-xs text-ink/55">Choose any that appeal. Season may decide for us.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {waters.map(w => (
                        <button key={w.slug} type="button" onClick={() => toggle('waters', w.slug)} aria-pressed={has('waters', w.slug)}
                                className={`rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] transition ${has('waters', w.slug) ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'}`}>
                          {w.short}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>What the group enjoys</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {experiences.map(e => (
                        <button key={e.slug} type="button" onClick={() => toggle('experiences', e.slug)} aria-pressed={has('experiences', e.slug)}
                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${has('experiences', e.slug) ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'}`}>
                          <span className={`icon h-5 w-5 shrink-0 icon-exp-${e.slug}`} aria-hidden="true"></span>
                          <span className="text-sm">{e.name}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>Anything we should know</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>
                    <label className="mt-3 block">
                      <span className="sr-only">Notes for the office</span>
                      <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={4} maxLength={600}
                                placeholder="Celebrating something? Non-swimmers, wheelchair user, a nervous flyer, a chef in the family with opinions? All useful."
                                className="w-full rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/40 focus:border-mist focus:ring-2 focus:ring-mist/40"></textarea>
                    </label>
                    <p className="mt-1.5 text-right text-xs text-ink/45">
                      {(form.notes || "").length} / 600
                    </p>
                  </fieldset>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                  Where should Ratih reach you?
                </h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  One person from the office, one reply, within a working day. No sequence of automated
                  emails — we do not have one.
                </p>

                <div className="mt-8 space-y-6">
                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>Summary so far</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>
                    <dl className="mt-4 space-y-3 border-l-2 border-sand-300 pl-4">
                      {getSummaryRows().map(r => (
                        <div key={r.label}>
                          <dt className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{r.label}</dt>
                          <dd className="mt-0.5 text-sm text-ink-700">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>Your details</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-ink/70">Name</span>
                        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                               aria-invalid={errors.name ? 'true' : 'false'}
                               className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40" />
                        {errors.name && <p className="mt-1.5 text-sm text-flame-600">{errors.name}</p>}
                      </label>
                      <label className="block">
                        <span className="text-sm text-ink/70">Email</span>
                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                               aria-invalid={errors.email ? 'true' : 'false'}
                               className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40" />
                        {errors.email && <p className="mt-1.5 text-sm text-flame-600">{errors.email}</p>}
                      </label>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-ink/70">Phone (optional)</span>
                        <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                               placeholder="+1 234 567 890"
                               className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/30 focus:border-mist focus:ring-2 focus:ring-mist/40" />
                      </label>
                      <label className="block">
                        <span className="text-sm text-ink/70">Country of residence (optional)</span>
                        <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                               className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40" />
                      </label>
                    </div>

                    <div className="mt-4">
                      <span className="block text-sm text-ink/70">How should we reply?</span>
                      <div className="mt-2 flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="contactVia" value="Email" checked={form.contactVia === "Email"} onChange={e => setForm({...form, contactVia: e.target.value})}
                                 className="h-4 w-4 border-sand-300 text-flame focus:ring-mist/40" />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="contactVia" value="WhatsApp" checked={form.contactVia === "WhatsApp"} onChange={e => setForm({...form, contactVia: e.target.value})}
                                 className="h-4 w-4 border-sand-300 text-flame focus:ring-mist/40" />
                          <span className="text-sm">WhatsApp</span>
                        </label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                      <span>Permissions</span>
                      <span className="h-px flex-1 bg-sand-300"></span>
                    </legend>
                    <label className="mt-3 flex items-start gap-3">
                      <input type="checkbox" checked={form.consent} onChange={e => setForm({...form, consent: e.target.checked})}
                             aria-invalid={errors.consent ? 'true' : 'false'}
                             className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame focus:ring-mist/40" />
                      <span className="text-sm leading-relaxed text-ink/80">
                        Sea Familia can store these details to process my enquiry and contact me about it,
                        in line with the <Link href="/policies#privacy" target="_blank" className="underline underline-offset-4">privacy policy</Link>.
                      </span>
                    </label>
                    {errors.consent && <p role="alert" className="mt-2 text-sm text-flame-600">{errors.consent}</p>}

                    <label className="mt-4 flex items-start gap-3">
                      <input type="checkbox" checked={form.newsletter} onChange={e => setForm({...form, newsletter: e.target.checked})}
                             className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame focus:ring-mist/40" />
                      <span className="text-sm leading-relaxed text-ink/80">
                        Send me the familia letter once a month.
                      </span>
                    </label>
                  </fieldset>
                </div>
              </section>
            )}

          </div>
        </div>
      )}

      {/* STEP 5 — SUCCESS */}
      {step === 5 && (
        <section className="animate-in fade-in duration-200 mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:py-20">
          <div className="rounded-4xl bg-white p-7 shadow-card lg:p-12">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-mist-100 text-ink-700">
              <span className="icon icon-big-check h-8 w-8" aria-hidden="true"></span>
            </span>
            <p className="mt-6 font-mark text-eyebrow uppercase text-flame">Request sent</p>
            <h1 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Thank you — this is now on Ratih’s desk
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Not a queue, not a CRM. She reads charter enquiries herself each morning, which is why the
              replies take a day and are worth reading.
            </p>

            <dl className="mt-8 grid gap-4 rounded-2xl bg-sand p-5 sm:grid-cols-2 lg:p-6">
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Your reference</dt>
                <dd className="mt-1 font-display text-2xl tracking-wide text-ink-700">{reference}</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Reply expected</dt>
                <dd className="mt-1 font-display text-2xl text-ink-700">Within 1 working day</dd>
              </div>
            </dl>

            <div className="mt-8">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What happens next</h2>
              <ol className="mt-4 space-y-3.5">
                <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist"></span>
                  A confirmation email is already on its way to
                  <strong className="text-ink-700 ml-1">{form.email}</strong>.
                </li>
                <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist"></span>
                  Ratih replies with available boats, a firm day rate and a first route sketch.
                </li>
                <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist"></span>
                  If it looks right, a call with the cruise director to shape the days.
                </li>
                <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist"></span>
                  30% holds the boat. Nothing is charged before you say so.
                </li>
              </ol>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="https://wa.me/6281100000000" target="_blank" rel="noopener noreferrer"
                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600">
                Add it on WhatsApp
              </a>
              <Link href="/journal" className="inline-flex flex-1 items-center justify-center rounded-full border border-ink/20 px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink">
                Read the journal meanwhile
              </Link>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-ink/50">
              Nothing arrived within a working day? Something went wrong at our end rather than yours —
              message the office directly on WhatsApp and quote <span className="text-ink-700">{reference}</span>.
            </p>
          </div>
        </section>
      )}

      {/* FOOTER */}
      {step <= 4 && (
        <>
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-300 bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3.5 sm:px-6">
              {step > 1 && (
                <button type="button" onClick={back}
                        className="inline-flex h-12 items-center gap-2 rounded-full border border-sand-300 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink">
                  <span className="icon icon-chevron-left h-4 w-4" aria-hidden="true"></span>
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">{getFooterHint()}</p>
              </div>

              {step === 1 && (
                <button type="button" onClick={() => goto(2)}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                  Start a request
                  <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
                </button>
              )}

              {(step === 2 || step === 3) && (
                <button type="button" onClick={next}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                  <span>Continue</span>
                  <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
                </button>
              )}

              {step === 4 && (
                <button type="button" onClick={submit} disabled={busy}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-60">
                  {!busy ? <span>Send request</span> : <span>Sending…</span>}
                </button>
              )}
            </div>
            {busy && <div className="bar-indeterminate h-0.5 w-full bg-sand-300"></div>}
          </div>
        </>
      )}
    </main>
  );
}
