import {
  Shield,
  AlertTriangle,
  MessageSquare,
  Trash2,
  GitBranch,
  Eye,
  EyeOff,
  CheckCircle,
  Filter,
  ChevronUp,
} from "lucide-react";
import { JSX, useState } from "react";

import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { assignmentRepo } from "@/entities/assignment";
import { reviewRepo } from "@/entities/review";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherModerationPage - Модерация рецензий
 *
 * Управление помеченными рецензиями:
 * - Очередь помеченных рецензий с разными типами флагов
 * - Предпросмотр рецензий с оценками и комментариями
 * - Действия: снять флаг, запросить переписывание, скрыть, переназначить
 * - Bulk-действия для выбранных рецензий
 */

type FlagType = "toxicity" | "too-short" | "spam" | "collusion";

interface FlaggedReview {
  id: string;
  reviewId: string;
  submissionId: string;
  assignmentTitle: string;
  reviewerName: string;
  revieweeName: string;
  flagType: FlagType;
  flagReason: string;
  flaggedBy: string;
  flaggedAt: Date;
  scores: Record<string, number>;
  comment: string;
  status: "pending" | "dismissed" | "hidden";
}

export default function TeacherModerationPage() {
  const users = userRepo.getAll();
  const assignments = assignmentRepo.getAll();
  const reviews = reviewRepo.getAll();
  const submissions = workRepo.getAll();

  // Generate demo flagged reviews
  const generateFlaggedReviews = (): FlaggedReview[] => {
    const flagTypes: FlagType[] = ["toxicity", "too-short", "spam", "collusion"];
    const flagReasons: Record<FlagType, string[]> = {
      toxicity: [
        "Обнаружены оскорбительные выражения",
        "Неконструктивная критика с личными нападками",
        "Использование недопустимой лексики",
      ],
      "too-short": [
        "Рецензия содержит менее 50 слов",
        "Недостаточно детальная обратная связь",
        "Отсутствует аргументация оценок",
      ],
      spam: [
        "Повторяющийся текст без смысла",
        "Случайный набор символов",
        "Копипаста из другой рецензии",
      ],
      collusion: [
        "Подозрительно высокие оценки без обоснования",
        "Идентичные формулировки в нескольких рецензиях",
        "Паттерн взаимного завышения оценок",
      ],
    };

    return reviews.slice(0, 8).map((review, idx) => {
      const submission = submissions.find((s) => s.id === review.submissionId);
      const assignment = assignments.find((a) => a.id === submission?.assignmentId);
      const reviewer = users.find((u) => u.id === review.reviewerId);
      const reviewee = users.find((u) => u.id === submission?.studentId);
      const flagType = flagTypes[idx % flagTypes.length];

      return {
        id: `flag-${review.id}`,
        reviewId: review.id,
        submissionId: review.submissionId,
        assignmentTitle: assignment?.title || "Unknown Assignment",
        reviewerName: reviewer?.name || "Unknown Reviewer",
        revieweeName: reviewee?.name || "Unknown Student",
        flagType,
        flagReason: flagReasons[flagType][Math.floor(Math.random() * flagReasons[flagType].length)],
        flaggedBy: "Автоматическая система",
        flaggedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        scores: review.scores,
        comment: review.comment,
        status: "pending",
      };
    });
  };

  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>(generateFlaggedReviews());
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FlagType | "all">("all");

  const getFlagTypeLabel = (type: FlagType): string => {
    const labels: Record<FlagType, string> = {
      toxicity: "Токсичность",
      "too-short": "Слишком коротко",
      spam: "Спам",
      collusion: "Подозрение на сговор",
    };
    return labels[type];
  };

  const getFlagTypeBadge = (type: FlagType) => {
    const configs: Record<FlagType, { bg: string; text: string; icon: JSX.Element }> = {
      toxicity: {
        bg: "bg-[#fff5f5]",
        text: "text-[#d4183d]",
        icon: <AlertTriangle className="w-3 h-3" />,
      },
      "too-short": {
        bg: "bg-[#fff4e5]",
        text: "text-[#ff9800]",
        icon: <MessageSquare className="w-3 h-3" />,
      },
      spam: {
        bg: "bg-[#f5f5f5]",
        text: "text-[#767692]",
        icon: <Trash2 className="w-3 h-3" />,
      },
      collusion: {
        bg: "bg-[#fff9e5]",
        text: "text-[#f59e0b]",
        icon: <GitBranch className="w-3 h-3" />,
      },
    };

    const config = configs[type];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 ${config.bg} ${config.text} rounded-[6px] text-[12px] font-medium`}
      >
        {config.icon}
        {getFlagTypeLabel(type)}
      </span>
    );
  };

  const filteredReviews =
    filterType === "all"
      ? flaggedReviews.filter((r) => r.status === "pending")
      : flaggedReviews.filter((r) => r.status === "pending" && r.flagType === filterType);

  const toggleSelectReview = (id: string) => {
    const newSet = new Set(selectedReviews);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedReviews(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedReviews.size === filteredReviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(filteredReviews.map((r) => r.id)));
    }
  };

  const handleDismissFlag = (id: string) => {
    setFlaggedReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "dismissed" as const } : r)),
    );
    setExpandedReview(null);
    alert("Флаг снят");
  };

  const handleRequestRewrite = (id: string) => {
    alert(`Запрос на переписывание отправлен для рецензии ${id}`);
    setExpandedReview(null);
  };

  const handleHideReview = (id: string) => {
    setFlaggedReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "hidden" as const } : r)),
    );
    setExpandedReview(null);
    alert("Рецензия скрыта");
  };

  const handleReassignReview = (id: string) => {
    alert(`Открыть модальное окно переназначения для ${id}`);
  };

  const handleBulkDismiss = () => {
    if (selectedReviews.size === 0) return;

    setFlaggedReviews((prev) =>
      prev.map((r) => (selectedReviews.has(r.id) ? { ...r, status: "dismissed" as const } : r)),
    );
    setSelectedReviews(new Set());
    alert(`Снято флагов: ${selectedReviews.size}`);
  };

  const toggleExpandReview = (id: string) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  return (
    <AppShell title="Модерация рецензий">
      <Breadcrumbs
        items={[
          { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
          { label: "Модерация" },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Модерация рецензий
          </h1>
          <p className="text-[16px] text-[#767692]">
            Проверка помеченных рецензий и контроль качества
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#d4183d]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">
                Токсичность
              </span>
            </div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {
                flaggedReviews.filter((r) => r.flagType === "toxicity" && r.status === "pending")
                  .length
              }
            </p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-[#ff9800]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Коротко</span>
            </div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {
                flaggedReviews.filter((r) => r.flagType === "too-short" && r.status === "pending")
                  .length
              }
            </p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-[#767692]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Спам</span>
            </div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {flaggedReviews.filter((r) => r.flagType === "spam" && r.status === "pending").length}
            </p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Сговор</span>
            </div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {
                flaggedReviews.filter((r) => r.flagType === "collusion" && r.status === "pending")
                  .length
              }
            </p>
          </div>
        </div>

        {/* Filter and Bulk Actions Bar */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-[#767692]" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FlagType | "all")}
                className="px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                <option value="all">
                  Все типы ({flaggedReviews.filter((r) => r.status === "pending").length})
                </option>
                <option value="toxicity">
                  Токсичность (
                  {
                    flaggedReviews.filter(
                      (r) => r.flagType === "toxicity" && r.status === "pending",
                    ).length
                  }
                  )
                </option>
                <option value="too-short">
                  Слишком коротко (
                  {
                    flaggedReviews.filter(
                      (r) => r.flagType === "too-short" && r.status === "pending",
                    ).length
                  }
                  )
                </option>
                <option value="spam">
                  Спам (
                  {
                    flaggedReviews.filter((r) => r.flagType === "spam" && r.status === "pending")
                      .length
                  }
                  )
                </option>
                <option value="collusion">
                  Подозрение на сговор (
                  {
                    flaggedReviews.filter(
                      (r) => r.flagType === "collusion" && r.status === "pending",
                    ).length
                  }
                  )
                </option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedReviews.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[#767692]">
                  Выбрано: <strong className="text-[#21214f]">{selectedReviews.size}</strong>
                </span>
                <button
                  onClick={handleBulkDismiss}
                  className="flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px]"
                >
                  <CheckCircle className="w-4 h-4" />
                  Снять все флаги
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Flagged Reviews Queue */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
          {filteredReviews.length > 0 ? (
            <>
              {/* Select All Header */}
              <div className="border-b-2 border-[#e6e8ee] px-6 py-3 bg-[#f9f9f9]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedReviews.size === filteredReviews.length && filteredReviews.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-2 border-[#e6e8ee] text-[#5b8def] focus:ring-2 focus:ring-[#5b8def] focus:ring-offset-0"
                  />
                  <span className="text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Выбрать все ({filteredReviews.length})
                  </span>
                </label>
              </div>

              {/* Reviews List */}
              <div className="divide-y divide-[#e6e8ee]">
                {filteredReviews.map((flaggedReview) => (
                  <div key={flaggedReview.id} className="hover:bg-[#fafbfc] transition-colors">
                    {/* Review Row */}
                    <div className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={selectedReviews.has(flaggedReview.id)}
                            onChange={() => toggleSelectReview(flaggedReview.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded border-2 border-[#e6e8ee] text-[#5b8def] focus:ring-2 focus:ring-[#5b8def] focus:ring-offset-0"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getFlagTypeBadge(flaggedReview.flagType)}
                                <span className="text-[13px] text-[#767692]">
                                  {flaggedReview.flaggedAt.toLocaleDateString("ru-RU")}
                                </span>
                              </div>
                              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                                {flaggedReview.assignmentTitle}
                              </h3>
                              <p className="text-[14px] text-[#767692]">
                                Рецензент:{" "}
                                <strong className="text-[#21214f]">
                                  {flaggedReview.reviewerName}
                                </strong>{" "}
                                → Рецензируемый:{" "}
                                <strong className="text-[#21214f]">
                                  {flaggedReview.revieweeName}
                                </strong>
                              </p>
                            </div>

                            {/* Expand Button */}
                            <button
                              onClick={() => toggleExpandReview(flaggedReview.id)}
                              className="flex items-center gap-2 px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] hover:bg-[#e9f5ff] hover:border-[#5b8def] transition-colors text-[14px] text-[#21214f] shrink-0"
                            >
                              {expandedReview === flaggedReview.id ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Свернуть
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  Просмотр
                                </>
                              )}
                            </button>
                          </div>

                          {/* Flag Reason */}
                          <div className="flex items-start gap-2 p-3 bg-[#fff9e5] border border-[#f59e0b] rounded-[8px]">
                            <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-[13px] font-medium text-[#21214f] mb-1">
                                Причина флага:
                              </p>
                              <p className="text-[13px] text-[#767692]">
                                {flaggedReview.flagReason}
                              </p>
                              <p className="text-[12px] text-[#767692] mt-1">
                                Отмечено: {flaggedReview.flaggedBy}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Review Preview */}
                      {expandedReview === flaggedReview.id && (
                        <div className="mt-4 pt-4 border-t-2 border-[#e6e8ee] ml-8">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Scores */}
                            <div>
                              <h4 className="text-[14px] font-medium text-[#21214f] mb-3 uppercase tracking-wide">
                                Оценки по критериям
                              </h4>
                              <div className="space-y-2">
                                {Object.entries(flaggedReview.scores).map(([criterion, score]) => (
                                  <div
                                    key={criterion}
                                    className="flex items-center justify-between p-2 bg-[#f9f9f9] rounded-[8px]"
                                  >
                                    <span className="text-[13px] text-[#767692]">{criterion}</span>
                                    <span className="text-[15px] font-medium text-[#21214f]">
                                      {score}/5
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Comment */}
                            <div>
                              <h4 className="text-[14px] font-medium text-[#21214f] mb-3 uppercase tracking-wide">
                                Комментарий
                              </h4>
                              <div className="p-4 bg-[#f9f9f9] rounded-[12px] border-2 border-[#e6e8ee]">
                                <p className="text-[14px] text-[#21214f] leading-relaxed">
                                  {flaggedReview.comment}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              onClick={() => handleDismissFlag(flaggedReview.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#4caf50] text-white rounded-[12px] hover:bg-[#45a049] transition-colors text-[14px]"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Снять флаг
                            </button>
                            <button
                              onClick={() => handleRequestRewrite(flaggedReview.id)}
                              className="flex items-center gap-2 px-4 py-2 border-2 border-[#5b8def] text-[#5b8def] rounded-[12px] hover:bg-[#e9f5ff] transition-colors text-[14px]"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Запросить переписывание
                            </button>
                            <button
                              onClick={() => handleHideReview(flaggedReview.id)}
                              className="flex items-center gap-2 px-4 py-2 border-2 border-[#ff9800] text-[#ff9800] rounded-[12px] hover:bg-[#fff4e5] transition-colors text-[14px]"
                            >
                              <EyeOff className="w-4 h-4" />
                              Скрыть рецензию
                            </button>
                            <button
                              onClick={() => handleReassignReview(flaggedReview.id)}
                              className="flex items-center gap-2 px-4 py-2 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[14px]"
                            >
                              <GitBranch className="w-4 h-4" />
                              Переназначить рецензию
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-[#21214f] mb-2">
                Нет помеченных рецензий
              </h3>
              <p className="text-[14px] text-[#767692]">
                {filterType === "all"
                  ? "Все рецензии в порядке!"
                  : `Нет рецензий с типом "${getFlagTypeLabel(filterType)}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
