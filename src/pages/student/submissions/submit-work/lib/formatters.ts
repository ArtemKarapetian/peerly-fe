type TFn = (k: string) => string;

export function formatFileSize(bytes: number, t: TFn): string {
  if (bytes < 1024) return `${bytes} ${t("entity.work.bytes")}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${t("entity.work.kb")}`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ${t("entity.work.mb")}`;
}

export function formatDeadline(d: Date | undefined, locale: string): string {
  if (!d) return "—";
  return d.toLocaleString(locale, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function commentForBe(text: string): string | null {
  return text.trim() === "" ? null : text;
}

export function normalizeSavedComment(raw: string | null | undefined): string {
  const trimmed = (raw ?? "").trim();
  return trimmed === "" || trimmed === "—" ? "" : (raw ?? "");
}
