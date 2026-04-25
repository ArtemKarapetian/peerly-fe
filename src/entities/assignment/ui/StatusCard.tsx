import {
  Clock,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  History,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export type TaskStatus =
  | "NOT_STARTED"
  | "SUBMITTED"
  | "PEER_REVIEW"
  | "TEACHER_REVIEW"
  | "GRADING"
  | "GRADED"
  | "OVERDUE";

interface StatusCardProps {
  status: TaskStatus;
  deadline: string;
  courseId: string;
  taskId: string;
  hasSubmission?: boolean; // Has any work (draft or final)
  isDraft?: boolean; // Current work is draft
  allowResubmissions?: boolean; // Allows resubmitting
  onStatusChange?: (status: TaskStatus) => void;
}

export function StatusCard({
  status,
  deadline,
  courseId,
  taskId,
  hasSubmission,
  isDraft: _isDraft,
  allowResubmissions,
  onStatusChange,
}: StatusCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusInfo = () => {
    switch (status) {
      case "NOT_STARTED":
        return {
          label: t("entity.assignment.statusNotStarted"),
          color: "bg-muted",
          textColor: "text-muted-foreground",
        };
      case "SUBMITTED":
        return {
          label: t("entity.assignment.statusSubmitted"),
          color: "bg-info-light",
          textColor: "text-foreground",
        };
      case "PEER_REVIEW":
        return {
          label: t("entity.assignment.statusPeerReview"),
          color: "bg-info-light",
          textColor: "text-foreground",
        };
      case "TEACHER_REVIEW":
        return {
          label: t("entity.assignment.statusTeacherReview"),
          color: "bg-warning-light",
          textColor: "text-foreground",
        };
      case "GRADING":
        return {
          label: t("entity.assignment.statusGrading"),
          color: "bg-muted",
          textColor: "text-muted-foreground",
        };
      case "GRADED":
        return {
          label: t("entity.assignment.statusGraded"),
          color: "bg-success-light",
          textColor: "text-foreground",
        };
      case "OVERDUE":
        return {
          label: t("entity.assignment.statusOverdue"),
          color: "bg-error-light",
          textColor: "text-foreground",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Peer review assignments (mock data)
  const peerReviewAssignments = [
    {
      id: 1,
      studentName: "Ivan Ivanov",
      submitted: true,
      reviewed: false,
    },
    {
      id: 2,
      studentName: "Maria Petrova",
      submitted: true,
      reviewed: false,
    },
  ];

  const myWorkReviewProgress = { completed: 1, total: 2 };

  return (
    <div>
      <div className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
        <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-text-primary mb-4">
          {t("entity.assignment.statusAndActions")}
        </h2>

        <div
          className={`${statusInfo.color} px-4 py-2 rounded-[12px] mb-4 desktop:mb-6 inline-block`}
        >
          <span
            className={`text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] ${statusInfo.textColor}`}
          >
            {statusInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4 desktop:mb-6 pb-4 border-b border-border">
          <Clock className="size-5 text-muted-foreground" />
          <div>
            <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-text-tertiary">
              {t("entity.assignment.deadline")}
            </p>
            <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-text-primary">
              {deadline}
            </p>
          </div>
        </div>

        {status === "NOT_STARTED" && (
          <div>
            <h3 className="text-[16px] desktop:text-[18px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.54px] text-text-primary mb-3">
              {t("entity.assignment.submitWork")}
            </h3>

            <button
              className="w-full bg-brand-primary hover:bg-brand-primary-hover transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-medium text-text-inverse flex items-center justify-center gap-2 mb-3"
              onClick={() => {
                // Navigate to submit page
                void navigate(`/student/courses/${courseId}/tasks/${taskId}/submit`);
              }}
            >
              <Upload className="size-4" />
              <span>{t("entity.assignment.submitWork")}</span>
            </button>

            {hasSubmission && (
              <button
                onClick={() => {
                  void navigate(`/student/courses/${courseId}/tasks/${taskId}/submissions`);
                }}
                className="w-full text-center text-[13px] text-brand-primary hover:text-brand-primary-hover font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
              >
                <History className="size-4" />
                <span>{t("entity.assignment.versionHistory")}</span>
              </button>
            )}
          </div>
        )}

        {status === "SUBMITTED" && (
          <div>
            <div className="bg-info-light rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 text-text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-text-primary mb-1">
                    {t("entity.assignment.workSubmitted")}
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-text-secondary">
                    {t("entity.assignment.awaitingReviewers")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FileText className="size-4 text-text-secondary" />
              <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-text-secondary">
                essay_final.pdf
              </p>
            </div>

            {allowResubmissions && (
              <button
                onClick={() => {
                  void navigate(`/student/courses/${courseId}/tasks/${taskId}/submit`);
                }}
                className="w-full bg-card border-2 border-border hover:border-brand-primary-lighter hover:bg-surface-hover transition-colors py-2 desktop:py-3 rounded-[12px] text-[13px] desktop:text-[14px] font-medium text-text-primary mb-3"
              >
                {t("entity.assignment.uploadNewVersion")}
              </button>
            )}

            <button
              onClick={() => {
                void navigate(`/student/courses/${courseId}/tasks/${taskId}/submissions`);
              }}
              className="w-full text-center text-[13px] text-brand-primary hover:text-brand-primary-hover font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <History className="size-4" />
              <span>{t("entity.assignment.versionHistory")}</span>
            </button>
          </div>
        )}

        {status === "PEER_REVIEW" && (
          <div>
            <div className="mb-6">
              <h3 className="text-[15px] desktop:text-[16px] font-['Work_Sans:Medium',sans-serif] text-text-primary mb-3">
                {t("entity.assignment.yourWorkBeingReviewed")}
              </h3>

              <div className="bg-card rounded-[12px] p-4 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-text-secondary">
                    {t("entity.assignment.reviewProgress")}
                  </span>
                  <span className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-text-primary">
                    {myWorkReviewProgress.completed}/{myWorkReviewProgress.total}
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-info h-2 rounded-full transition-all"
                    style={{
                      width: `${(myWorkReviewProgress.completed / myWorkReviewProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-text-tertiary">
                {myWorkReviewProgress.total - myWorkReviewProgress.completed}{" "}
                {t("entity.assignment.reviewerNotFinished_other")}
              </p>
            </div>

            <div>
              <h3 className="text-[15px] desktop:text-[16px] font-['Work_Sans:Medium',sans-serif] text-text-primary mb-3">
                {t("entity.assignment.youNeedToReview")}
              </h3>

              <div className="space-y-2 mb-4">
                {peerReviewAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-card rounded-[12px] p-3 border border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-brand-primary-lighter flex items-center justify-center">
                          <User className="size-4 text-text-primary" />
                        </div>
                        <div>
                          <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-text-primary">
                            {assignment.studentName}
                          </p>
                          <p className="text-[11px] desktop:text-[12px] font-['Work_Sans:Regular',sans-serif] text-text-tertiary">
                            {assignment.reviewed
                              ? t("entity.assignment.reviewed")
                              : t("entity.assignment.awaitingReview")}
                          </p>
                        </div>
                      </div>

                      {assignment.reviewed ? (
                        <CheckCircle className="size-5 text-success" />
                      ) : (
                        <AlertCircle className="size-5 text-error" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  // Navigate to reviews inbox
                  void navigate("/student/reviews");
                }}
                className="w-full bg-brand-primary-lighter hover:bg-info-light transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] text-text-primary flex items-center justify-center gap-2"
              >
                {t("entity.assignment.startReview")}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {status === "TEACHER_REVIEW" && (
          <div className="bg-info-light rounded-[12px] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-text-primary mb-1">
                  {t("entity.assignment.peerReviewCompleted")}
                </p>
                <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-text-secondary">
                  {t("entity.assignment.teacherReviewingWork")}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === "GRADING" && (
          <div>
            <div className="bg-warning-light rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-text-primary mb-1">
                    {t("entity.assignment.draftSaved")}
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-text-secondary">
                    {t("entity.assignment.dontForgetSubmit")}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="w-full bg-brand-primary hover:bg-brand-primary-hover transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-medium text-text-inverse flex items-center justify-center gap-2 mb-3"
              onClick={() => {
                void navigate(`/student/courses/${courseId}/tasks/${taskId}/submit`);
              }}
            >
              <Upload className="size-4" />
              <span>{t("entity.assignment.continueWork")}</span>
            </button>

            <button
              onClick={() => {
                void navigate(`/student/courses/${courseId}/tasks/${taskId}/submissions`);
              }}
              className="w-full text-center text-[13px] text-brand-primary hover:text-brand-primary-hover font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <History className="size-4" />
              <span>{t("entity.assignment.versionHistory")}</span>
            </button>
          </div>
        )}

        {status === "GRADED" && (
          <div>
            <div className="bg-success-light rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 text-text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-text-primary mb-1">
                    {t("entity.assignment.gradeAssigned")}
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-text-secondary">
                    {t("entity.assignment.scoreReceived")}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                void navigate("/student/reviews/received");
              }}
              className="w-full bg-brand-primary-lighter hover:bg-info-light transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] text-text-primary mb-3"
            >
              {t("entity.assignment.viewFeedback")}
            </button>

            <button
              onClick={() => {
                void navigate(`/student/courses/${courseId}/tasks/${taskId}/appeal`);
              }}
              className="w-full text-center text-[13px] text-brand-primary hover:text-brand-primary-hover font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="size-4" />
              <span>{t("entity.assignment.requestGradeReview")}</span>
            </button>
          </div>
        )}

        {status === "OVERDUE" && (
          <div className="bg-error-light rounded-[12px] p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-text-primary mb-1">
                  {t("entity.assignment.deadlineExpired")}
                </p>
                <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-text-secondary">
                  {t("entity.assignment.contactTeacher")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {onStatusChange && (
        <div className="bg-card border border-border rounded-[12px] p-4">
          <p className="text-[12px] font-['Work_Sans:Medium',sans-serif] text-text-tertiary mb-2">
            {t("entity.assignment.demoSelectStatus")}
          </p>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 bg-card border border-border rounded-[8px] text-[13px] font-['Work_Sans:Regular',sans-serif] text-text-primary"
          >
            <option value="NOT_STARTED">{t("entity.assignment.optionNotStarted")}</option>
            <option value="SUBMITTED">{t("entity.assignment.optionSubmitted")}</option>
            <option value="PEER_REVIEW">{t("entity.assignment.optionPeerReview")}</option>
            <option value="TEACHER_REVIEW">{t("entity.assignment.optionTeacherReview")}</option>
            <option value="GRADING">{t("entity.assignment.optionGrading")}</option>
            <option value="GRADED">{t("entity.assignment.optionGraded")}</option>
            <option value="OVERDUE">{t("entity.assignment.optionOverdue")}</option>
          </select>
        </div>
      )}
    </div>
  );
}
