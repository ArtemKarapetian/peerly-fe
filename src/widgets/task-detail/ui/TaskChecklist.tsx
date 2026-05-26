import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TaskChecklistProps {
  checklist: string;
}

export function TaskChecklist({ checklist }: TaskChecklistProps) {
  const { t } = useTranslation();
  const items = checklist
    .split("\n")
    .map((line) => line.replace(/^[\s•\-*\d.)]+/, "").trim())
    .filter((line) => line.length > 0);

  if (items.length === 0) return null;

  return (
    <div className="bg-card border border-border shadow-sm rounded-lg p-4 desktop:p-6">
      <h2 className="text-xl desktop:text-2xl tracking-[-0.5px] text-foreground mb-4">
        {t("student.task.checklist")}
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <div className="size-5 rounded-full bg-brand-primary-light flex items-center justify-center">
                <Check className="size-3.5 text-foreground" />
              </div>
            </div>
            <p className="text-sm desktop:text-base tracking-[-0.3px] text-muted-foreground leading-[1.5]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
