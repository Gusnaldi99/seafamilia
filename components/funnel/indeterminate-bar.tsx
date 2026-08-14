/** Submit-in-progress bar under a funnel's sticky footer — `.bar-indeterminate`
 * is an existing CSS animation (styles/feedback.css), ported as-is. */
export function IndeterminateBar({ show }: { show: boolean }) {
  if (!show) return null;
  return <div className="bar-indeterminate h-0.5 w-full bg-sand-300" />;
}
