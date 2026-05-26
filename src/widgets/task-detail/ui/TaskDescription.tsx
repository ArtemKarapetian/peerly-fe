import { useTranslation } from "react-i18next";

interface TaskDescriptionProps {
  description: string;
}

export function TaskDescription({ description }: TaskDescriptionProps) {
  const { t } = useTranslation();
  const isEmpty = description.trim().length === 0;

  return (
    <div className="bg-card border border-border shadow-sm rounded-lg p-4 desktop:p-6">
      <h2 className="text-xl desktop:text-2xl tracking-[-0.5px] text-foreground mb-4">
        {t("student.task.description")}
      </h2>
      <p
        className={`text-sm desktop:text-base tracking-[-0.3px] leading-[1.6] whitespace-pre-wrap ${
          isEmpty ? "text-text-tertiary italic" : "text-muted-foreground"
        }`}
      >
        {isEmpty ? t("student.task.noDescription") : description}
      </p>
    </div>
  );
}
