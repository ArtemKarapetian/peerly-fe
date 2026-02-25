// Helper to format extension status
import { ExtensionStatus, ExtensionType } from "@/entities/extension";

export function getExtensionStatusLabel(status: ExtensionStatus): string {
  const labels: Record<ExtensionStatus, string> = {
    manual: "Вручную",
    requested: "Запрошено",
    approved: "Одобрено",
    denied: "Отклонено",
  };
  return labels[status];
}

// Helper to get extension type label
export function getExtensionTypeLabel(type: ExtensionType): string {
  const labels: Record<ExtensionType, string> = {
    submission: "Сдача работы",
    review: "Проверка работ",
    both: "Сдача и проверка",
  };
  return labels[type];
}
