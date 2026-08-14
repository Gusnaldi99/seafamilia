import type { Metadata } from "next";
import BookClient from "./BookClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reserve a cabin — Sea Familia",
  description: "Find a departure, confirm the trip, choose a cabin, tell us who is coming, review and reserve. Nothing is charged until confirmed.",
};

export default function BookPage() {
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
      <BookClient />
    </Suspense>
  );
}
