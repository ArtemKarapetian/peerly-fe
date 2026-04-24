/**
 * Locale-aware date/time formatters used across dashboard widgets.
 * Inputs are ISO strings so mock data stays language-agnostic.
 */

const DEMO_NOW = new Date("2026-04-24T12:00:00");

function pickLocale(lang: string): "ru" | "en" {
  return lang.startsWith("ru") ? "ru" : "en";
}

function intlLocale(lang: string): string {
  return pickLocale(lang) === "ru" ? "ru-RU" : "en-US";
}

/** "31 января, 23:59" / "January 31, 11:59 PM" */
export function formatDateTime(iso: string, lang: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(intlLocale(lang), {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "31 января" / "January 31" */
export function formatDateShort(iso: string, lang: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(intlLocale(lang), {
    day: "numeric",
    month: "long",
  });
}

/** "10 минут назад" / "10 minutes ago" — relative to a fixed demo "now" so screenshots stay stable. */
export function formatRelativeTime(iso: string, lang: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const rtf = new Intl.RelativeTimeFormat(pickLocale(lang), { numeric: "auto" });
  const diffMs = d.getTime() - DEMO_NOW.getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}
