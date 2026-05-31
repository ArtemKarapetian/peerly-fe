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

export function formatDateTimeLong(iso: string, lang: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(intlLocale(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
