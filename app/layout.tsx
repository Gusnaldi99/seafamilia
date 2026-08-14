import type { Metadata } from "next";
import { fraunces, inter, jost } from "./fonts";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { HelpButton } from "@/components/chrome/help-button";
import { RevealSections } from "@/components/reveal-sections";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sea Familia — Liveaboard voyages in eastern Indonesia",
    template: "%s · Sea Familia",
  },
  description:
    "Four hand-built phinisi sailing Komodo, Raja Ampat, the Banda Sea and beyond. Reserve a cabin on an open trip, or take the whole boat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jost.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a
          href="#main"
          className="skip-link rounded-full bg-ink px-4 py-2 font-mark text-xs uppercase tracking-[0.16em] text-white"
        >
          Skip to content
        </a>
        <LocaleProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <HelpButton />
          <Toaster position="bottom-right" />
          <RevealSections />
        </LocaleProvider>
      </body>
    </html>
  );
}
