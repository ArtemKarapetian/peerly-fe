import { useState, useMemo } from "react";
import { Clock, FileText, EyeOff, ChevronRight } from "lucide-react";

/**
 * ReviewCard - Карточка назначенной на рецензию работы
 *
 * Displays:
 * - Task title and course name
 * - Review deadline
 * - Review status (not started / draft / submitted)
 * - Anonymity indicator
 * - CTA button based on status
 */

export type ReviewStatus = "not_started" | "draft" | "submitted";

export interface ReviewAssignment {
  id: string;
  taskTitle: string;
  courseName: string;
  courseId: string;
  taskId: string;
  reviewDeadline: string; // e.g., "31 января 2026, 23:59"
  reviewDeadlineTimestamp: number; // For sorting/filtering
  status: ReviewStatus;
  isAnonymous: boolean; // Author is hidden
  workSubmittedAt?: string; // When the work was submitted
}

interface ReviewCardProps {
  review: ReviewAssignment;
  onClick: () => void;
}

export function ReviewCard({ review, onClick }: ReviewCardProps) {
  const getStatusInfo = () => {
    switch (review.status) {
      case "not_started":
        return {
          label: "Не начато",
          color: "bg-[#e4e4e4]",
          textColor: "text-[#4b4963]",
          ctaLabel: "Начать",
          ctaBg: "bg-[#3d6bc6] hover:bg-[#2d5bb6] text-white",
        };
      case "draft":
        return {
          label: "Черновик",
          color: "bg-[#ffd4a3]",
          textColor: "text-[#21214f]",
          ctaLabel: "Продолжить",
          ctaBg: "bg-[#3d6bc6] hover:bg-[#2d5bb6] text-white",
        };
      case "submitted":
        return {
          label: "Отправлено",
          color: "bg-[#9cf38d]",
          textColor: "text-[#21214f]",
          ctaLabel: "Открыть",
          ctaBg: "bg-[#d2def8] hover:bg-[#c5d5f5] text-[#21214f]",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Timestamp captured at mount
  const [now] = useState(() => Date.now());

  // Check if deadline is soon (within 2 days)
  const deadlineSoon = useMemo(() => {
    const twoDays = 2 * 24 * 60 * 60 * 1000;
    return review.reviewDeadlineTimestamp - now < twoDays && review.reviewDeadlineTimestamp > now;
  }, [review.reviewDeadlineTimestamp, now]);

  return (
    <div className="bg-white border-2 border-[#e6e8ee] hover:border-[#d2def8] rounded-[16px] p-4 desktop:p-5 transition-all group">
      {/* Header: Task Title + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] desktop:text-[20px] font-medium text-[#21214f] tracking-[-0.5px] mb-1 truncate">
            {review.taskTitle}
          </h3>
          <p className="text-[14px] text-[#767692]">{review.courseName}</p>
        </div>

        <div
          className={`${statusInfo.color} ${statusInfo.textColor} px-3 py-1.5 rounded-[8px] shrink-0`}
        >
          <span className="text-[13px] font-medium whitespace-nowrap">{statusInfo.label}</span>
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className={`w-4 h-4 ${deadlineSoon ? "text-[#ff9800]" : "text-[#767692]"}`} />
        <p
          className={`text-[13px] desktop:text-[14px] ${deadlineSoon ? "text-[#ff9800] font-medium" : "text-[#4b4963]"}`}
        >
          Дедлайн рецензии: {review.reviewDeadline}
        </p>
      </div>

      {/* Anonymity Note */}
      {review.isAnonymous && (
        <div className="bg-[#f9f9f9] rounded-[8px] px-3 py-2 mb-4 flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-[#767692] shrink-0" />
          <p className="text-[13px] text-[#4b4963]">Автор работы скрыт (анонимная проверка)</p>
        </div>
      )}

      {/* Work Submitted Info */}
      {review.workSubmittedAt && (
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-[#767692]" />
          <p className="text-[13px] text-[#767692]">Работа сдана: {review.workSubmittedAt}</p>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={onClick}
        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 desktop:py-3 rounded-[12px] text-[14px] desktop:text-[15px] font-medium transition-all ${statusInfo.ctaBg}`}
      >
        <span>{statusInfo.ctaLabel}</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
