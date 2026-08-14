'use client';

/**
 * Catches errors thrown by the root layout itself — Header/Footer/
 * LocaleProvider all live there, so this can't safely reuse any of them.
 * Next does not load globals.css here (this replaces the whole document,
 * not just <main>), so everything below is inline rather than Tailwind
 * classes that would otherwise resolve to nothing.
 */
import { useEffect, useState } from 'react';

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  function handleRetry() {
    setBusy(true);
    setTimeout(retry, 900);
  }

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#003049',
          color: '#ffffff',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div style={{ maxWidth: '32rem', padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
            500 · Unexpected error
          </p>
          <h1 style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 300, lineHeight: 1.15 }}>Something broke at our end</h1>
          <p style={{ marginTop: '1.25rem', fontSize: '1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
            Not your connection, not your browser — ours. Try again in a moment; if it keeps happening, the office
            can do anything this website can, by hand.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleRetry}
              disabled={busy}
              style={{
                borderRadius: '999px',
                border: 'none',
                backgroundColor: '#c1121f',
                color: '#ffffff',
                padding: '1rem 1.5rem',
                fontSize: '12px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: busy ? 'default' : 'pointer',
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? 'Trying…' : 'Try again'}
            </button>
            <a
              href="https://wa.me/6281100000000"
              target="_blank"
              rel="noopener"
              style={{
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
                padding: '1rem 1.5rem',
                fontSize: '12px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              WhatsApp the office
            </a>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '12px', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>
            hello@seafamilia.com · +62 811 0000 0000
          </p>
        </div>
      </body>
    </html>
  );
}
