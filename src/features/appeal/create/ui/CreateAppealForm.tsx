import { AlertCircle, FileText, Upload, MessageSquare, Clock, Users, Target } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AppealReason, appealRepo } from "@/entities/appeal";

import { validateAppealMessage } from "../model/validation";

export type CreateAppealContext = {
  courseName: string;
  taskName: string;
  currentScore: number;
  maxScore: number;
  reviewCount: number;
  deadline: string;
};

type Props = {
  studentId: string;
  courseId: string;
  taskId: string;
  context: CreateAppealContext;

  // навигацию/переходы держим в Page, поэтому тут колбеки:
  onCancel: () => void;
  onSuccess: () => void; // скажем Page показать success-экран
};

export function CreateAppealForm({
  studentId,
  courseId,
  taskId,
  context,
  onCancel,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const [reason, setReason] = useState<AppealReason>("unfair_score");
  const [message, setMessage] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonOptions: { value: AppealReason; label: string }[] = [
    { value: "unfair_score", label: t("feature.appeal.create.reasonUnfair") },
    { value: "wrong_interpretation", label: t("feature.appeal.create.reasonWrongInterpretation") },
    { value: "technical_issue", label: t("feature.appeal.create.reasonTechnical") },
    { value: "other", label: t("feature.appeal.create.reasonOther") },
  ];

  const handleSubmit = async () => {
    const newErrors = validateAppealMessage(message);
    setErrors(newErrors);
    if (newErrors.length > 0) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    void appealRepo.create({
      studentId,
      courseId,
      courseName: context.courseName,
      taskId,
      taskName: context.taskName,
      reason,
      message: message.trim(),
      attachmentName: attachmentName || undefined,
      currentScore: context.currentScore,
      maxScore: context.maxScore,
      reviewCount: context.reviewCount,
    });

    setIsSubmitting(false);
    onSuccess();
  };

  const handleFileSelect = () => {
    const demoFileName = `document_${Date.now()}.pdf`;
    setAttachmentName(demoFileName);
  };

  return (
    <div className="mt-6 max-w-[800px]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-accent rounded-[12px] flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-accent-foreground" />
        </div>
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
          {t("feature.appeal.create.title")}
        </h1>
      </div>
      <p className="text-[16px] text-muted-foreground mb-8">
        {t("feature.appeal.create.subtitle")}
      </p>

      {/* Context Summary */}
      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <h2 className="text-[18px] font-medium text-foreground mb-4">
          {t("feature.appeal.create.assignmentInfo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-[12px]">
            <Target className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">
                {t("feature.appeal.create.currentScore")}
              </p>
              <p className="text-[20px] font-medium text-foreground">
                {context.currentScore} / {context.maxScore}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-[12px]">
            <Users className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">
                {t("feature.appeal.create.reviewsReceived")}
              </p>
              <p className="text-[20px] font-medium text-foreground">{context.reviewCount}</p>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 p-4 bg-muted rounded-[12px]">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">
                {t("feature.appeal.create.appealDeadline")}
              </p>
              <p className="text-[15px] font-medium text-foreground">{context.deadline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive rounded-[12px]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-destructive mb-2">
                {t("feature.appeal.create.formErrors")}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-[13px] text-destructive">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Appeal Form */}
      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <h2 className="text-[18px] font-medium text-foreground mb-6">
          {t("feature.appeal.create.formTitle")}
        </h2>

        {/* Reason Category */}
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            {t("feature.appeal.create.reasonLabel")}
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as AppealReason)}
            className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
          >
            {reasonOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {t("feature.appeal.create.reasonHint")}
          </p>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            {t("feature.appeal.create.messageLabel")} <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("feature.appeal.create.messagePlaceholder")}
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors resize-none"
              rows={8}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[13px] text-muted-foreground">
              {t("feature.appeal.create.minChars")}
            </p>
            <p className="text-[13px] text-muted-foreground">{message.length} / 1000</p>
          </div>
        </div>

        {/* Attachment Upload */}
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            {t("feature.appeal.create.attachmentLabel")}
          </label>
          <div className="border-2 border-dashed border-border rounded-[12px] p-6 text-center">
            {attachmentName ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-5 h-5 text-accent-foreground" />
                <span className="text-[14px] text-foreground font-medium">{attachmentName}</span>
                <button
                  onClick={() => setAttachmentName("")}
                  className="text-[13px] text-destructive hover:underline"
                >
                  {t("common.delete")}
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-[14px] text-muted-foreground mb-3">
                  {t("feature.appeal.create.attachmentHint")}
                </p>
                <button
                  onClick={handleFileSelect}
                  className="px-4 py-2 border-2 border-border text-foreground rounded-[8px] hover:bg-muted/50 transition-colors text-[14px] font-medium"
                >
                  {t("feature.appeal.create.selectFile")}
                </button>
                <p className="text-[12px] text-muted-foreground mt-2">
                  {t("feature.appeal.create.fileFormats")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => void handleSubmit()}
          disabled={isSubmitting}
          className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? t("feature.appeal.create.submitting")
            : t("feature.appeal.create.submitAppeal")}
        </button>

        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium disabled:opacity-50"
        >
          {t("common.cancel")}
        </button>
      </div>

      {/* Info Note */}
      <div className="bg-accent/10 border-2 border-accent/30 rounded-[12px] p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] text-foreground font-medium mb-1">
              {t("feature.appeal.create.importantInfo")}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {t("feature.appeal.create.importantInfoDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
