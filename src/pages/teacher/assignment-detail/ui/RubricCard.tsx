import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RubricCardProps {
  checklist: string;
}

export function RubricCard({ checklist }: RubricCardProps) {
  const { t } = useTranslation();
  return (
    <div className="mt-6 bg-card border border-border shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-brand-primary" />
        <h2 className="text-xl font-medium text-foreground tracking-[-0.5px]">
          {t("teacher.assignmentDetail.rubric")}
        </h2>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
        {checklist}
      </pre>
    </div>
  );
}
