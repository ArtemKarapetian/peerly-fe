import { useTranslation } from "react-i18next";

interface PublishedStatusBadgeProps {
  isPublished: boolean;
}

export function PublishedStatusBadge({ isPublished }: PublishedStatusBadgeProps) {
  const { t } = useTranslation();
  const tone = isPublished ? "bg-success-light text-success" : "bg-muted text-muted-foreground";
  const dot = isPublished ? "bg-success" : "bg-muted-foreground";
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-13 font-medium ${tone}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {isPublished ? t("teacher.assignmentDetail.published") : t("teacher.assignmentDetail.draft")}
    </span>
  );
}
