import { Calendar, FileText } from "lucide-react";

import { Appeal, getReasonLabel, getStatusColor, getStatusLabel } from "@/entities/appeal";

interface AppealCardProps {
  appeal: Appeal;
  onClick: () => void;
}

export function AppealCard({ appeal, onClick }: AppealCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card border-2 border-border rounded-[12px] p-5 hover:border-accent transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[16px] font-medium text-foreground">{appeal.courseName}</h3>
            <span className="text-[14px] text-muted-foreground">&rarr;</span>
            <span className="text-[14px] text-muted-foreground">{appeal.taskName}</span>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(appeal.createdAt).toLocaleDateString("ru-RU")}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{getReasonLabel(appeal.reason)}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-[8px] text-[12px] font-medium uppercase tracking-wide border ${getStatusColor(appeal.status)}`}
        >
          {getStatusLabel(appeal.status)}
        </span>
      </div>

      {appeal.currentScore !== undefined && (
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span>Текущая оценка:</span>
          <span className="font-medium text-foreground">
            {appeal.currentScore} / {appeal.maxScore}
          </span>
        </div>
      )}
    </div>
  );
}
