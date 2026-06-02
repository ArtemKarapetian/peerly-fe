import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatDateTimeLong } from "@/shared/lib/formatDate";
import { Card } from "@/shared/ui";

interface DeadlinesCardProps {
  dueDate: Date;
  reviewDeadline?: Date;
  locale: string;
}

export function DeadlinesCard({ dueDate, reviewDeadline, locale }: DeadlinesCardProps) {
  const { t } = useTranslation();
  return (
    <Card variant="section" className="mt-6 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-brand-primary" />
        <h2 className="text-xl font-medium text-foreground tracking-[-0.5px]">
          {t("teacher.assignmentDetail.deadlines")}
        </h2>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <DeadlineField
          label={t("teacher.assignmentDetail.submissionDeadline")}
          value={formatDateTimeLong(dueDate.toISOString(), locale)}
        />
        {reviewDeadline && (
          <DeadlineField
            label={t("teacher.assignmentDetail.reviewDeadline")}
            value={formatDateTimeLong(reviewDeadline.toISOString(), locale)}
          />
        )}
      </div>
    </Card>
  );
}

function DeadlineField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-13 text-muted-foreground mb-2">{label}</p>
      <p className="text-base text-foreground font-medium">{value}</p>
    </div>
  );
}
