/** Sticky bottom bar shell shared by all three funnels — each funnel fills
 * the three slots with its own back/hint/continue content, which differs
 * enough (plain hint text vs a running total, "Continue" vs "Send" …) that
 * only the positioning/chrome is worth sharing. */
export function FunnelFooter({
  left,
  center,
  right,
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-300 bg-white/95 shadow-rail backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3.5 sm:px-6 lg:px-8">
        {left}
        <div className="min-w-0 flex-1 text-center">{center}</div>
        {right}
      </div>
    </div>
  );
}
