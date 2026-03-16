import { BookOpen, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface GradeEntry {
  id: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskTitle: string;
  status: string;
  score: number | null;
  maxScore: number;
  isScoreLocked: boolean;
  updatedAt: string;
}

interface GradeTableProps {
  grades: GradeEntry[];
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  onRowClick: (grade: GradeEntry) => void;
}

function getScoreColor(score: number, max: number) {
  const percentage = (score / max) * 100;
  if (percentage >= 90) return "text-[#2e7d32]";
  if (percentage >= 75) return "text-[#558b2f]";
  if (percentage >= 60) return "text-[#f57c00]";
  return "text-[#c62828]";
}

export function GradeTable({ grades, statusLabels, statusColors, onRowClick }: GradeTableProps) {
  const { t } = useTranslation();

  if (grades.length === 0) {
    return (
      <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f9f9f9] rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-[#767692]" />
          </div>
          <h3 className="text-[18px] font-medium text-[#21214f] mb-2">
            {t("widget.gradeTable.noGrades")}
          </h3>
          <p className="text-[14px] text-[#767692]">{t("widget.gradeTable.noGradesHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden tablet:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9f9f9] border-b-2 border-[#e6e8ee]">
              <th className="text-left px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                {t("widget.gradeTable.course")}
              </th>
              <th className="text-left px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                {t("widget.gradeTable.assignment")}
              </th>
              <th className="text-left px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                {t("widget.gradeTable.status")}
              </th>
              <th className="text-right px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                {t("widget.gradeTable.grade")}
              </th>
              <th className="text-right px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                {t("widget.gradeTable.max")}
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr
                key={grade.id}
                onClick={() => onRowClick(grade)}
                className="border-b border-[#e6e8ee] hover:bg-[#fafbfc] cursor-pointer transition-colors group"
              >
                <td className="px-4 desktop:px-6 py-4">
                  <div className="text-[14px] text-[#21214f] font-medium group-hover:text-[#3d6bc6] transition-colors">
                    {grade.courseName}
                  </div>
                </td>
                <td className="px-4 desktop:px-6 py-4">
                  <div className="text-[14px] text-[#21214f]">{grade.taskTitle}</div>
                </td>
                <td className="px-4 desktop:px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-[6px] text-[13px] font-medium ${
                      statusColors[grade.status]
                    }`}
                  >
                    {statusLabels[grade.status]}
                  </span>
                </td>
                <td className="px-4 desktop:px-6 py-4 text-right">
                  {grade.isScoreLocked ? (
                    <div className="inline-flex items-center gap-2 group/lock relative">
                      <Lock className="w-4 h-4 text-[#767692]" />
                      <span className="text-[14px] text-[#767692]">—</span>
                      <div className="absolute right-0 bottom-full mb-2 hidden group-hover/lock:block w-[240px] bg-[#21214f] text-white text-[13px] rounded-[8px] px-3 py-2 shadow-lg z-10">
                        {t("widget.gradeTable.lockedTooltip")}
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#21214f]"></div>
                      </div>
                    </div>
                  ) : grade.score !== null ? (
                    <span
                      className={`text-[16px] font-semibold ${getScoreColor(grade.score, grade.maxScore)}`}
                    >
                      {grade.score}
                    </span>
                  ) : (
                    <span className="text-[14px] text-[#767692]">—</span>
                  )}
                </td>
                <td className="px-4 desktop:px-6 py-4 text-right">
                  <span className="text-[14px] text-[#767692]">{grade.maxScore}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="tablet:hidden divide-y-2 divide-[#e6e8ee]">
        {grades.map((grade) => (
          <div
            key={grade.id}
            onClick={() => onRowClick(grade)}
            className="p-3 hover:bg-[#fafbfc] cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-[13px] text-[#767692] mb-1">{grade.courseName}</div>
                <div className="text-[15px] text-[#21214f] font-medium">{grade.taskTitle}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  {grade.isScoreLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#767692]" />
                      <span className="text-[14px] text-[#767692]">—</span>
                    </>
                  ) : grade.score !== null ? (
                    <span
                      className={`text-[16px] font-semibold ${getScoreColor(grade.score, grade.maxScore)}`}
                    >
                      {grade.score} / {grade.maxScore}
                    </span>
                  ) : (
                    <span className="text-[14px] text-[#767692]">— / {grade.maxScore}</span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium ${
                    statusColors[grade.status]
                  }`}
                >
                  {statusLabels[grade.status]}
                </span>
              </div>
            </div>

            {grade.isScoreLocked && (
              <div className="mt-2 flex items-start gap-2 text-[12px] text-[#767692] bg-[#f9f9f9] rounded-[8px] p-2.5">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{t("widget.gradeTable.lockedTooltip")}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
