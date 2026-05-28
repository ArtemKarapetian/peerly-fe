import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getScoreColor } from "../lib/scoreColor";

interface ScoreCellProps {
  score: number | null;
  maxScore: number;
  isScoreLocked: boolean;
  withTooltip?: boolean;
}

export function ScoreCell({ score, maxScore, isScoreLocked, withTooltip = false }: ScoreCellProps) {
  const { t } = useTranslation();
  if (isScoreLocked) {
    return (
      <div className="inline-flex items-center gap-2 group/lock relative">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">—</span>
        {withTooltip && (
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover/lock:block w-[240px] bg-foreground text-text-inverse text-13 rounded-sm px-3 py-2 shadow-lg z-10">
            {t("widget.gradeTable.lockedTooltip")}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
          </div>
        )}
      </div>
    );
  }
  if (score === null) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  return (
    <span className={`text-base font-semibold ${getScoreColor(score, maxScore)}`}>{score}</span>
  );
}
