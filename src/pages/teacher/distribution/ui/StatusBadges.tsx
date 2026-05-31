import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { StatusBadge } from "@/shared/ui";

import type { OverallStatus, ReviewerStatus } from "../model/types";

const REVIEWER_DOT_COLOR: Record<ReviewerStatus, string> = {
  submitted: "bg-success",
  draft: "bg-warning",
  pending: "bg-muted-foreground",
};

export function ReviewerStatusDot({ status }: { status: ReviewerStatus }) {
  return <span className={`inline-block w-2 h-2 rounded-full ${REVIEWER_DOT_COLOR[status]}`} />;
}

const OVERALL: Record<
  OverallStatus,
  {
    variant: "success" | "warning" | "secondary";
    icon: typeof CheckCircle;
    labelKey: string;
  }
> = {
  completed: {
    variant: "success",
    icon: CheckCircle,
    labelKey: "teacher.distribution.completed",
  },
  "in-progress": {
    variant: "warning",
    icon: Clock,
    labelKey: "teacher.distribution.inProgress",
  },
  "not-started": {
    variant: "secondary",
    icon: AlertCircle,
    labelKey: "teacher.distribution.notStarted",
  },
};

export function OverallStatusBadge({ status }: { status: OverallStatus }) {
  const { t } = useTranslation();
  const { variant, icon, labelKey } = OVERALL[status];
  return (
    <StatusBadge variant={variant} icon={icon}>
      {t(labelKey)}
    </StatusBadge>
  );
}
