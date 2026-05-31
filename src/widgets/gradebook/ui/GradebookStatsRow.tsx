import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GradebookStatsRowProps {
  avgPercentage: string;
  published: number;
  total: number;
}

export function GradebookStatsRow({ avgPercentage, published, total }: GradebookStatsRowProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-6 bg-muted rounded-lg px-6 py-4 mb-4">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-brand-primary" />
        <Metric label={t("student.gradebook.avgScore")} value={`${avgPercentage}%`} />
      </div>
      <div className="w-px h-12 bg-border" />
      <Metric label={t("student.gradebook.gradesReceived")} value={`${published} / ${total}`} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-13 text-muted-foreground mb-1">{label}</div>
      <div className="text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}
