import { useTranslation } from "react-i18next";

interface AssignmentMetricRowProps {
  submittedCount: number;
  reviewCount: number;
  reviewsTotal: number;
}

export function AssignmentMetricRow({
  submittedCount,
  reviewCount,
  reviewsTotal,
}: AssignmentMetricRowProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 tablet:grid-cols-3 gap-4 pt-4 border-t border-border">
      <Metric
        label={t("teacher.assignmentDetail.submissionsCount")}
        value={submittedCount}
        valueClassName="text-brand-primary"
      />
      <Metric label={t("teacher.assignmentDetail.reviewsPerSubmission")} value={reviewCount} />
      <Metric label={t("teacher.assignmentDetail.totalReviews")} value={reviewsTotal} />
    </div>
  );
}

function Metric({
  label,
  value,
  valueClassName = "text-foreground",
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-13 text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-medium ${valueClassName}`}>{value}</p>
    </div>
  );
}
