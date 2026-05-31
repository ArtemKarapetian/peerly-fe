import { AlertTriangle, Calendar, Check, Layers, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";

import { courseRepo } from "@/entities/course";

import { formatPublishDate } from "../lib/formatPublishDate";
import type { AssignmentFormData } from "../model/types";

import { PublishActions } from "./PublishActions";
import { SummaryCard, SummaryField } from "./SummaryCard";

interface StepPublishProps {
  data: AssignmentFormData;
  onPublish: (asDraft: boolean) => void;
  submitting?: boolean;
  errorMessage?: string | null;
  mode?: "create" | "edit";
  isDirty?: boolean;
}

export function StepPublish({
  data,
  onPublish,
  submitting = false,
  errorMessage,
  mode = "create",
  isDirty = true,
}: StepPublishProps) {
  const { t } = useTranslation();
  const { data: courses } = useAsync(() => courseRepo.getAll(), []);
  const course = (courses ?? []).find((c) => c.id === data.courseId);
  const notSpecified = t("feature.assignmentCreate.publish.notSpecified");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px] mb-2">
        {t("feature.assignmentCreate.publish.title")}
      </h2>

      <div className="space-y-4">
        <SummaryCard icon={Check} title={t("feature.assignmentCreate.publish.basicInfo")}>
          <SummaryField label={t("feature.assignmentCreate.publish.courseLabel")}>
            {course?.name || t("feature.assignmentCreate.publish.courseNotSelected")}
          </SummaryField>
          <SummaryField label={t("feature.assignmentCreate.publish.titleLabel")}>
            {data.title || notSpecified}
          </SummaryField>
          {data.description && (
            <SummaryField label={t("feature.assignmentCreate.publish.descriptionLabel")}>
              <p className="text-13 text-foreground line-clamp-3">{data.description}</p>
            </SummaryField>
          )}
        </SummaryCard>

        <SummaryCard icon={Calendar} title={t("feature.assignmentCreate.publish.deadlines")}>
          <SummaryField label={t("feature.assignmentCreate.publish.submissionDeadline")}>
            {formatPublishDate(data.submissionDeadline, notSpecified)}
          </SummaryField>
          <SummaryField label={t("feature.assignmentCreate.publish.reviewDeadline")}>
            {formatPublishDate(data.reviewDeadline, notSpecified)}
          </SummaryField>
        </SummaryCard>

        <SummaryCard icon={Layers} title={t("feature.assignmentCreate.publish.rubricLabel")}>
          <p className="text-sm text-foreground">
            {data.rubricName || t("feature.assignmentCreate.publish.rubricNotSelected")}
          </p>
        </SummaryCard>

        <SummaryCard icon={Users} title={t("feature.assignmentCreate.publish.peerReviewLabel")}>
          <SummaryField label={t("feature.assignmentCreate.publish.reviewsPerSubmission")}>
            {data.reviewsPerSubmission}
          </SummaryField>
          <SummaryField label={t("feature.assignmentCreate.publish.discrepancyThreshold")}>
            {t("feature.assignmentCreate.publish.discrepancyValue", {
              count: data.discrepancyThreshold,
            })}
          </SummaryField>
        </SummaryCard>
      </div>

      <div className="bg-warning-light border border-warning rounded-md p-4">
        <p className="text-13 text-foreground">
          <strong>{t("feature.assignmentCreate.publish.warningAttention")}</strong>{" "}
          {t("feature.assignmentCreate.publish.warningText")}
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 bg-destructive-light border border-destructive rounded-md p-4">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-13 text-foreground">{errorMessage}</p>
        </div>
      )}

      <PublishActions mode={mode} isDirty={isDirty} submitting={submitting} onPublish={onPublish} />
    </div>
  );
}
