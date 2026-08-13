"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { departures, trips, findBoat, findWater } from "@/lib/api/data";
import { formatMoney, formatDateRange } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

export default function BookingFlow() {
  const params = useParams();
  const depId = params.id as string;
  
  const [step, setStep] = useState<Step>(1);
  const [cabin, setCabin] = useState<string>("Standard");
  const [guests, setGuests] = useState<number>(2);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Find the departure
  const departure = departures.find(d => d.id === depId);
  if (!departure) return notFound();
  
  const trip = trips.find(t => t.slug === departure.trip)!;
  const boat = findBoat(departure.boat)!;
  const water = findWater(trip.water)!;
  
  const handleNext = () => setStep(s => Math.min(s + 1, 4) as Step);
  const handlePrev = () => setStep(s => Math.max(s - 1, 1) as Step);

  return (
    <>
      <section className="bg-sand min-h-screen pt-24 pb-16 lg:pt-32">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          
          <div className="mb-8">
             <Link href={`/trip/${trip.slug}`} className="inline-flex font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700 hover:text-ink-700">
               ← Back to trip details
             </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:gap-12">
            
            {/* Left: Stepper Content */}
            <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-10 shadow-card">
              
              {/* Progress */}
              <div className="mb-10 flex items-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-flame" : "bg-sand-300"}`} 
                  />
                ))}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="font-display text-3xl text-ink-700">Select Cabin</h2>
                  <p className="mt-2 text-ink/70">
                    We offer two grades of cabins. Both have en-suite bathrooms and air conditioning.
                  </p>
                  
                  <div className="mt-8 space-y-4">
                    {["Standard", "Master"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCabin(c)}
                        className={`w-full text-left rounded-2xl border p-5 transition ${
                          cabin === c ? "border-flame bg-flame/5" : "border-sand-300 hover:border-mist-400"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className={`font-display text-xl ${cabin === c ? "text-flame" : "text-ink-700"}`}>
                            {c} Cabin
                          </div>
                          <div className="tnum font-display text-lg">
                            {c === "Standard" ? formatMoney(departure.price) : formatMoney(departure.price * 1.2)}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-ink/60">
                          {c === "Standard" ? "Lower deck, twin or double configuration." : "Upper deck, panoramic windows, double only."}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 flex justify-end">
                    <button onClick={handleNext} className="rounded-full bg-flame px-8 py-3 font-mark text-[12px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600">
                      Next step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="font-display text-3xl text-ink-700">Lead Guest</h2>
                  <p className="mt-2 text-ink/70">
                    We just need a few details to hold your reservation. No payment required yet.
                  </p>
                  
                  <div className="mt-8 space-y-5">
                    <div>
                      <label className="block font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 h-12 w-full rounded-xl border-sand-300 bg-sand px-4 text-ink-700 focus:border-mist focus:ring-1 focus:ring-mist"
                      />
                    </div>
                    <div>
                      <label className="block font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 h-12 w-full rounded-xl border-sand-300 bg-sand px-4 text-ink-700 focus:border-mist focus:ring-1 focus:ring-mist"
                      />
                    </div>
                    <div>
                      <label className="block font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">Number of Guests in Cabin</label>
                      <select 
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="mt-2 h-12 w-full rounded-xl border-sand-300 bg-sand px-4 text-ink-700 focus:border-mist focus:ring-1 focus:ring-mist"
                      >
                        <option value={1}>1 (Solo)</option>
                        <option value={2}>2</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-10 flex justify-between">
                    <button onClick={handlePrev} className="font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700 hover:text-ink-700">
                      ← Back
                    </button>
                    <button onClick={handleNext} disabled={!name || !email} className="rounded-full bg-flame px-8 py-3 font-mark text-[12px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600 disabled:opacity-50">
                      Next step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <h2 className="font-display text-3xl text-ink-700">Extras</h2>
                  <p className="mt-2 text-ink/70">
                    Will you be diving with us?
                  </p>
                  
                  <div className="mt-8 space-y-4">
                    <label className="flex items-start gap-4 rounded-2xl border border-sand-300 p-5">
                      <input type="checkbox" className="mt-1 h-5 w-5 rounded border-sand-300 text-flame focus:ring-flame" />
                      <div>
                        <div className="font-display text-xl text-ink-700">Dive Gear Rental</div>
                        <div className="text-sm text-ink/60">Full set including BCD, reg, wetsuit. (Can be sized later)</div>
                      </div>
                    </label>
                  </div>

                  <div className="mt-10 flex justify-between">
                    <button onClick={handlePrev} className="font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700 hover:text-ink-700">
                      ← Back
                    </button>
                    <button onClick={handleNext} className="rounded-full bg-flame px-8 py-3 font-mark text-[12px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600">
                      Review
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="animate-fade-in text-center py-10">
                  <span className="wave-rule wave-rule-flame mx-auto block" />
                  <h2 className="mt-6 font-display text-4xl text-ink-700">Reservation Request</h2>
                  <p className="mt-4 text-ink/70 max-w-md mx-auto">
                    We will hold this cabin for 48 hours and send a secure payment link for the 25% deposit to {email}.
                  </p>
                  
                  <div className="mt-10">
                    <button onClick={() => alert("Mock checkout complete!")} className="rounded-full bg-flame px-10 py-4 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600">
                      Confirm Reservation
                    </button>
                  </div>
                  
                  <button onClick={handlePrev} className="mt-8 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700 hover:text-ink-700">
                    ← Go back
                  </button>
                </div>
              )}

            </div>
            
            {/* Right: Summary Panel */}
            <div>
              <div className="sticky top-32 rounded-3xl border border-ink bg-ink p-6 text-white sm:p-8">
                <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-mist-300">
                  Reservation Summary
                </h3>
                
                <div className="mt-6 font-display text-2xl text-white">
                  {trip.title}
                </div>
                
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  <li>{formatDateRange(departure.start, departure.nights)}</li>
                  <li>{boat.name}</li>
                  <li>{water.short}</li>
                </ul>
                
                <div className="mt-6 border-t border-white/20 pt-6">
                  <div className="flex justify-between text-sm text-white/80">
                    <span>Cabin</span>
                    <span>{cabin}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-white/80">
                    <span>Guests</span>
                    <span>{guests}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/20 pt-6">
                  <div className="flex justify-between items-end">
                    <span className="font-mark text-[11px] uppercase tracking-[0.14em]">Total</span>
                    <span className="tnum font-display text-3xl">
                      {cabin === "Standard" ? formatMoney(departure.price * guests) : formatMoney(departure.price * 1.2 * guests)}
                    </span>
                  </div>
                  <div className="mt-1 text-right text-xs text-white/40">Includes taxes and fees</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
