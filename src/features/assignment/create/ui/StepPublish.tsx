import { Check, Calendar, Users, Layers, Shield, Save, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";

import { courseRepo } from "@/entities/course";

import type { AssignmentFormData } from "../model/types";

/**
 * StepPublish - Шаг 6: Публикация
 *
 * - Итоговая сводка всех настроек
 * - Кнопки "Опубликовать" и "Сохранить черновик"
 */

interface StepPublishProps {
  data: AssignmentFormData;
  onPublish: (asDraft: boolean) => void;
}

export function StepPublish({ data, onPublish }: StepPublishProps) {
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

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "text":
        return t("feature.assignmentCreate.publish.typeText");
      case "code":
        return t("feature.assignmentCreate.publish.typeCode");
      case "project":
        return t("feature.assignmentCreate.publish.typeProject");
      case "files":
        return t("feature.assignmentCreate.publish.typeFiles");
      default:
        return type;
    }
  };

  const getDistributionLabel = (mode: string) => {
    switch (mode) {
      case "random":
        return t("feature.assignmentCreate.publish.distributionRandom");
      case "skill-based":
        return t("feature.assignmentCreate.publish.distributionSkillBased");
      case "manual":
        return t("feature.assignmentCreate.publish.distributionManual");
      default:
        return mode;
    }
  };

  const getAnonymityLabel = (mode: string) => {
    switch (mode) {
      case "full":
        return t("feature.assignmentCreate.publish.anonymityFull");
      case "partial":
        return t("feature.assignmentCreate.publish.anonymityPartial");
      case "none":
        return t("feature.assignmentCreate.publish.anonymityNone");
      default:
        return mode;
    }
  };

  const enabledPlugins = [
    data.enablePlagiarismCheck &&
      t("feature.assignmentCreate.publish.pluginPlagiarism", {
        threshold: data.plagiarismThreshold,
      }),
    data.enableLinter && t("feature.assignmentCreate.publish.pluginLinter"),
    data.enableFormatCheck && t("feature.assignmentCreate.publish.pluginFormatCheck"),
    data.enableAnonymization && t("feature.assignmentCreate.publish.pluginAnonymization"),
  ].filter(Boolean);

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

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Check className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.publish.basicInfo")}
              </h3>
            </div>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-border space-y-3">
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.courseLabel")}
              </p>
              <p className="text-[14px] text-foreground font-medium">
                {course?.name || t("feature.assignmentCreate.publish.courseNotSelected")}
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
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.taskTypeLabel")}
              </p>
              <p className="text-[14px] text-foreground">{getTaskTypeLabel(data.taskType)}</p>
            </div>
            {data.description && (
              <div>
                <p className="text-[12px] text-muted-foreground mb-1">
                  {t("feature.assignmentCreate.publish.descriptionLabel")}
                </p>
                <p className="text-[13px] text-foreground line-clamp-3">{data.description}</p>
              </div>
            )}
            {data.attachments.length > 0 && (
              <div>
                <p className="text-[12px] text-muted-foreground mb-1">
                  {t("feature.assignmentCreate.publish.attachmentsLabel")}
                </p>
                <p className="text-[13px] text-foreground">
                  {data.attachments.length}{" "}
                  {data.attachments.length === 1
                    ? t("feature.assignmentCreate.publish.fileOne")
                    : t("feature.assignmentCreate.publish.fileMany")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Deadlines */}
        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.publish.deadlines")}
              </h3>
            </div>
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
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.latePolicyLabel")}
              </p>
              <p className="text-[14px] text-foreground">
                {data.latePolicy === "soft"
                  ? t("feature.assignmentCreate.publish.latePolicySoft", {
                      penalty: data.latePenalty,
                    })
                  : t("feature.assignmentCreate.publish.latePolicyHard")}
              </p>
            </div>
          </div>
        </div>

        {/* Rubric */}
        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.publish.rubricLabel")}
              </h3>
            </div>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-border">
            <p className="text-[14px] text-foreground">
              {data.rubricName || t("feature.assignmentCreate.publish.rubricNotSelected")}
            </p>
          </div>
        </div>

        {/* Peer Review Settings */}
        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.publish.peerReviewLabel")}
              </h3>
            </div>
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
                {t("feature.assignmentCreate.publish.distributionLabel")}
              </p>
              <p className="text-[14px] text-foreground">
                {getDistributionLabel(data.distributionMode)}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.anonymityLabel")}
              </p>
              <p className="text-[14px] text-foreground">{getAnonymityLabel(data.anonymityMode)}</p>
            </div>
            <div>
              <p className="text-[12px] text-muted-foreground mb-1">
                {t("feature.assignmentCreate.publish.reassignmentLabel")}
              </p>
              <p className="text-[14px] text-foreground">
                {data.allowReassignment
                  ? t("feature.assignmentCreate.publish.reassignmentAllowed")
                  : t("feature.assignmentCreate.publish.reassignmentForbidden")}
              </p>
            </div>
          </div>
        </div>

        {/* Plugins */}
        <div className="bg-card border-2 border-border rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-primary-light rounded-[8px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.publish.pluginsLabel")}
              </h3>
            </div>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-border">
            {enabledPlugins.length === 0 ? (
              <p className="text-[14px] text-muted-foreground">
                {t("feature.assignmentCreate.publish.noPlugins")}
              </p>
            ) : (
              <ul className="space-y-2">
                {enabledPlugins.map((plugin, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-[14px] text-foreground">{plugin}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-warning-light border border-warning rounded-[12px] p-4">
        <p className="text-[13px] text-foreground">
          <strong>{t("feature.assignmentCreate.publish.warningAttention")}</strong>{" "}
          {t("feature.assignmentCreate.publish.warningText")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={() => onPublish(true)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-border text-foreground rounded-[12px] hover:bg-muted transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          {t("feature.assignmentCreate.publish.saveDraft")}
        </button>
        <button
          onClick={() => onPublish(false)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium text-[16px]"
        >
          <Send className="w-5 h-5" />
          {t("feature.assignmentCreate.publish.publishAssignment")}
        </button>
      </div>

      {/* Help Text */}
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
