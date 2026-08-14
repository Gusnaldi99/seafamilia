import { Suspense } from "react";
import { DestinationsClient } from "./DestinationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations — Sea Familia",
  description:
    "Eight sailing regions across eastern Indonesia: Komodo, Raja Ampat, Banda Sea, Alor & Solor, Triton Bay, Wakatobi, Cenderawasih Bay, and Halmahera.",
};

export default function DestinationsPage() {
  return (
    <Suspense>
      <DestinationsClient />
    </Suspense>
  );
}
