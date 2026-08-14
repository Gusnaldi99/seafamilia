import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Charter — Sea Familia",
  description: "Request dates for a private charter.",
};

export default function CharterDatesPage() {
  return (
    <div className="bg-sand min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-ink-700 sm:text-5xl lg:text-7xl">Request a Charter</h1>
        <p className="mt-6 text-lg text-ink/70">
          This is a placeholder page for charter inquiries and dates selection.
        </p>
      </div>
    </div>
  );
}
