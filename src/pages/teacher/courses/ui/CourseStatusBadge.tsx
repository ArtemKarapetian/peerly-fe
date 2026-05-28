import { useTranslation } from "react-i18next";

import { StatusBadge } from "@/shared/ui";

import type { CourseStatus } from "../model/types";

const VARIANTS: Record<
  CourseStatus,
  { variant: "success" | "warning" | "secondary"; labelKey: string }
> = {
  active: { variant: "success", labelKey: "common.active" },
  draft: { variant: "warning", labelKey: "teacher.courseDetail.status.draft" },
  archived: { variant: "secondary", labelKey: "common.archive" },
};

export function CourseStatusBadge({ status }: { status: CourseStatus }) {
  const { t } = useTranslation();
  const { variant, labelKey } = VARIANTS[status];
  return <StatusBadge variant={variant}>{t(labelKey)}</StatusBadge>;
}
