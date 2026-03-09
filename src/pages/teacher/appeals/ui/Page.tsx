import {
  AlertCircle,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Edit3,
  MessageSquare,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { useState } from "react";

import { CRUMBS } from "@/shared/config/breadcrumbs.ts";
import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { reviewRepo } from "@/entities/review";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherAppealsPage - Апелляции (инбокс)
 *
 * Список апелляций с:
 * - Статус (new/in review/resolved)
 * - Детальный просмотр: сообщение студента + задание + действия преподавателя
 * - Действия: одобрить/отклонить/скорректировать оценку (demo)
 */

type AppealStatus = "new" | "in_review" | "resolved";

interface Appeal {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  submissionId: string;
  reviewId: string;
  status: AppealStatus;
  createdAt: Date;
  message: string;
  originalScore: number;
  requestedScore?: number;
  teacherResponse?: string;
  resolvedAt?: Date;
  resolution?: "approved" | "denied" | "adjusted";
  newScore?: number;
}

export default function TeacherAppealsPage() {
  const { data, isLoading, error, refetch } = useAsync(async () => {
    const [users, assignments, submissions, reviews] = await Promise.all([
      userRepo.getAll(),
      assignmentRepo.getAll(),
      workRepo.getAll(),
      reviewRepo.getAll(),
    ]);
    return { users, assignments, submissions, reviews };
  }, []);

  if (isLoading)
    return (
      <AppShell title="Апелляции">
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title="Апелляции">
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  return <AppealsContent data={data!} />;
}

function AppealsContent({
  data,
}: {
  data: {
    users: Awaited<ReturnType<typeof userRepo.getAll>>;
    assignments: Awaited<ReturnType<typeof assignmentRepo.getAll>>;
    submissions: Awaited<ReturnType<typeof workRepo.getAll>>;
    reviews: Awaited<ReturnType<typeof reviewRepo.getAll>>;
  };
}) {
  const { users, assignments, submissions, reviews } = data;

  // Generate demo appeals
  const generateAppeals = (): Appeal[] => {
    const appeals: Appeal[] = [];
    const appealMessages = [
      "Я считаю, что оценка занижена. Работа полностью соответствует всем критериям рубрики, но рецензент поставил низкие баллы без должного обоснования.",
      "Рецензент указал на ошибки, которых нет в моей работе. Прошу пересмотреть оценку.",
      "Комментарии рецензента не соответствуют содержанию моей работы. Возможно, он перепутал с другой работой.",
      "Оценка кажется несправедливой. Я выполнил все требования задания, но получил низкий балл.",
      "Рецензент не оценил важные части моей работы. Прошу обратить внимание на раздел с дополнительными функциями.",
    ];

    reviews.slice(0, 8).forEach((review, idx) => {
      const submission = submissions.find((s) => s.id === review.submissionId);
      if (!submission) return;

      const student = users.find((u) => u.id === submission.studentId);
      const assignment = assignments.find((a) => a.id === submission.assignmentId);

      const avgScore =
        Object.values(review.scores).reduce((sum, s) => sum + s, 0) /
        Object.values(review.scores).length;

      const statuses: AppealStatus[] = ["new", "in_review", "resolved"];
      const status = statuses[idx % 3];

      const createdAt = new Date(Date.now() - (10 - idx) * 24 * 60 * 60 * 1000);

      const appeal: Appeal = {
        id: `appeal-${idx + 1}`,
        studentId: submission.studentId,
        studentName: student?.name || "Unknown Student",
        assignmentId: submission.assignmentId,
        assignmentTitle: assignment?.title || "Unknown Assignment",
        submissionId: submission.id,
        reviewId: review.id,
        status,
        createdAt,
        message: appealMessages[idx % appealMessages.length],
        originalScore: avgScore,
        requestedScore: idx % 3 === 0 ? avgScore + 1 : undefined,
      };

      if (status === "resolved") {
        const resolutions: ("approved" | "denied" | "adjusted")[] = [
          "approved",
          "denied",
          "adjusted",
        ];
        appeal.resolution = resolutions[idx % 3];
        appeal.resolvedAt = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);

        if (appeal.resolution === "approved") {
          appeal.newScore = appeal.requestedScore || appeal.originalScore + 0.5;
          appeal.teacherResponse =
            "Апелляция одобрена. Оценка пересмотрена в соответствии с критериями.";
        } else if (appeal.resolution === "adjusted") {
          appeal.newScore = appeal.originalScore + 0.3;
          appeal.teacherResponse = "Оценка скорректирована с учетом дополнительных критериев.";
        } else {
          appeal.teacherResponse =
            "После рассмотрения апелляции решено сохранить исходную оценку. Рецензент корректно применил критерии рубрики.";
        }
      }

      appeals.push(appeal);
    });

    return appeals.sort((a, b) => {
      // Sort: new first, then in_review, then resolved
      const statusOrder = { new: 0, in_review: 1, resolved: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  const [appeals, setAppeals] = useState<Appeal[]>(() => generateAppeals());
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppealStatus | "all">("all");

  // For teacher response
  const [responseText, setResponseText] = useState("");
  const [adjustedScore, setAdjustedScore] = useState<number | null>(null);

  const filteredAppeals = appeals.filter((appeal) => {
    if (filterStatus !== "all" && appeal.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: AppealStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e9f5ff] text-[#5b8def] rounded-[6px] text-[12px] font-medium">
            <AlertCircle className="w-3 h-3" />
            Новая
          </span>
        );
      case "in_review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[12px] font-medium">
            <Edit3 className="w-3 h-3" />
            На рассмотрении
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[12px] font-medium">
            <CheckCircle className="w-3 h-3" />
            Решена
          </span>
        );
    }
  };

  const getResolutionBadge = (resolution?: "approved" | "denied" | "adjusted") => {
    if (!resolution) return null;

    switch (resolution) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
            <CheckCircle className="w-3 h-3" />
            Одобрено
          </span>
        );
      case "denied":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[6px] text-[11px] font-medium">
            <XCircle className="w-3 h-3" />
            Отклонено
          </span>
        );
      case "adjusted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[11px] font-medium">
            <Edit3 className="w-3 h-3" />
            Скорректировано
          </span>
        );
    }
  };

  const handleApprove = () => {
    if (!selectedAppeal) return;

    const newScore = selectedAppeal.requestedScore || selectedAppeal.originalScore + 0.5;

    setAppeals((prev) =>
      prev.map((a) =>
        a.id === selectedAppeal.id
          ? {
              ...a,
              status: "resolved",
              resolution: "approved",
              newScore,
              teacherResponse: responseText || "Апелляция одобрена. Оценка пересмотрена.",
              resolvedAt: new Date(),
            }
          : a,
      ),
    );

    setSelectedAppeal({
      ...selectedAppeal,
      status: "resolved",
      resolution: "approved",
      newScore,
      teacherResponse: responseText || "Апелляция одобрена. Оценка пересмотрена.",
      resolvedAt: new Date(),
    });

    setResponseText("");
    alert("Апелляция одобрена. Оценка обновлена.");
  };

  const handleDeny = () => {
    if (!selectedAppeal) return;

    setAppeals((prev) =>
      prev.map((a) =>
        a.id === selectedAppeal.id
          ? {
              ...a,
              status: "resolved",
              resolution: "denied",
              teacherResponse: responseText || "Исходная оценка сохранена. Рецензия корректна.",
              resolvedAt: new Date(),
            }
          : a,
      ),
    );

    setSelectedAppeal({
      ...selectedAppeal,
      status: "resolved",
      resolution: "denied",
      teacherResponse: responseText || "Исходная оценка сохранена. Рецензия корректна.",
      resolvedAt: new Date(),
    });

    setResponseText("");
    alert("Апелляция отклонена.");
  };

  const handleAdjust = () => {
    if (!selectedAppeal || adjustedScore === null) {
      alert("Укажите скорректированную оценку");
      return;
    }

    setAppeals((prev) =>
      prev.map((a) =>
        a.id === selectedAppeal.id
          ? {
              ...a,
              status: "resolved",
              resolution: "adjusted",
              newScore: adjustedScore,
              teacherResponse: responseText || "Оценка скорректирована.",
              resolvedAt: new Date(),
            }
          : a,
      ),
    );

    setSelectedAppeal({
      ...selectedAppeal,
      status: "resolved",
      resolution: "adjusted",
      newScore: adjustedScore,
      teacherResponse: responseText || "Оценка скорректирована.",
      resolvedAt: new Date(),
    });

    setResponseText("");
    setAdjustedScore(null);
    alert("Оценка скорректирована.");
  };

  const handleMarkInReview = (appeal: Appeal) => {
    setAppeals((prev) =>
      prev.map((a) => (a.id === appeal.id ? { ...a, status: "in_review" as AppealStatus } : a)),
    );
  };

  const newCount = appeals.filter((a) => a.status === "new").length;
  const inReviewCount = appeals.filter((a) => a.status === "in_review").length;
  const resolvedCount = appeals.filter((a) => a.status === "resolved").length;

  return (
    <AppShell title="Апелляции">
      <Breadcrumbs items={[CRUMBS.teacherDashboard, { label: "Апелляции" }]} />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Апелляции
          </h1>
          <p className="text-[16px] text-[#767692]">
            Рассмотрение жалоб студентов на оценки и рецензии
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-[#5b8def]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Новые</span>
            </div>
            <p className="text-[28px] font-medium text-[#5b8def]">{newCount}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Edit3 className="w-4 h-4 text-[#ff9800]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">
                На рассмотрении
              </span>
            </div>
            <p className="text-[28px] font-medium text-[#ff9800]">{inReviewCount}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#4caf50]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Решено</span>
            </div>
            <p className="text-[28px] font-medium text-[#4caf50]">{resolvedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#767692]" />
            <h2 className="text-[16px] font-medium text-[#21214f]">Фильтры</h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-[#5b8def] text-white"
                  : "bg-[#f9f9f9] text-[#767692] hover:bg-[#e6e8ee]"
              }`}
            >
              Все ({appeals.length})
            </button>
            <button
              onClick={() => setFilterStatus("new")}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                filterStatus === "new"
                  ? "bg-[#5b8def] text-white"
                  : "bg-[#f9f9f9] text-[#767692] hover:bg-[#e6e8ee]"
              }`}
            >
              Новые ({newCount})
            </button>
            <button
              onClick={() => setFilterStatus("in_review")}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                filterStatus === "in_review"
                  ? "bg-[#5b8def] text-white"
                  : "bg-[#f9f9f9] text-[#767692] hover:bg-[#e6e8ee]"
              }`}
            >
              На рассмотрении ({inReviewCount})
            </button>
            <button
              onClick={() => setFilterStatus("resolved")}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                filterStatus === "resolved"
                  ? "bg-[#5b8def] text-white"
                  : "bg-[#f9f9f9] text-[#767692] hover:bg-[#e6e8ee]"
              }`}
            >
              Решённые ({resolvedCount})
            </button>
          </div>
        </div>

        {/* Appeals List */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
          {filteredAppeals.length > 0 ? (
            <div className="divide-y divide-[#e6e8ee]">
              {filteredAppeals.map((appeal) => (
                <div
                  key={appeal.id}
                  className="p-6 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedAppeal(appeal);
                    setResponseText("");
                    setAdjustedScore(null);
                    if (appeal.status === "new") {
                      handleMarkInReview(appeal);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[18px] font-medium text-[#21214f]">
                          {appeal.studentName}
                        </h3>
                        {getStatusBadge(appeal.status)}
                        {appeal.resolution && getResolutionBadge(appeal.resolution)}
                      </div>
                      <p className="text-[14px] text-[#767692] mb-2">{appeal.assignmentTitle}</p>
                      <p className="text-[14px] text-[#21214f] line-clamp-2 mb-2">
                        {appeal.message}
                      </p>
                      <div className="flex items-center gap-4 text-[13px] text-[#767692]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {appeal.createdAt.toLocaleDateString("ru-RU")}
                        </span>
                        <span>
                          Оценка:{" "}
                          <strong className="text-[#21214f]">
                            {appeal.originalScore.toFixed(1)}
                          </strong>
                        </span>
                        {appeal.requestedScore && (
                          <span>
                            Запрошено:{" "}
                            <strong className="text-[#5b8def]">
                              {appeal.requestedScore.toFixed(1)}
                            </strong>
                          </span>
                        )}
                        {appeal.newScore && (
                          <span>
                            Новая оценка:{" "}
                            <strong className="text-[#4caf50]">{appeal.newScore.toFixed(1)}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-[#21214f] mb-2">Нет апелляций</h3>
              <p className="text-[14px] text-[#767692]">
                Апелляции появятся здесь, когда студенты их подадут
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Appeal Detail Drawer */}
      {selectedAppeal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end"
          onClick={() => setSelectedAppeal(null)}
        >
          <div
            className="bg-white h-full w-full md:w-[700px] shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b-2 border-[#e6e8ee] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-[20px] font-medium text-[#21214f]">
                  Апелляция #{selectedAppeal.id}
                </h2>
                <p className="text-[13px] text-[#767692] mt-1">
                  {selectedAppeal.studentName} • {selectedAppeal.createdAt.toLocaleString("ru-RU")}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="p-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-[#767692]" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedAppeal.status)}
                {selectedAppeal.resolution && getResolutionBadge(selectedAppeal.resolution)}
              </div>

              {/* Assignment Info */}
              <div className="bg-[#f9f9f9] border-2 border-[#e6e8ee] rounded-[12px] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-[#767692]" />
                  <h3 className="text-[15px] font-medium text-[#21214f]">Информация о задании</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                      Задание
                    </p>
                    <p className="text-[14px] text-[#21214f] font-medium">
                      {selectedAppeal.assignmentTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                      Студент
                    </p>
                    <p className="text-[14px] text-[#21214f] font-medium">
                      {selectedAppeal.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                      Исходная оценка
                    </p>
                    <p className="text-[20px] text-[#d4183d] font-medium">
                      {selectedAppeal.originalScore.toFixed(1)}/5
                    </p>
                  </div>
                  {selectedAppeal.requestedScore && (
                    <div>
                      <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                        Запрашиваемая оценка
                      </p>
                      <p className="text-[20px] text-[#5b8def] font-medium">
                        {selectedAppeal.requestedScore.toFixed(1)}/5
                      </p>
                    </div>
                  )}
                  {selectedAppeal.newScore && (
                    <div>
                      <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                        Новая оценка
                      </p>
                      <p className="text-[20px] text-[#4caf50] font-medium">
                        {selectedAppeal.newScore.toFixed(1)}/5
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Message */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-[#767692]" />
                  <h3 className="text-[15px] font-medium text-[#21214f]">Сообщение студента</h3>
                </div>
                <div className="p-4 bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[12px]">
                  <p className="text-[14px] text-[#21214f] leading-relaxed">
                    {selectedAppeal.message}
                  </p>
                </div>
              </div>

              {/* Teacher Response (if resolved) */}
              {selectedAppeal.status === "resolved" && selectedAppeal.teacherResponse && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-[#767692]" />
                    <h3 className="text-[15px] font-medium text-[#21214f]">Ответ преподавателя</h3>
                  </div>
                  <div className="p-4 bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[12px]">
                    <p className="text-[14px] text-[#21214f] leading-relaxed">
                      {selectedAppeal.teacherResponse}
                    </p>
                    {selectedAppeal.resolvedAt && (
                      <p className="text-[12px] text-[#767692] mt-2">
                        Решено: {selectedAppeal.resolvedAt.toLocaleString("ru-RU")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions (if not resolved) */}
              {selectedAppeal.status !== "resolved" && (
                <div>
                  <h3 className="text-[15px] font-medium text-[#21214f] mb-3">Действия</h3>

                  {/* Response textarea */}
                  <div className="mb-4">
                    <label className="block text-[13px] font-medium text-[#767692] mb-2">
                      Комментарий (необязательно)
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Добавьте комментарий к решению..."
                      className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[14px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors min-h-[100px] resize-y"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    {/* Approve */}
                    <button
                      onClick={handleApprove}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4caf50] text-white rounded-[12px] hover:bg-[#45a049] transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-[15px] font-medium">
                        Одобрить апелляцию
                        {selectedAppeal.requestedScore &&
                          ` (новая оценка: ${selectedAppeal.requestedScore.toFixed(1)})`}
                      </span>
                    </button>

                    {/* Adjust Score */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={adjustedScore || ""}
                        onChange={(e) => setAdjustedScore(parseFloat(e.target.value))}
                        placeholder="Новая оценка (0-5)"
                        className="flex-1 px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[14px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                      />
                      <button
                        onClick={handleAdjust}
                        className="flex items-center gap-2 px-6 py-3 bg-[#ff9800] text-white rounded-[12px] hover:bg-[#f57c00] transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                        <span className="text-[15px] font-medium">Скорректировать</span>
                      </button>
                    </div>

                    {/* Deny */}
                    <button
                      onClick={handleDeny}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#d4183d] text-[#d4183d] rounded-[12px] hover:bg-[#fff5f5] transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      <span className="text-[15px] font-medium">Отклонить апелляцию</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
