import { Clock, Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { ExtensionType, extensionRepo } from "@/entities/extension";

import { validateExtensionRequest } from "../model/validation";

type Props = {
  assignmentId: string;
  studentId: string;
  studentName: string;

  backHref: string;
  onSuccess: () => void;
};

export function ExtensionRequestForm({
  assignmentId,
  studentId,
  studentName,
  backHref,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const [type, setType] = useState<ExtensionType>("submission");
  const [desiredDate, setDesiredDate] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors = validateExtensionRequest(desiredDate, reason);
    setErrors(newErrors);
    if (newErrors.length) return;

    void extensionRepo.request(
      assignmentId,
      studentId,
      studentName,
      type,
      type !== "review" ? desiredDate : undefined,
      type !== "submission" ? desiredDate : undefined,
      reason.trim(),
    );

    onSuccess();
  };

  return (
    <div className="mt-6 space-y-6">
      <a
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-accent-blue hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("feature.extension.request.backToTask")}
      </a>

      <div>
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.extension.request.title")}
        </h1>
        <p className="text-muted-foreground">{t("feature.extension.request.subtitle")}</p>
      </div>

      <div className="bg-info-light border border-info rounded-[20px] p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-info-light flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-info" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-2">
              {t("feature.extension.request.aboutTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("feature.extension.request.aboutDesc")}
            </p>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-[12px] p-4">
          <div className="text-sm font-medium text-destructive mb-2">
            {t("feature.extension.request.checkForm")}
          </div>
          <ul className="list-disc list-inside text-sm text-destructive space-y-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-[20px] p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            {t("feature.extension.request.whatToExtend")}
          </label>
          <div className="space-y-2">
            {(["submission", "review", "both"] as ExtensionType[]).map((v) => (
              <label
                key={v}
                className="flex items-center gap-3 p-4 border border-border rounded-[12px] cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <input
                  type="radio"
                  name="type"
                  value={v}
                  checked={type === v}
                  onChange={(e) => setType(e.target.value as ExtensionType)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {v === "submission" && t("feature.extension.request.submissionDeadline")}
                    {v === "review" && t("feature.extension.request.reviewDeadline")}
                    {v === "both" && t("feature.extension.request.bothDeadlines")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {v === "submission" && t("feature.extension.request.submissionDeadlineDesc")}
                    {v === "review" && t("feature.extension.request.reviewDeadlineDesc")}
                    {v === "both" && t("feature.extension.request.bothDeadlinesDesc")}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              {t("feature.extension.request.desiredDeadline")}
            </div>
          </label>
          <input
            type="datetime-local"
            value={desiredDate}
            onChange={(e) => setDesiredDate(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t("feature.extension.request.desiredDeadlineHint")}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" />
              {t("feature.extension.request.reasonLabel")}
            </div>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={5}
            placeholder={t("feature.extension.request.reasonPlaceholder")}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-none"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t("feature.extension.request.reasonHint")}
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={!desiredDate || !reason.trim()}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("feature.extension.request.submitRequest")}
          </button>
          <a
            href={backHref}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium text-center"
          >
            {t("feature.extension.request.cancel")}
          </a>
        </div>
      </form>
    </div>
  );
}
