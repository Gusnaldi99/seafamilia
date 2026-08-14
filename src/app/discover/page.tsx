import type { Metadata } from "next";
import DiscoverClient from "./DiscoverClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Plan your trip — Sea Familia",
  description: "Five questions — what you want to do, which water, how long, and who is coming — and we show the Sea Familia voyages that actually fit.",
};

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="animate-pulse space-y-4 max-w-sm w-full p-6">
          <div className="h-4 bg-sand-300 rounded w-1/4"></div>
          <div className="h-8 bg-sand-300 rounded w-3/4"></div>
          <div className="h-4 bg-sand-300 rounded w-full"></div>
        </div>
      </div>
    }>
      <DiscoverClient />
    </Suspense>
  );
}
