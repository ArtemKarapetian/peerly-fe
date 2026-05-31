import { useTranslation } from "react-i18next";

import { StatusBadge } from "@/shared/ui";

const VARIANTS: Record<string, { variant: "success" | "secondary" | "error"; labelKey: string }> = {
  published: { variant: "success", labelKey: "feature.assignmentPicker.published" },
  draft: { variant: "secondary", labelKey: "feature.assignmentPicker.draft" },
  closed: { variant: "error", labelKey: "feature.assignmentPicker.closed" },
};

export function AssignmentStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const config = VARIANTS[status];
  if (!config) return null;
  return <StatusBadge variant={config.variant}>{t(config.labelKey)}</StatusBadge>;
}
