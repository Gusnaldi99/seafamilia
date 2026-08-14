'use client';

/**
 * Floating WhatsApp affordance, ported from partials/help.html. Suppressed
 * on the funnels via a pathname check rather than a route-group layout:
 * not-found.tsx/error.tsx render inside the *root* layout only, and the
 * original correctly shows this button on 404/error pages too.
 */
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { WhatsApp } from '@/components/icons';
import { useLocale } from '@/components/providers/locale-provider';

const WHATSAPP_HREF = 'https://wa.me/6281100000000';
const SUPPRESSED_PREFIXES = ['/plan', '/reserve', '/charter'];

export function HelpButton() {
  const pathname = usePathname();
  const { t } = useLocale();

  if (SUPPRESSED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 hidden lg:block">
      <Button asChild variant="dark" size="lg" className="gap-2.5 pl-4 pr-5 shadow-lift">
        <a href={WHATSAPP_HREF} target="_blank" rel="noopener">
          <WhatsApp data-icon="inline-start" className="h-5 w-5" aria-hidden="true" />
          <span>{t('cta.help')}</span>
        </a>
      </Button>
    </div>
  );
}
