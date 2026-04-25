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
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { reviewRepo } from "@/entities/review";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

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
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useAsync(
    async () => {
      const [users, assignments, submissions, reviews] = await Promise.all([
        userRepo.getAll(),
        assignmentRepo.getAll(),
        workRepo.getAll(),
        reviewRepo.getAll(),
      ]);
      return { users, assignments, submissions, reviews };
    },
    [],
    { onError: "redirect" },
  );

  if (isLoading)
    return (
      <AppShell title={t("teacher.appeals.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.appeals.title")}>
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
  const { t } = useTranslation();
  const { users, assignments, submissions, reviews } = data;

  // собираем апелляции из реальных рецензий — берём первые 8 и проставляем статусы по индексу
  const generateAppeals = (): Appeal[] => {
    const appeals: Appeal[] = [];
    const appealMessages = [
      t("teacher.appeals.msg1"),
      t("teacher.appeals.msg2"),
      t("teacher.appeals.msg3"),
      t("teacher.appeals.msg4"),
      t("teacher.appeals.msg5"),
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
          appeal.teacherResponse = t("teacher.appeals.resolvedApproved");
        } else if (appeal.resolution === "adjusted") {
          appeal.newScore = appeal.originalScore + 0.3;
          appeal.teacherResponse = t("teacher.appeals.resolvedAdjusted");
        } else {
          appeal.teacherResponse = t("teacher.appeals.resolvedDenied");
        }
      }

      appeals.push(appeal);
    });

    return appeals.sort((a, b) => {
      // сортировка: сперва новые, потом in_review, потом resolved; внутри статуса — свежие сверху
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
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-info-light text-brand-primary rounded-[6px] text-[12px] font-medium">
            <AlertCircle className="w-3 h-3" />
            {t("teacher.appeals.newStatus")}
          </span>
        );
      case "in_review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium">
            <Edit3 className="w-3 h-3" />
            {t("teacher.appeals.inReviewStatus")}
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[12px] font-medium">
            <CheckCircle className="w-3 h-3" />
            {t("teacher.appeals.resolvedStatus")}
          </span>
        );
    }
  };

  const getResolutionBadge = (resolution?: "approved" | "denied" | "adjusted") => {
    if (!resolution) return null;

    switch (resolution) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[11px] font-medium">
            <CheckCircle className="w-3 h-3" />
            {t("teacher.appeals.approved")}
          </span>
        );
      case "denied":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-light text-error rounded-[6px] text-[11px] font-medium">
            <XCircle className="w-3 h-3" />
            {t("teacher.appeals.denied")}
          </span>
        );
      case "adjusted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[11px] font-medium">
            <Edit3 className="w-3 h-3" />
            {t("teacher.appeals.adjusted")}
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
              teacherResponse: responseText || t("teacher.appeals.defaultApproveResponse"),
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
      teacherResponse: responseText || t("teacher.appeals.defaultApproveResponse"),
      resolvedAt: new Date(),
    });

    setResponseText("");
    alert(t("teacher.appeals.appealApprovedAlert"));
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
              teacherResponse: responseText || t("teacher.appeals.defaultDenyResponse"),
              resolvedAt: new Date(),
            }
          : a,
      ),
    );

    setSelectedAppeal({
      ...selectedAppeal,
      status: "resolved",
      resolution: "denied",
      teacherResponse: responseText || t("teacher.appeals.defaultDenyResponse"),
      resolvedAt: new Date(),
    });

    setResponseText("");
    alert(t("teacher.appeals.appealDeniedAlert"));
  };

  const handleAdjust = () => {
    if (!selectedAppeal || adjustedScore === null) {
      alert(t("teacher.appeals.specifyAdjustedScore"));
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
              teacherResponse: responseText || t("teacher.appeals.defaultAdjustResponse"),
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
      teacherResponse: responseText || t("teacher.appeals.defaultAdjustResponse"),
      resolvedAt: new Date(),
    });

    setResponseText("");
    setAdjustedScore(null);
    alert(t("teacher.appeals.gradeAdjustedAlert"));
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
    <AppShell title={t("teacher.appeals.title")}>
      <Breadcrumbs items={[{ label: t("teacher.appeals.breadcrumb") }]} />

      <PageHeader title={t("teacher.appeals.title")} subtitle={t("teacher.appeals.subtitle")} />

      <div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-brand-primary" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.appeals.new")}
              </span>
            </div>
            <p className="text-[28px] font-medium text-brand-primary">{newCount}</p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Edit3 className="w-4 h-4 text-warning" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.appeals.underReview")}
              </span>
            </div>
            <p className="text-[28px] font-medium text-warning">{inReviewCount}</p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.appeals.resolved")}
              </span>
            </div>
            <p className="text-[28px] font-medium text-success">{resolvedCount}</p>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-[16px] font-medium text-foreground">
              {t("teacher.appeals.filtersLabel")}
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-brand-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {t("common.all")} ({appeals.length})
            </button>
            <button
              onClick={() => setFilterStatus("new")}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                filterStatus === "new"
                  ? "bg-brand-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {t("teacher.appeals.new")} ({newCount})
            </button>
            <button
              onClick={() => setFilterStatus("in_review")}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                filterStatus === "in_review"
                  ? "bg-brand-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {t("teacher.appeals.underReview")} ({inReviewCount})
            </button>
            <button
              onClick={() => setFilterStatus("resolved")}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                filterStatus === "resolved"
                  ? "bg-brand-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {t("teacher.appeals.resolvedPlural")} ({resolvedCount})
            </button>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
          {filteredAppeals.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredAppeals.map((appeal) => (
                <div
                  key={appeal.id}
                  className="p-6 hover:bg-surface-hover transition-colors cursor-pointer"
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
                        <h3 className="text-[18px] font-medium text-foreground">
                          {appeal.studentName}
                        </h3>
                        {getStatusBadge(appeal.status)}
                        {appeal.resolution && getResolutionBadge(appeal.resolution)}
                      </div>
                      <p className="text-[14px] text-muted-foreground mb-2">
                        {appeal.assignmentTitle}
                      </p>
                      <p className="text-[14px] text-foreground line-clamp-2 mb-2">
                        {appeal.message}
                      </p>
                      <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {appeal.createdAt.toLocaleDateString()}
                        </span>
                        <span>
                          {t("teacher.appeals.scoreLabel")}{" "}
                          <strong className="text-foreground">
                            {appeal.originalScore.toFixed(1)}
                          </strong>
                        </span>
                        {appeal.requestedScore && (
                          <span>
                            {t("teacher.appeals.requestedLabel")}{" "}
                            <strong className="text-brand-primary">
                              {appeal.requestedScore.toFixed(1)}
                            </strong>
                          </span>
                        )}
                        {appeal.newScore && (
                          <span>
                            {t("teacher.appeals.newScoreCardLabel")}{" "}
                            <strong className="text-success">{appeal.newScore.toFixed(1)}</strong>
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
              <AlertCircle className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                {t("teacher.appeals.noAppeals")}
              </h3>
              <p className="text-[14px] text-muted-foreground">
                {t("teacher.appeals.appealsWillAppear")}
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedAppeal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end"
          onClick={() => setSelectedAppeal(null)}
        >
          <div
            className="bg-card h-full w-full md:w-[700px] shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b-2 border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-[20px] font-medium text-foreground">
                  {t("teacher.appeals.appealTitle", { id: selectedAppeal.id })}
                </h2>
                <p className="text-[13px] text-muted-foreground mt-1">
                  {selectedAppeal.studentName} • {selectedAppeal.createdAt.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="p-2 hover:bg-muted rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedAppeal.status)}
                {selectedAppeal.resolution && getResolutionBadge(selectedAppeal.resolution)}
              </div>

              <div className="bg-muted border-2 border-border rounded-[12px] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-[15px] font-medium text-foreground">
                    {t("teacher.appeals.assignmentInfo")}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.appeals.assignment")}
                    </p>
                    <p className="text-[14px] text-foreground font-medium">
                      {selectedAppeal.assignmentTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.appeals.studentLabel")}
                    </p>
                    <p className="text-[14px] text-foreground font-medium">
                      {selectedAppeal.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.appeals.originalScore")}
                    </p>
                    <p className="text-[20px] text-error font-medium">
                      {selectedAppeal.originalScore.toFixed(1)}/5
                    </p>
                  </div>
                  {selectedAppeal.requestedScore && (
                    <div>
                      <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                        {t("teacher.appeals.requestedScore")}
                      </p>
                      <p className="text-[20px] text-brand-primary font-medium">
                        {selectedAppeal.requestedScore.toFixed(1)}/5
                      </p>
                    </div>
                  )}
                  {selectedAppeal.newScore && (
                    <div>
                      <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                        {t("teacher.appeals.newScore")}
                      </p>
                      <p className="text-[20px] text-success font-medium">
                        {selectedAppeal.newScore.toFixed(1)}/5
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-[15px] font-medium text-foreground">
                    {t("teacher.appeals.studentMessage")}
                  </h3>
                </div>
                <div className="p-4 bg-info-light border-2 border-brand-primary rounded-[12px]">
                  <p className="text-[14px] text-foreground leading-relaxed">
                    {selectedAppeal.message}
                  </p>
                </div>
              </div>

              {selectedAppeal.status === "resolved" && selectedAppeal.teacherResponse && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-[15px] font-medium text-foreground">
                      {t("teacher.appeals.teacherResponse")}
                    </h3>
                  </div>
                  <div className="p-4 bg-success-light border-2 border-success rounded-[12px]">
                    <p className="text-[14px] text-foreground leading-relaxed">
                      {selectedAppeal.teacherResponse}
                    </p>
                    {selectedAppeal.resolvedAt && (
                      <p className="text-[12px] text-muted-foreground mt-2">
                        {t("teacher.appeals.resolvedAt")}{" "}
                        {selectedAppeal.resolvedAt.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedAppeal.status !== "resolved" && (
                <div>
                  <h3 className="text-[15px] font-medium text-foreground mb-3">
                    {t("teacher.appeals.actionsTitle")}
                  </h3>

                  <div className="mb-4">
                    <label className="block text-[13px] font-medium text-muted-foreground mb-2">
                      {t("teacher.appeals.commentOptional")}
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder={t("teacher.appeals.addResolutionComment")}
                      className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[14px] text-foreground focus:border-brand-primary focus:outline-none transition-colors min-h-[100px] resize-y"
                    />
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleApprove}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success text-primary-foreground rounded-[12px] hover:bg-success transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-[15px] font-medium">
                        {t("teacher.appeals.approveAppeal")}
                        {selectedAppeal.requestedScore &&
                          ` (${t("teacher.appeals.newScoreApprove", { score: selectedAppeal.requestedScore.toFixed(1) })})`}
                      </span>
                    </button>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={adjustedScore || ""}
                        onChange={(e) => setAdjustedScore(parseFloat(e.target.value))}
                        placeholder={t("teacher.appeals.newScoreRange")}
                        className="flex-1 px-4 py-3 border-2 border-border rounded-[12px] text-[14px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
                      />
                      <button
                        onClick={handleAdjust}
                        className="flex items-center gap-2 px-6 py-3 bg-warning text-primary-foreground rounded-[12px] hover:bg-warning transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                        <span className="text-[15px] font-medium">
                          {t("teacher.appeals.adjust")}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={handleDeny}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-error text-error rounded-[12px] hover:bg-error-light transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      <span className="text-[15px] font-medium">
                        {t("teacher.appeals.denyAppeal")}
                      </span>
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
