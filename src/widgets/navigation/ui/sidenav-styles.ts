export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--brand-primary]/25";

export function getNavItemClass(active: boolean): string {
  return active
    ? "bg-brand-primary-light text-[--brand-primary] font-medium hover:bg-[--brand-primary-light]"
    : "text-[--text-secondary] hover:bg-surface-hover hover:text-[--text-primary]";
}

export const FOOTER_ITEM_CLASS =
  "text-[--text-secondary] hover:bg-surface-hover hover:text-[--text-primary]";
