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

  const getStatusInfo = () => {
    switch (status) {
      case "NOT_STARTED":
        return {
          label: t("entity.assignment.statusNotStarted"),
          color: "bg-[#e4e4e4]",
          textColor: "text-[#4b4963]",
        };
      case "SUBMITTED":
        return {
          label: t("entity.assignment.statusSubmitted"),
          color: "bg-[#b7bdff]",
          textColor: "text-[#21214f]",
        };
      case "PEER_REVIEW":
        return {
          label: t("entity.assignment.statusPeerReview"),
          color: "bg-[#b0e9fb]",
          textColor: "text-[#21214f]",
        };
      case "TEACHER_REVIEW":
        return {
          label: t("entity.assignment.statusTeacherReview"),
          color: "bg-[#ffd4a3]",
          textColor: "text-[#21214f]",
        };
      case "GRADING":
        return {
          label: t("entity.assignment.statusGrading"),
          color: "bg-[#e6e8ee]",
          textColor: "text-[#4b4963]",
        };
      case "GRADED":
        return {
          label: t("entity.assignment.statusGraded"),
          color: "bg-[#9cf38d]",
          textColor: "text-[#21214f]",
        };
      case "OVERDUE":
        return {
          label: t("entity.assignment.statusOverdue"),
          color: "bg-[#ffb8b8]",
          textColor: "text-[#21214f]",
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
      <div className="bg-[#f9f9f9] rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
        <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-[#21214f] mb-4">
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

        {/* Deadline */}
        <div className="flex items-center gap-2 mb-4 desktop:mb-6 pb-4 border-b border-[#c7c7c7]">
          <Clock className="size-5 text-[#4b4963]" />
          <div>
            <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#767692]">
              {t("entity.assignment.deadline")}
            </p>
            <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f]">
              {deadline}
            </p>
          </div>
        </div>

        {/* Status-specific content */}
        {status === "NOT_STARTED" && (
          <div>
            <h3 className="text-[16px] desktop:text-[18px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.54px] text-[#21214f] mb-3">
              {t("entity.assignment.submitWork")}
            </h3>

            <button
              className="w-full bg-[#3d6bc6] hover:bg-[#2d5bb6] transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-medium text-white flex items-center justify-center gap-2 mb-3"
              onClick={() => {
                // Navigate to submit page
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submit`;
              }}
            >
              <Upload className="size-4" />
              <span>{t("entity.assignment.submitWork")}</span>
            </button>

            {/* History link - show if has any work */}
            {hasSubmission && (
              <button
                onClick={() => {
                  window.location.hash = `/courses/${courseId}/tasks/${taskId}/submissions`;
                }}
                className="w-full text-center text-[13px] text-[#5b8def] hover:text-[#3d6bc6] font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
              >
                <History className="size-4" />
                <span>{t("entity.assignment.versionHistory")}</span>
              </button>
            )}
          </div>
        )}

        {status === "SUBMITTED" && (
          <div>
            <div className="bg-[#e9f5ff] rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 text-[#21214f] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                    {t("entity.assignment.workSubmitted")}
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                    {t("entity.assignment.awaitingReviewers")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FileText className="size-4 text-[#4b4963]" />
              <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                essay_final.pdf
              </p>
            </div>

            {allowResubmissions && (
              <button
                onClick={() => {
                  window.location.hash = `/courses/${courseId}/tasks/${taskId}/submit`;
                }}
                className="w-full bg-white border-2 border-[#d2def8] hover:border-[#a0b8f1] hover:bg-[#f9f9f9] transition-colors py-2 desktop:py-3 rounded-[12px] text-[13px] desktop:text-[14px] font-medium text-[#21214f] mb-3"
              >
                {t("entity.assignment.uploadNewVersion")}
              </button>
            )}

            <button
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submissions`;
              }}
              className="w-full text-center text-[13px] text-[#5b8def] hover:text-[#3d6bc6] font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <History className="size-4" />
              <span>{t("entity.assignment.versionHistory")}</span>
            </button>
          </div>
        )}

        {status === "PEER_REVIEW" && (
          <div>
            {/* Your work being reviewed */}
            <div className="mb-6">
              <h3 className="text-[15px] desktop:text-[16px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-3">
                {t("entity.assignment.yourWorkBeingReviewed")}
              </h3>

              <div className="bg-white rounded-[12px] p-4 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                    {t("entity.assignment.reviewProgress")}
                  </span>
                  <span className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f]">
                    {myWorkReviewProgress.completed}/{myWorkReviewProgress.total}
                  </span>
                </div>

                <div className="w-full bg-[#e4e4e4] rounded-full h-2">
                  <div
                    className="bg-[#b0e9fb] h-2 rounded-full transition-all"
                    style={{
                      width: `${(myWorkReviewProgress.completed / myWorkReviewProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#767692]">
                {myWorkReviewProgress.total - myWorkReviewProgress.completed}{" "}
                {t("entity.assignment.reviewerNotFinished_other")}
              </p>
            </div>

            {/* Reviews you need to do */}
            <div>
              <h3 className="text-[15px] desktop:text-[16px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-3">
                {t("entity.assignment.youNeedToReview")}
              </h3>

              <div className="space-y-2 mb-4">
                {peerReviewAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white rounded-[12px] p-3 border border-[#c7c7c7]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-[#d2def8] flex items-center justify-center">
                          <User className="size-4 text-[#21214f]" />
                        </div>
                        <div>
                          <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#21214f]">
                            {assignment.studentName}
                          </p>
                          <p className="text-[11px] desktop:text-[12px] font-['Work_Sans:Regular',sans-serif] text-[#767692]">
                            {assignment.reviewed
                              ? t("entity.assignment.reviewed")
                              : t("entity.assignment.awaitingReview")}
                          </p>
                        </div>
                      </div>

                      {assignment.reviewed ? (
                        <CheckCircle className="size-5 text-[#9cf38d]" />
                      ) : (
                        <AlertCircle className="size-5 text-[#ffb8b8]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  // Navigate to reviews inbox
                  window.location.hash = "/reviews";
                }}
                className="w-full bg-[#d2def8] hover:bg-[#b7bdff] transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] flex items-center justify-center gap-2"
              >
                {t("entity.assignment.startReview")}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {status === "TEACHER_REVIEW" && (
          <div className="bg-[#e9f5ff] rounded-[12px] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-[#21214f] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                  {t("entity.assignment.peerReviewCompleted")}
                </p>
                <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                  {t("entity.assignment.teacherReviewingWork")}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === "GRADING" && (
          <div>
            <div className="bg-[#fff8e1] rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-[#f57c00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                    {t("entity.assignment.draftSaved")}
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                    {t("entity.assignment.dontForgetSubmit")}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="w-full bg-[#3d6bc6] hover:bg-[#2d5bb6] transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-medium text-white flex items-center justify-center gap-2 mb-3"
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submit`;
              }}
            >
              <Upload className="size-4" />
              <span>{t("entity.assignment.continueWork")}</span>
            </button>

            <button
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submissions`;
              }}
              className="w-full text-center text-[13px] text-[#5b8def] hover:text-[#3d6bc6] font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <History className="size-4" />
              <span>{t("entity.assignment.versionHistory")}</span>
            </button>
          </div>
        )}

        {status === "GRADED" && (
          <div>
            <div className="bg-[#e9f9e6] rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 text-[#21214f] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                    {t("entity.assignment.gradeAssigned")}
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                    {t("entity.assignment.scoreReceived")}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                window.location.hash = "/reviews/received";
              }}
              className="w-full bg-[#d2def8] hover:bg-[#b7bdff] transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] mb-3"
            >
              {t("entity.assignment.viewFeedback")}
            </button>

            <button
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/appeal`;
              }}
              className="w-full text-center text-[13px] text-[#5b8def] hover:text-[#3d6bc6] font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="size-4" />
              <span>{t("entity.assignment.requestGradeReview")}</span>
            </button>
          </div>
        )}

        {status === "OVERDUE" && (
          <div className="bg-[#ffe9e9] rounded-[12px] p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-[#21214f] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                  {t("entity.assignment.deadlineExpired")}
                </p>
                <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                  {t("entity.assignment.contactTeacher")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo status selector (remove in production) */}
      {onStatusChange && (
        <div className="bg-white border border-[#c7c7c7] rounded-[12px] p-4">
          <p className="text-[12px] font-['Work_Sans:Medium',sans-serif] text-[#767692] mb-2">
            {t("entity.assignment.demoSelectStatus")}
          </p>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 bg-white border border-[#c7c7c7] rounded-[8px] text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#21214f]"
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
