import { AlertCircle, CheckCircle, Clock, GitBranch, Info } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { reviewRepo } from "@/entities/review";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

type OverallStatus = "not-started" | "in-progress" | "completed";
type ReviewerStatus = "pending" | "draft" | "submitted";

interface DistributionRow {
  submissionId: string;
  anonymousId: string;
  authorName: string;
  assignedReviewers: Array<{ id: string; name: string; status: ReviewerStatus }>;
  overallStatus: OverallStatus;
}

export default function TeacherDistributionPage() {
  const { t } = useTranslation();
  const {
    data: baseData,
    isLoading,
    error,
    refetch,
  } = useAsync(
    async () => {
      const [courses, users, submissions, reviews] = await Promise.all([
        courseRepo.getAll(),
        userRepo.getAll(),
        workRepo.getAll(),
        reviewRepo.getAll(),
      ]);
      return { courses, users, submissions, reviews };
    },
    [],
    { onError: "redirect" },
  );

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");

  const effectiveCourse = selectedCourse || baseData?.courses[0]?.id || "";

  const { data: assignments } = useAsync(async () => {
    if (!effectiveCourse) return [];
    return assignmentRepo.getByCourse(effectiveCourse);
  }, [effectiveCourse]);

  if (isLoading)
    return (
      <AppShell title={t("teacher.distribution.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.distribution.title")}>
        <ErrorBanner error={error} onRetry={refetch} />
      </AppShell>
    );

  const { courses, users, submissions, reviews } = baseData!;

  const distributions: DistributionRow[] = selectedAssignment
    ? submissions
        .filter((s) => s.assignmentId === selectedAssignment)
        .map((submission, idx) => {
          const author = users.find((u) => u.id === submission.studentId);
          const submissionReviews = reviews.filter((r) => r.submissionId === submission.id);
          const assignedReviewers = submissionReviews.map((review) => {
            const reviewer = users.find((u) => u.id === review.reviewerId);
            return {
              id: review.reviewerId,
              name: reviewer?.name || t("teacher.distribution.unknownReviewer"),
              status: review.status as ReviewerStatus,
            };
          });
          const submittedCount = assignedReviewers.filter((r) => r.status === "submitted").length;
          let overallStatus: OverallStatus = "not-started";
          if (assignedReviewers.length > 0 && submittedCount === assignedReviewers.length) {
            overallStatus = "completed";
          } else if (submittedCount > 0) {
            overallStatus = "in-progress";
          }
          return {
            submissionId: submission.id,
            anonymousId: `SUB-${String(idx + 1).padStart(3, "0")}`,
            authorName: author?.name || t("teacher.distribution.unknownAuthor"),
            assignedReviewers,
            overallStatus,
          };
        })
    : [];

  return (
    <AppShell title={t("teacher.distribution.title")}>
      <Breadcrumbs items={[{ label: t("teacher.distribution.breadcrumb") }]} />
      <PageHeader
        title={t("teacher.distribution.title")}
        subtitle={t("teacher.distribution.subtitle")}
      />

      <div className="bg-info-light border border-info rounded-[12px] p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
        <p className="text-[13px] text-foreground">{t("teacher.distribution.readOnlyNotice")}</p>
      </div>

      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("teacher.distribution.courseLabel")}
            </label>
            <select
              value={effectiveCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedAssignment("");
              }}
              className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] bg-background focus:border-brand-primary focus:outline-none"
            >
              <option value="">{t("teacher.distribution.selectCourse")}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("teacher.distribution.assignmentLabel")}
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              disabled={!effectiveCourse}
              className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] bg-background focus:border-brand-primary focus:outline-none disabled:opacity-50"
            >
              <option value="">{t("teacher.distribution.selectAssignment")}</option>
              {(assignments ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!selectedAssignment ? (
        <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
          <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-[15px] text-muted-foreground">
            {t("teacher.distribution.pickAssignmentPrompt")}
          </p>
        </div>
      ) : distributions.length === 0 ? (
        <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
          <p className="text-[15px] text-muted-foreground">
            {t("teacher.distribution.emptyState")}
          </p>
        </div>
      ) : (
        <DistributionTable rows={distributions} />
      )}
    </AppShell>
  );
}

function DistributionTable({ rows }: { rows: DistributionRow[] }) {
  const { t } = useTranslation();
  return (
    <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                {t("teacher.distribution.work")}
              </th>
              <th className="text-left p-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                {t("teacher.distribution.author")}
              </th>
              <th className="text-left p-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                {t("teacher.distribution.assignedReviewers")}
              </th>
              <th className="text-left p-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                {t("common.status")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.submissionId}>
                <td className="p-4 text-[14px] text-foreground font-mono">{row.anonymousId}</td>
                <td className="p-4 text-[14px] text-foreground">{row.authorName}</td>
                <td className="p-4">
                  {row.assignedReviewers.length === 0 ? (
                    <span className="text-[13px] text-muted-foreground italic">
                      {t("teacher.distribution.noReviewers")}
                    </span>
                  ) : (
                    <ul className="space-y-1">
                      {row.assignedReviewers.map((r) => (
                        <li key={r.id} className="flex items-center gap-2 text-[13px]">
                          <ReviewerStatusDot status={r.status} />
                          <span className="text-foreground">{r.name}</span>
                          <span className="text-muted-foreground">
                            ({t(`teacher.distribution.reviewerStatus.${r.status}`)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="p-4">
                  <OverallStatusBadge status={row.overallStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewerStatusDot({ status }: { status: ReviewerStatus }) {
  const color =
    status === "submitted"
      ? "bg-success"
      : status === "draft"
        ? "bg-warning"
        : "bg-muted-foreground";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

function OverallStatusBadge({ status }: { status: OverallStatus }) {
  const { t } = useTranslation();
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[12px] font-medium">
        <CheckCircle className="w-3 h-3" />
        {t("teacher.distribution.completed")}
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium">
        <Clock className="w-3 h-3" />
        {t("teacher.distribution.inProgress")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[12px] font-medium">
      <AlertCircle className="w-3 h-3" />
      {t("teacher.distribution.notStarted")}
    </span>
  );
}
