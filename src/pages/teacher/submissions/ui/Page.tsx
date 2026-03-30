import {
  Send,
  Filter,
  Search,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  X,
  ChevronRight,
  Shield,
  Code,
  FileCheck,
  EyeOff,
  History,
  StickyNote,
  Save,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherSubmissionsPage - Просмотр сабмишенов (работ студентов)
 *
 * Фильтрация по:
 * - Статус (draft/submitted/late)
 * - Риск плагиата (low/med/high)
 * - Наличие failed checks
 * - Поиск по студенту
 *
 * Детальный просмотр:
 * - Список файлов с кнопками скачивания
 * - Временная шкала версий
 * - Отчеты плагинов (plagiarism/lint/format/anonymization)
 * - Внутренние заметки преподавателя
 */

type SubmissionStatus = "draft" | "submitted" | "late";
type PlagiarismRisk = "low" | "medium" | "high";

interface PluginReport {
  id: string;
  pluginName: string;
  pluginType: "plagiarism" | "lint" | "format" | "anonymization";
  status: "passed" | "warning" | "failed";
  score?: number;
  message: string;
  timestamp: Date;
  details?: string;
}

interface SubmissionVersion {
  id: string;
  version: number;
  submittedAt: Date;
  filesCount: number;
  changes: string;
}

interface SubmissionFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
}

interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  status: SubmissionStatus;
  plagiarismRisk: PlagiarismRisk;
  submittedAt?: Date;
  deadline: Date;
  files: SubmissionFile[];
  versions: SubmissionVersion[];
  pluginReports: PluginReport[];
  teacherNotes: string;
}

