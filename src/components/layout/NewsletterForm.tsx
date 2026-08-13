"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // Placeholder — will be wired to API
    setSent(true);
  }

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      {!sent ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-full border-white/20 bg-white/5 px-5 text-white placeholder:text-white/40 focus:border-mist focus:ring-2 focus:ring-mist/40"
              />
            </label>
            <button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-white px-6 font-mark text-[12px] uppercase tracking-[0.16em] text-ink-700 transition hover:bg-sand"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/45">
            We keep your address on our own server and never pass it on.
            Unsubscribe is one click, in every letter.
          </p>
        </>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
          <span className="mt-0.5 text-mist-300">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm leading-relaxed text-white/85">
            You are on the list. The next letter goes out at the start of the month — until then, nothing.
          </p>
        </div>
      )}
    </form>
  );
}
