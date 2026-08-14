/** Shared across every form's zod schema (contact, charter, reserve) — kept
 * in one place once a third consumer needed the identical pattern. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