export default function TeacherSubmissionsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useAsync(async () => {
    const [users, assignments, demoSubmissions] = await Promise.all([
      userRepo.getAll(),
      assignmentRepo.getAll(),
      workRepo.getAll(),
    ]);
    return { users, assignments, demoSubmissions };
  }, []);

  if (isLoading)
    return (
      <AppShell title={t("teacher.submissions.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.submissions.title")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  return <SubmissionsContent data={data!} />;
}

function SubmissionsContent({
  data,
}: {
  data: {
    users: Awaited<ReturnType<typeof userRepo.getAll>>;
    assignments: Awaited<ReturnType<typeof assignmentRepo.getAll>>;
    demoSubmissions: Awaited<ReturnType<typeof workRepo.getAll>>;
  };
}) {
  const { t } = useTranslation();
  const { users, assignments, demoSubmissions } = data;

  // Get pre-filter from URL hash params
  const getPreFilterAssignmentId = (): string => {
    const hash = window.location.hash.slice(1); // Remove #
    const queryStart = hash.indexOf("?");
    if (queryStart === -1) return "";

    const queryString = hash.substring(queryStart + 1);
    const params = new URLSearchParams(queryString);
    return params.get("assignmentId") || "";
  };

  // Generate comprehensive work data
  const generateSubmissions = (): Submission[] => {
    return demoSubmissions.map((sub, idx) => {
      const assignment = assignments.find((a) => a.id === sub.assignmentId);
      const student = users.find((u) => u.id === sub.studentId);

      const isLate =
        sub.submittedAt && sub.submittedAt > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const status: SubmissionStatus =
        sub.status === "draft" ? "draft" : isLate ? "late" : "submitted";

      const plagiarismRisks: PlagiarismRisk[] = ["low", "medium", "high"];
      const plagiarismRisk = plagiarismRisks[idx % 3];

      // Generate files
      const files: SubmissionFile[] = [
        {
          id: `f1-${sub.id}`,
          name: "main.py",
          size: "2.4 KB",
          uploadedAt: sub.submittedAt,
        },
        {
          id: `f2-${sub.id}`,
          name: "utils.py",
          size: "1.8 KB",
          uploadedAt: sub.submittedAt,
        },
        {
          id: `f3-${sub.id}`,
          name: "README.md",
          size: "856 B",
          uploadedAt: sub.submittedAt,
        },
      ];

      // Generate versions
      const versions: SubmissionVersion[] = [
        {
          id: `v1-${sub.id}`,
          version: 1,
          submittedAt: new Date(sub.submittedAt.getTime() - 2 * 60 * 60 * 1000),
          filesCount: 2,
          changes: t("teacher.submissions.versionInitial"),
        },
        {
          id: `v2-${sub.id}`,
          version: 2,
          submittedAt: new Date(sub.submittedAt.getTime() - 1 * 60 * 60 * 1000),
          filesCount: 3,
          changes: t("teacher.submissions.versionAddedReadme"),
        },
        {
          id: `v3-${sub.id}`,
          version: 3,
          submittedAt: sub.submittedAt,
          filesCount: 3,
          changes: t("teacher.submissions.versionFixedTypos"),
        },
      ];

      // Generate plugin reports
      const pluginReports: PluginReport[] = [
        {
          id: `pr1-${sub.id}`,
          pluginName: "Turnitin",
          pluginType: "plagiarism",
          status:
            plagiarismRisk === "high"
              ? "failed"
              : plagiarismRisk === "medium"
                ? "warning"
                : "passed",
          score: plagiarismRisk === "high" ? 78 : plagiarismRisk === "medium" ? 45 : 12,
          message:
            plagiarismRisk === "high"
              ? t("teacher.submissions.plagiarismHighMsg")
              : plagiarismRisk === "medium"
                ? t("teacher.submissions.plagiarismMedMsg")
                : t("teacher.submissions.plagiarismLowMsg"),
          timestamp: new Date(sub.submittedAt.getTime() + 5 * 60 * 1000),
          details: t("teacher.submissions.plagiarismDetails", {
            percent:
              plagiarismRisk === "high" ? "78%" : plagiarismRisk === "medium" ? "45%" : "12%",
          }),
        },
        {
          id: `pr2-${sub.id}`,
          pluginName: "ESLint",
          pluginType: "lint",
          status: idx % 3 === 0 ? "failed" : idx % 3 === 1 ? "warning" : "passed",
          message:
            idx % 3 === 0
              ? t("teacher.submissions.lintErrorsFound", { count: 12 })
              : idx % 3 === 1
                ? t("teacher.submissions.lintWarnings", { count: 3 })
                : t("teacher.submissions.lintCodeOk"),
          timestamp: new Date(sub.submittedAt.getTime() + 2 * 60 * 1000),
          details:
            idx % 3 === 0
              ? t("teacher.submissions.lintFixSyntax")
              : t("teacher.submissions.lintMinorIssues"),
        },
        {
          id: `pr3-${sub.id}`,
          pluginName: "Prettier",
          pluginType: "format",
          status: "passed",
          message: t("teacher.submissions.formatOk"),
          timestamp: new Date(sub.submittedAt.getTime() + 3 * 60 * 1000),
        },
        {
          id: `pr4-${sub.id}`,
          pluginName: "Anonymous Check",
          pluginType: "anonymization",
          status: "passed",
          message: t("teacher.submissions.noPersonalInfo"),
          timestamp: new Date(sub.submittedAt.getTime() + 1 * 60 * 1000),
        },
      ];

      return {
        id: sub.id,
        assignmentId: sub.assignmentId,
        assignmentTitle: assignment?.title || "Unknown Assignment",
        studentId: sub.studentId,
        studentName: student?.name || "Unknown Student",
        status,
        plagiarismRisk,
        submittedAt: sub.submittedAt,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        files,
        versions,
        pluginReports,
        teacherNotes: "",
      };
    });
  };

  const [submissions, setSubmissions] = useState<Submission[]>(() => generateSubmissions());
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "all">("all");
  const [filterPlagiarism, setFilterPlagiarism] = useState<PlagiarismRisk | "all">("all");
  const [filterFailedChecks, setFilterFailedChecks] = useState(false);
  const [filterAssignment, setFilterAssignment] = useState<string>(getPreFilterAssignmentId());
  const [searchStudent, setSearchStudent] = useState("");

  // Teacher notes editing
  const [editingNotes, setEditingNotes] = useState(false);
  // Notes are synced via key prop pattern instead of useEffect
  const notesInitialValue = selectedSubmission?.teacherNotes || "";
  const [notesText, setNotesText] = useState(notesInitialValue);

  useEffect(() => {
    // Update notesText when selected work changes.
    // Schedule setState asynchronously to avoid cascading renders (ESLint rule).
    if (!selectedSubmission) return;
    const t = setTimeout(() => {
      setNotesText(selectedSubmission.teacherNotes);
    }, 0);
    return () => clearTimeout(t);
  }, [selectedSubmission]);

  // Apply filters
  const filteredSubmissions = submissions.filter((sub) => {
    if (filterStatus !== "all" && sub.status !== filterStatus) return false;
    if (filterPlagiarism !== "all" && sub.plagiarismRisk !== filterPlagiarism) return false;
    if (filterFailedChecks) {
      const hasFailed = sub.pluginReports.some((r) => r.status === "failed");
      if (!hasFailed) return false;
    }
    if (filterAssignment !== "all" && sub.assignmentId !== filterAssignment) return false;
    if (searchStudent && !sub.studentName.toLowerCase().includes(searchStudent.toLowerCase()))
      return false;
    return true;
  });

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[12px] font-medium">
            <CheckCircle className="w-3 h-3" />
            {t("teacher.submissions.submitted")}
          </span>
        );
      case "late":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium">
            <Clock className="w-3 h-3" />
            {t("teacher.submissions.late")}
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[12px] font-medium">
            <FileText className="w-3 h-3" />
            {t("teacher.submissions.draft")}
          </span>
        );
    }
  };

  const getPlagiarismBadge = (risk: PlagiarismRisk) => {
    switch (risk) {
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-light text-error rounded-[6px] text-[12px] font-medium">
            <AlertTriangle className="w-3 h-3" />
            {t("teacher.submissions.high")}
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium">
            <AlertTriangle className="w-3 h-3" />
            {t("teacher.submissions.medium")}
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[12px] font-medium">
            <CheckCircle className="w-3 h-3" />
            {t("teacher.submissions.low")}
          </span>
        );
    }
  };

  const getPluginIcon = (type: PluginReport["pluginType"]) => {
    switch (type) {
      case "plagiarism":
        return <Shield className="w-4 h-4" />;
      case "lint":
        return <Code className="w-4 h-4" />;
      case "format":
        return <FileCheck className="w-4 h-4" />;
      case "anonymization":
        return <EyeOff className="w-4 h-4" />;
    }
  };

  const getPluginStatusBadge = (status: PluginReport["status"]) => {
    switch (status) {
      case "passed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[11px] font-medium">
            <CheckCircle className="w-3 h-3" />
            Passed
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[11px] font-medium">
            <AlertTriangle className="w-3 h-3" />
            Warning
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-light text-error rounded-[6px] text-[11px] font-medium">
            <X className="w-3 h-3" />
            Failed
          </span>
        );
    }
  };

  const handleDownloadFile = (fileName: string) => {
    alert(t("teacher.submissions.downloadingFile", { name: fileName }));
  };

  const handleSaveNotes = () => {
    if (selectedSubmission) {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id ? { ...sub, teacherNotes: notesText } : sub,
        ),
      );
      setSelectedSubmission({ ...selectedSubmission, teacherNotes: notesText });
      setEditingNotes(false);
      alert(t("teacher.submissions.notesSaved"));
    }
  };

  const hasFailedChecks = (sub: Submission) => {
    return sub.pluginReports.some((r) => r.status === "failed");
  };

  return (
    <AppShell title={t("teacher.submissions.title")}>
      <Breadcrumbs items={[{ label: t("teacher.submissions.breadcrumb") }]} />

      <PageHeader
        title={t("teacher.submissions.title")}
        subtitle={t("teacher.submissions.subtitle")}
      />

      <div>
        {/* Filters */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-[16px] font-medium text-foreground">{t("common.filters")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Assignment Filter */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("common.assignments")}
              </label>
              <select
                value={filterAssignment}
                onChange={(e) => setFilterAssignment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                <option value="all">
                  {t("teacher.submissions.allAssignments")} ({submissions.length})
                </option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("common.status")}
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SubmissionStatus | "all")}
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                <option value="all">{t("teacher.submissions.allStatuses")}</option>
                <option value="submitted">{t("teacher.submissions.submitted")}</option>
                <option value="late">{t("teacher.submissions.late")}</option>
                <option value="draft">{t("teacher.submissions.draft")}</option>
              </select>
            </div>

            {/* Plagiarism Risk Filter */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("teacher.submissions.plagiarismRisk")}
              </label>
              <select
                value={filterPlagiarism}
                onChange={(e) => setFilterPlagiarism(e.target.value as PlagiarismRisk | "all")}
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                <option value="all">{t("teacher.submissions.anyRisk")}</option>
                <option value="high">{t("teacher.submissions.high")}</option>
                <option value="medium">{t("teacher.submissions.medium")}</option>
                <option value="low">{t("teacher.submissions.low")}</option>
              </select>
            </div>

            {/* Student Search */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("teacher.submissions.studentSearch")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder={t("teacher.submissions.studentNamePlaceholder")}
                  className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Failed Checks Filter */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("common.additional")}
              </label>
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-border rounded-[12px] cursor-pointer hover:bg-muted transition-colors">
                <input
                  type="checkbox"
                  checked={filterFailedChecks}
                  onChange={(e) => setFilterFailedChecks(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-2 focus:ring-ring focus:ring-offset-0"
                />
                <span className="text-[15px] text-foreground">
                  {t("teacher.submissions.onlyWithErrors")}
                </span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[14px] text-muted-foreground">
              {t("teacher.submissions.foundSubmissions")}{" "}
              <strong className="text-foreground">{filteredSubmissions.length}</strong>
            </p>
            {(filterStatus !== "all" ||
              filterPlagiarism !== "all" ||
              filterFailedChecks ||
              searchStudent ||
              filterAssignment !== "all") && (
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterPlagiarism("all");
                  setFilterFailedChecks(false);
                  setFilterAssignment("all");
                  setSearchStudent("");
                }}
                className="flex items-center gap-2 px-3 py-2 text-brand-primary hover:bg-info-light rounded-[8px] transition-colors text-[14px]"
              >
                <X className="w-4 h-4" />
                {t("teacher.submissions.resetFilters")}
              </button>
            )}
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
          {filteredSubmissions.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-6 hover:bg-surface-hover transition-colors cursor-pointer"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[18px] font-medium text-foreground">
                          {submission.studentName}
                        </h3>
                        {getStatusBadge(submission.status)}
                        {getPlagiarismBadge(submission.plagiarismRisk)}
                        {hasFailedChecks(submission) && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-light text-error rounded-[6px] text-[12px] font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            {t("teacher.submissions.hasErrors")}
                          </span>
                        )}
                      </div>
                      <p className="text-[14px] text-muted-foreground mb-2">
                        {submission.assignmentTitle}
                      </p>
                      <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {t("teacher.submissions.files")}: {submission.files.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <History className="w-3 h-3" />v{submission.versions.length}
                        </span>
                        {submission.submittedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {submission.submittedAt.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Send className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                {t("teacher.submissions.noSubmissions")}
              </h3>
              <p className="text-[14px] text-muted-foreground">
                {t("teacher.submissions.tryChangingFilters")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Detail Drawer */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end"
          onClick={() => {
            setSelectedSubmission(null);
            setEditingNotes(false);
          }}
        >
          <div
            className="bg-card h-full w-full md:w-[700px] shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 bg-card border-b-2 border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-[20px] font-medium text-foreground">
                  {selectedSubmission.studentName}
                </h2>
                <p className="text-[13px] text-muted-foreground mt-1">
                  {selectedSubmission.assignmentTitle}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setEditingNotes(false);
                }}
                className="p-2 hover:bg-muted rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Status Summary */}
              <div className="bg-muted border-2 border-border rounded-[12px] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.submissions.statusLabel")}
                    </p>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.submissions.plagiarismRiskLabel")}
                    </p>
                    {getPlagiarismBadge(selectedSubmission.plagiarismRisk)}
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.submissions.submittedAt")}
                    </p>
                    <p className="text-[14px] text-foreground">
                      {selectedSubmission.submittedAt?.toLocaleString() ||
                        t("teacher.submissions.notSubmitted")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.submissions.deadlineLabel")}
                    </p>
                    <p className="text-[14px] text-foreground">
                      {selectedSubmission.deadline.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Files List */}
              <div>
                <h3 className="text-[16px] font-medium text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t("teacher.submissions.filesTitle")} ({selectedSubmission.files.length})
                </h3>
                <div className="space-y-2">
                  {selectedSubmission.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-muted border border-border rounded-[8px]"
                    >
                      <div className="flex-1">
                        <p className="text-[14px] font-medium text-foreground">{file.name}</p>
                        <p className="text-[12px] text-muted-foreground">
                          {file.size} • {t("teacher.submissions.uploadedAt")}{" "}
                          {file.uploadedAt.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(file.name)}
                        className="flex items-center gap-2 px-3 py-2 bg-brand-primary text-primary-foreground rounded-[8px] hover:bg-brand-primary-hover transition-colors text-[13px]"
                      >
                        <Download className="w-4 h-4" />
                        {t("teacher.submissions.downloadBtn")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Versions Timeline */}
              <div>
                <h3 className="text-[16px] font-medium text-foreground mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  {t("teacher.submissions.versionHistory")}
                </h3>
                <div className="space-y-3">
                  {selectedSubmission.versions.map((version, index) => (
                    <div
                      key={version.id}
                      className="relative pl-6 pb-3 border-l-2 border-border last:border-0"
                    >
                      <div className="absolute left-[-5px] top-0 w-2 h-2 bg-brand-primary rounded-full" />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[14px] font-medium text-foreground">
                            {t("teacher.submissions.versionLabel")} {version.version}
                            {index === selectedSubmission.versions.length - 1 && (
                              <span className="ml-2 text-[12px] text-success">
                                {t("teacher.submissions.current")}
                              </span>
                            )}
                          </p>
                          <p className="text-[13px] text-muted-foreground mt-1">
                            {version.changes}
                          </p>
                          <p className="text-[12px] text-muted-foreground mt-1">
                            {version.filesCount} {t("teacher.submissions.filesCount")} •{" "}
                            {version.submittedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plugin Reports */}
              <div>
                <h3 className="text-[16px] font-medium text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t("teacher.submissions.pluginReports")}
                </h3>
                <div className="space-y-3">
                  {selectedSubmission.pluginReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 bg-muted border-2 border-border rounded-[12px]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPluginIcon(report.pluginType)}
                          <h4 className="text-[14px] font-medium text-foreground">
                            {report.pluginName}
                          </h4>
                        </div>
                        {getPluginStatusBadge(report.status)}
                      </div>
                      <p className="text-[13px] text-foreground mb-2">{report.message}</p>
                      {report.score !== undefined && (
                        <p className="text-[13px] text-muted-foreground mb-2">
                          {t("teacher.submissions.scoreLabel")}:{" "}
                          <strong className="text-foreground">{report.score}%</strong>
                        </p>
                      )}
                      {report.details && (
                        <p className="text-[12px] text-muted-foreground mb-2">{report.details}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground">
                        {t("teacher.submissions.checkedAt")}: {report.timestamp.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Notes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-medium text-foreground flex items-center gap-2">
                    <StickyNote className="w-4 h-4" />
                    {t("teacher.submissions.teacherNotes")}
                  </h3>
                  {!editingNotes && (
                    <button
                      onClick={() => setEditingNotes(true)}
                      className="text-[14px] text-brand-primary hover:underline"
                    >
                      {t("teacher.submissions.editBtn")}
                    </button>
                  )}
                </div>
                <div className="p-4 bg-warning-light border-2 border-warning rounded-[12px]">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <p className="text-[12px] text-muted-foreground">
                      {t("teacher.submissions.notesVisibility")}
                    </p>
                  </div>
                  {editingNotes ? (
                    <div>
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder={t("teacher.submissions.notesPlaceholder")}
                        className="w-full px-3 py-2 border-2 border-border rounded-[8px] text-[14px] text-foreground focus:border-brand-primary focus:outline-none transition-colors min-h-[120px] resize-y"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleSaveNotes}
                          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-[8px] hover:bg-brand-primary-hover transition-colors text-[14px]"
                        >
                          <Save className="w-4 h-4" />
                          {t("teacher.submissions.saveBtn")}
                        </button>
                        <button
                          onClick={() => {
                            setEditingNotes(false);
                            setNotesText(selectedSubmission.teacherNotes);
                          }}
                          className="px-4 py-2 border-2 border-border text-foreground rounded-[8px] hover:bg-muted transition-colors text-[14px]"
                        >
                          {t("teacher.submissions.cancelBtn")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[14px] text-foreground leading-relaxed">
                      {selectedSubmission.teacherNotes || (
                        <span className="text-muted-foreground italic">
                          {t("teacher.submissions.noNotes")}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
