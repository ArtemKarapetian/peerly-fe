import { Upload, X, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";

import { courseRepo } from "@/entities/course";

import type { AssignmentFormData } from "../model/types";

/**
 * StepBasics - Шаг 1: Основная информация
 *
 * - Выбор курса
 * - Название задания
 * - Описание
 * - Тип задания
 * - Прикрепленные файлы/ресурсы
 */

interface StepBasicsProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

export function StepBasics({ data, onUpdate }: StepBasicsProps) {
  const { t } = useTranslation();
  const { data: courses } = useAsync(() => courseRepo.getAll(), []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments = Array.from(files).map((file) => ({
      id: `f${Date.now()}_${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    onUpdate({
      attachments: [...data.attachments, ...newAttachments],
    });
  };

  const removeAttachment = (id: string) => {
    onUpdate({
      attachments: data.attachments.filter((a) => a.id !== id),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.basics.title")}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {t("feature.assignmentCreate.basics.subtitle")}
        </p>
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.basics.courseLabel")}{" "}
          <span className="text-destructive">*</span>
        </label>
        <select
          value={data.courseId}
          onChange={(e) => onUpdate({ courseId: e.target.value })}
          className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors bg-card"
        >
          <option value="">{t("feature.assignmentCreate.basics.coursePlaceholder")}</option>
          {(courses ?? []).map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.basics.titleLabel")}{" "}
          <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder={t("feature.assignmentCreate.basics.titlePlaceholder")}
          className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.basics.descriptionLabel")}
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={6}
          placeholder={t("feature.assignmentCreate.basics.descriptionPlaceholder")}
          className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors resize-none"
        />
        <p className="text-[13px] text-muted-foreground mt-1">
          {data.description.length} {t("feature.assignmentCreate.basics.characters")}
        </p>
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-3">
          {t("feature.assignmentCreate.basics.taskTypeLabel")}{" "}
          <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
          {[
            {
              value: "text",
              label: t("feature.assignmentCreate.basics.typeText"),
              desc: t("feature.assignmentCreate.basics.typeTextDesc"),
            },
            {
              value: "code",
              label: t("feature.assignmentCreate.basics.typeCode"),
              desc: t("feature.assignmentCreate.basics.typeCodeDesc"),
            },
            {
              value: "project",
              label: t("feature.assignmentCreate.basics.typeProject"),
              desc: t("feature.assignmentCreate.basics.typeProjectDesc"),
            },
            {
              value: "files",
              label: t("feature.assignmentCreate.basics.typeFiles"),
              desc: t("feature.assignmentCreate.basics.typeFilesDesc"),
            },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() =>
                onUpdate({ taskType: type.value as "text" | "code" | "project" | "files" })
              }
              className={`
                p-4 border-2 rounded-[12px] text-left transition-all
                ${
                  data.taskType === type.value
                    ? "border-brand-primary bg-brand-primary-light"
                    : "border-border hover:border-brand-primary bg-card"
                }
              `}
            >
              <div className="text-[15px] font-medium text-foreground mb-1">{type.label}</div>
              <div className="text-[12px] text-muted-foreground">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.basics.attachmentsLabel")}
        </label>
        <p className="text-[13px] text-muted-foreground mb-3">
          {t("feature.assignmentCreate.basics.attachmentsHint")}
        </p>

        <label className="inline-flex items-center gap-2 px-4 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-surface-hover transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          <span className="text-[14px] font-medium">
            {t("feature.assignmentCreate.basics.uploadFiles")}
          </span>
          <input type="file" multiple onChange={handleFileUpload} className="hidden" />
        </label>

        {data.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-muted border border-border rounded-[8px]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[14px] text-foreground">{file.name}</p>
                    <p className="text-[12px] text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeAttachment(file.id)}
                  className="p-1 hover:bg-surface-hover rounded-[6px] transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-info-light border border-info rounded-[12px] p-4">
        <p className="text-[13px] text-foreground">
          <strong>{t("feature.assignmentCreate.basics.tip")}</strong>{" "}
          {t("feature.assignmentCreate.basics.tipText")}
        </p>
      </div>
    </div>
  );
}
