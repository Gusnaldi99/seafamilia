import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Sea Familia — Liveaboard voyages in eastern Indonesia",
  description:
    "Four hand-built phinisi sailing Komodo, Raja Ampat, the Banda Sea and beyond. Reserve a cabin on an open trip, or take the whole boat.",
  icons: { icon: "/media/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-full flex flex-col bg-white font-sans text-ink antialiased">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
