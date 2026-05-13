import { AlertTriangle, Calendar, Check, Layers, Save, Send, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";

import { courseRepo } from "@/entities/course";

import type { AssignmentFormData } from "../model/types";

interface StepPublishProps {
  data: AssignmentFormData;
  onPublish: (asDraft: boolean) => void;
  submitting?: boolean;
  errorMessage?: string | null;
}

export function StepPublish({ data, onPublish, submitting, errorMessage }: StepPublishProps) {
  const { t } = useTranslation();
  const { data: courses } = useAsync(() => courseRepo.getAll(), []);
  const course = (courses ?? []).find((c) => c.id === data.courseId);

  const formatDate = (date: Date | null) => {
    if (!date) return t("feature.assignmentCreate.publish.notSpecified");
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.publish.title")}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {t("feature.assignmentCreate.publish.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Check className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-[16px] font-medium text-foreground">
              {t("feature.assignmentCreate.publish.basicInfo")}
            </h3>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-border space-y-3">
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.courseLabel")}
              </p>
              <p className="text-[14px] text-foreground font-medium">
                {course?.title || t("feature.assignmentCreate.publish.courseNotSelected")}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.titleLabel")}
              </p>
              <p className="text-[14px] text-foreground font-medium">
                {data.title || t("feature.assignmentCreate.publish.notSpecified")}
              </p>
            </div>
            {data.description && (
              <div>
                <p className="text-[12px] text-muted-foreground mb-1">
                  {t("feature.assignmentCreate.publish.descriptionLabel")}
                </p>
                <p className="text-[13px] text-foreground line-clamp-3">{data.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-[16px] font-medium text-foreground">
              {t("feature.assignmentCreate.publish.deadlines")}
            </h3>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-border space-y-3">
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.submissionDeadline")}
              </p>
              <p className="text-[14px] text-foreground">{formatDate(data.submissionDeadline)}</p>
            </div>
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.reviewDeadline")}
              </p>
              <p className="text-[14px] text-foreground">{formatDate(data.reviewDeadline)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-[16px] font-medium text-foreground">
              {t("feature.assignmentCreate.publish.rubricLabel")}
            </h3>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-border">
            <p className="text-[14px] text-foreground">
              {data.rubricName || t("feature.assignmentCreate.publish.rubricNotSelected")}
            </p>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-[16px] font-medium text-foreground">
              {t("feature.assignmentCreate.publish.peerReviewLabel")}
            </h3>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-border space-y-3">
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.reviewsPerSubmission")}
              </p>
              <p className="text-[14px] text-foreground">{data.reviewsPerSubmission}</p>
            </div>
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.discrepancyThreshold")}
              </p>
              <p className="text-[14px] text-foreground">{data.discrepancyThreshold}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-warning-light border border-warning rounded-[12px] p-4">
        <p className="text-[13px] text-foreground">
          <strong>{t("feature.assignmentCreate.publish.warningAttention")}</strong>{" "}
          {t("feature.assignmentCreate.publish.warningText")}
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 bg-destructive-light border border-destructive rounded-[12px] p-4">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-[13px] text-foreground">{errorMessage}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={() => onPublish(true)}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-border text-foreground rounded-[12px] hover:bg-muted transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {t("feature.assignmentCreate.publish.saveDraft")}
        </button>
        <button
          onClick={() => onPublish(false)}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          {submitting
            ? t("feature.assignmentCreate.publish.publishing")
            : t("feature.assignmentCreate.publish.publishAssignment")}
        </button>
      </div>

      <div className="text-center">
        <p className="text-[13px] text-muted-foreground">
          {t("feature.assignmentCreate.publish.draftsInfo")}
          <br />
          {t("feature.assignmentCreate.publish.publishedInfo")}
        </p>
      </div>
    </div>
  );
}
