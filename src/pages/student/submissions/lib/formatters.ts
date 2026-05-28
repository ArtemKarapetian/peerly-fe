type TFn = (k: string) => string;

export function formatFileSize(bytes: number, t: TFn): string {
  if (bytes < 1024) return `${bytes} ${t("entity.work.bytes")}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${t("entity.work.kb")}`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ${t("entity.work.mb")}`;
}

export function hasNonEmptyComment(raw: string | null | undefined): boolean {
  const trimmed = (raw ?? "").trim();
  return trimmed.length > 0 && trimmed !== "—";
}
