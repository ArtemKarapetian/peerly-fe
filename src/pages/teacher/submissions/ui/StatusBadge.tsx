import { CheckCircle, Clock, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { StatusBadge as UIStatusBadge } from "@/shared/ui";

import type { RowStatus } from "../model/types";

interface StatusBadgeProps {
  status: RowStatus;
}

const VARIANTS: Record<
  RowStatus,
  {
    variant: "success" | "warning" | "secondary";
    icon: typeof CheckCircle;
    labelKey: string;
  }
> = {
  submitted: {
    variant: "success",
    icon: CheckCircle,
    labelKey: "teacher.submissions.submitted",
  },
  late: {
    variant: "warning",
    icon: Clock,
    labelKey: "teacher.submissions.late",
  },
  draft: {
    variant: "secondary",
    icon: FileText,
    labelKey: "teacher.submissions.draft",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  const { variant, icon, labelKey } = VARIANTS[status];
  return (
    <UIStatusBadge variant={variant} icon={icon}>
      {t(labelKey)}
    </UIStatusBadge>
  );
}
