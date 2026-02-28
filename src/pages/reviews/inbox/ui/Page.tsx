import { useState, useCallback } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { LayoutDebugger } from "@/shared/ui/LayoutDebugger";
import { Clock, ChevronRight } from "lucide-react";
import { useReviewStore } from "@/entities/review/api/reviewRepo.mock.ts";

/**
 * ReviewsInboxPage - Reviews Inbox (список всех назначенных рецензий)
 *
 * Route: /reviews
 *
 * Features:
 * - List of all assigned reviews
 * - Each card: course, assignment, student, due date, status
 * - Filters: All / Not started / Drafts / Submitted
 * - Click card → open review details
 */

export type ReviewFilter = "all" | "not_started" | "drafts" | "submitted";

export default function ReviewsInboxPage() {
  const { reviews } = useReviewStore();
  const [filter, setFilter] = useState<ReviewFilter>("all");

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "not_started") return review.status === "not_started";
    if (filter === "drafts") return review.status === "draft";
    if (filter === "submitted") return review.status === "submitted";
    return true;
  });

  // Handle review click - wrapped to avoid direct mutation warning
  const handleReviewClick = (reviewId: string) => {
    // Using setTimeout to move the mutation out of render
    setTimeout(() => {
      window.location.hash = `/reviews/${reviewId}`;
    }, 0);
  };

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "not_started":
        return {
          label: "Не начато",
          color: "bg-[#e4e4e4]",
          textColor: "text-[#4b4963]",
        };
      case "draft":
        return {
          label: "Черновик",
          color: "bg-[#ffd4a3]",
          textColor: "text-[#21214f]",
        };
      case "submitted":
        return {
          label: "Отправлено",
          color: "bg-[#9cf38d]",
          textColor: "text-[#21214f]",
        };
      default:
        return {
          label: "Не начато",
          color: "bg-[#e4e4e4]",
          textColor: "text-[#4b4963]",
        };
    }
  };

  // Timestamp for deadline checks - using state to avoid impure function during render
  const [now] = useState(() => Date.now());

  // Check if deadline is soon (within 2 days)
  const isDeadlineSoon = useCallback(
    (deadlineTimestamp: number) => {
      const twoDays = 2 * 24 * 60 * 60 * 1000;
      return deadlineTimestamp - now < twoDays && deadlineTimestamp > now;
    },
    [now],
  );

  // Empty state
  const isEmpty = filteredReviews.length === 0;

  return (
    <AppShell title="Рецензии">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">Рецензии</h1>
        <p className="text-[16px] text-[#767692] leading-[1.5]">
          Назначенные вам работы для рецензирования
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
            filter === "all"
              ? "bg-[#5b8def] text-white"
              : "bg-[#f9f9f9] text-[#4b4963] hover:bg-[#e6e8ee]"
          }`}
        >
          Все ({reviews.length})
        </button>
        <button
          onClick={() => setFilter("not_started")}
          className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
            filter === "not_started"
              ? "bg-[#5b8def] text-white"
              : "bg-[#f9f9f9] text-[#4b4963] hover:bg-[#e6e8ee]"
          }`}
        >
          Не начато ({reviews.filter((r) => r.status === "not_started").length})
        </button>
        <button
          onClick={() => setFilter("drafts")}
          className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
            filter === "drafts"
              ? "bg-[#5b8def] text-white"
              : "bg-[#f9f9f9] text-[#4b4963] hover:bg-[#e6e8ee]"
          }`}
        >
          Черновики ({reviews.filter((r) => r.status === "draft").length})
        </button>
        <button
          onClick={() => setFilter("submitted")}
          className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
            filter === "submitted"
              ? "bg-[#5b8def] text-white"
              : "bg-[#f9f9f9] text-[#4b4963] hover:bg-[#e6e8ee]"
          }`}
        >
          Отправлено ({reviews.filter((r) => r.status === "submitted").length})
        </button>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-[#f9f9f9] rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#d2e1f8] rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">📝</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              {filter === "all" && "Нет назначенных рецензий"}
              {filter === "not_started" && "Нет рецензий для начала"}
              {filter === "drafts" && "Нет черновиков"}
              {filter === "submitted" && "Нет отправленных рецензий"}
            </h2>
            <p className="text-[16px] text-[#767692] leading-[1.5]">
              {filter === "all" && "Когда вам назначат рецензии, они появятся здесь."}
              {filter === "not_started" && "Все ваши рецензии уже начаты или завершены."}
              {filter === "drafts" && "У вас нет черновиков рецензий."}
              {filter === "submitted" && "Вы еще не отправили ни одной рецензии."}
            </p>
          </div>
        </div>
      )}

      {/* Review Cards Grid */}
      {!isEmpty && (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {filteredReviews.map((review) => {
            const statusInfo = getStatusInfo(review.status);
            const deadlineSoon = isDeadlineSoon(review.reviewDeadlineTimestamp);

            return (
              <div
                key={review.id}
                onClick={() => handleReviewClick(review.id)}
                className="bg-white border-2 border-[#e6e8ee] hover:border-[#d2def8] rounded-[16px] p-4 transition-all cursor-pointer group"
              >
                {/* Header: Course + Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#767692] mb-1">{review.courseName}</p>
                    <h3 className="text-[16px] desktop:text-[18px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
                      {review.taskTitle}
                    </h3>
                  </div>

                  <div
                    className={`${statusInfo.color} ${statusInfo.textColor} px-3 py-1.5 rounded-[8px] shrink-0`}
                  >
                    <span className="text-[12px] font-medium whitespace-nowrap">
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Student */}
                <div className="mb-3">
                  <p className="text-[14px] text-[#4b4963]">
                    Студент: <span className="font-medium">{review.studentName}</span>
                  </p>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock
                    className={`w-4 h-4 ${deadlineSoon ? "text-[#ff9800]" : "text-[#767692]"}`}
                  />
                  <p
                    className={`text-[13px] ${deadlineSoon ? "text-[#ff9800] font-medium" : "text-[#767692]"}`}
                  >
                    Дедлайн: {review.reviewDeadline}
                  </p>
                </div>

                {/* CTA Arrow */}
                <div className="flex items-center justify-end">
                  <div className="inline-flex items-center gap-1 text-[13px] text-[#5b8def] group-hover:text-[#3d6bc6] transition-colors">
                    <span>
                      {review.status === "not_started" && "Начать рецензию"}
                      {review.status === "draft" && "Продолжить"}
                      {review.status === "submitted" && "Посмотреть"}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <LayoutDebugger />
    </AppShell>
  );
}
