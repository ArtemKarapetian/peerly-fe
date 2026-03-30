import { X, FileText, MessageSquare, Clock, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Appeal, getReasonLabel, getStatusColor, getStatusLabel } from "@/entities/appeal";

interface AppealDetailDrawerProps {
  appeal: Appeal;
  onClose: () => void;
}

export function AppealDetailDrawer({ appeal, onClose }: AppealDetailDrawerProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[600px] bg-card z-50 overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b-2 border-border z-10">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-[20px] font-medium text-foreground">
              {t("widget.appealDetailDrawer.title")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-[8px] transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status Badge */}
          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded-[8px] text-[13px] font-medium uppercase tracking-wide border ${getStatusColor(appeal.status)}`}
            >
              {getStatusLabel(appeal.status)}
            </span>
          </div>

          {/* Course & Task Info */}
          <div className="bg-muted rounded-[12px] p-4 mb-6">
            <div className="space-y-2">
              <div>
                <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                  {t("widget.appealDetailDrawer.course")}
                </p>
                <p className="text-[15px] font-medium text-foreground">{appeal.courseName}</p>
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                  {t("widget.appealDetailDrawer.assignment")}
                </p>
                <p className="text-[15px] font-medium text-foreground">{appeal.taskName}</p>
              </div>
            </div>
          </div>

          {/* Score Info */}
          {appeal.currentScore !== undefined && (
            <div className="bg-muted rounded-[12px] p-4 mb-6">
              <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-2">
                {t("widget.appealDetailDrawer.scoreInfo")}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-muted-foreground">
                  {t("widget.appealDetailDrawer.currentScore")}
                </span>
                <span className="text-[20px] font-medium text-foreground">
                  {appeal.currentScore} / {appeal.maxScore}
                </span>
              </div>
              {appeal.reviewCount !== undefined && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[14px] text-muted-foreground">
                    {t("widget.appealDetailDrawer.reviewsReceived")}
                  </span>
                  <span className="text-[16px] font-medium text-foreground">
                    {appeal.reviewCount}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Appeal Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-[16px] font-medium text-foreground">
                {t("widget.appealDetailDrawer.appealReason")}
              </h3>
            </div>
            <p className="text-[14px] text-foreground bg-muted px-4 py-2 rounded-[8px]">
              {getReasonLabel(appeal.reason)}
            </p>
          </div>

          {/* Message */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-[16px] font-medium text-foreground">
                {t("widget.appealDetailDrawer.problemDescription")}
              </h3>
            </div>
            <div className="bg-muted rounded-[12px] p-4">
              <p className="text-[14px] text-foreground whitespace-pre-wrap">{appeal.message}</p>
            </div>
          </div>

          {/* Attachment */}
          {appeal.attachmentName && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-[16px] font-medium text-foreground">
                  {t("widget.appealDetailDrawer.attachment")}
                </h3>
              </div>
              <div className="bg-muted rounded-[12px] p-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-accent-foreground" />
                <span className="text-[14px] text-foreground font-medium">
                  {appeal.attachmentName}
                </span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-[16px] font-medium text-foreground">
                {t("widget.appealDetailDrawer.history")}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-[14px] text-foreground font-medium">
                    {t("widget.appealDetailDrawer.appealCreated")}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {new Date(appeal.createdAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {appeal.status !== "new" && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-[14px] text-foreground font-medium">
                      {t("widget.appealDetailDrawer.takenForReview")}
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      {new Date(appeal.updatedAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Response */}
          {appeal.teacherResponse ? (
            <div className="bg-accent/10 border-2 border-accent rounded-[12px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-accent-foreground" />
                <h3 className="text-[16px] font-medium text-foreground">
                  {t("widget.appealDetailDrawer.teacherResponse")}
                </h3>
              </div>
              <p className="text-[14px] text-foreground mb-3 whitespace-pre-wrap">
                {appeal.teacherResponse.message}
              </p>
              {appeal.teacherResponse.newScore !== undefined && (
                <div className="bg-card rounded-[8px] p-3 mt-3">
                  <p className="text-[13px] text-muted-foreground mb-1">
                    {t("widget.appealDetailDrawer.newScore")}
                  </p>
                  <p className="text-[20px] font-medium text-foreground">
                    {appeal.teacherResponse.newScore} / {appeal.maxScore}
                  </p>
                </div>
              )}
              <p className="text-[12px] text-muted-foreground mt-3">
                {appeal.teacherResponse.respondedBy} &bull;{" "}
                {new Date(appeal.teacherResponse.respondedAt).toLocaleDateString("ru-RU")}
              </p>
            </div>
          ) : (
            <div className="bg-muted rounded-[12px] p-5 text-center">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-[14px] text-muted-foreground">
                {appeal.status === "new"
                  ? t("widget.appealDetailDrawer.awaitingTeacher")
                  : t("widget.appealDetailDrawer.teacherReviewing")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
