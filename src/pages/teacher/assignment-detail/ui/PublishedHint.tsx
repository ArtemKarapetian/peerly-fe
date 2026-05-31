import { useTranslation } from "react-i18next";

interface PublishedHintProps {
  courseName: string;
}

export function PublishedHint({ courseName }: PublishedHintProps) {
  const { t } = useTranslation();
  return (
    <div className="mt-6 bg-success-light border border-success rounded-lg p-4">
      <p className="text-sm text-foreground">
        {t("teacher.assignmentDetail.publishedSuccess")}{" "}
        {t("teacher.assignmentDetail.publishedSuccessDesc", { courseName })}
      </p>
    </div>
  );
}
