export function formatPublishDate(date: Date | null, notSpecifiedLabel: string): string {
  if (!date) return notSpecifiedLabel;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
