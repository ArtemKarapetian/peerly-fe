import { useState } from "react";

import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { LayoutDebugger } from "@/shared/ui/LayoutDebugger";

import { FilePreviewCard } from "@/features/submission/submit-work/ui/FilePreviewCard";
import type { UploadedFile } from "@/features/submission/submit-work/ui/FilePreviewCard";
import { FileUploadArea } from "@/features/submission/submit-work/ui/FileUploadArea";
import { TaskRulesCard } from "@/features/submission/submit-work/ui/TaskRulesCard";
import type { TaskRules } from "@/features/submission/submit-work/ui/TaskRulesCard";
import { ValidationChecks } from "@/features/submission/submit-work/ui/ValidationChecks";
import type { ValidationCheck } from "@/features/submission/submit-work/ui/ValidationChecks";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * SubmitWorkPage - Экран отправки работы студентом
 *
 * Route: /courses/:courseId/tasks/:taskId/submit
 *
 * Layout:
 * Desktop (≥1200px): 2 columns (form + status/help rail)
 * Tablet/Mobile: single column with status at top
 *
 * Left (form):
 * - Upload area (drag & drop)
 * - Draft/work preview
 * - Comment to teacher
 * - CTAs: "Сохранить черновик", "Сдать работу"
 *
 * Right rail:
 * - Task rules (deadline, resubmissions, late policy)
 * - Validation checks (plagiarism, lint, format, anonymization)
 */

interface SubmitWorkPageProps {
  courseId: string;
  taskId: string;
}

export function SubmitWorkPage({ courseId, taskId }: SubmitWorkPageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Success state after work
  const [comment, setComment] = useState("");
  const [validationChecks, setValidationChecks] = useState<ValidationCheck[]>([]);

  // Mock data - will be replaced with API
  const courseName = "Веб-разработка";
  const taskTitle = "Задание 1: Создание лендинга";

  const taskRules: TaskRules = {
    deadline: "31 января, 23:59",
    isDeadlinePassed: false,
    allowedResubmissions: 2,
    currentVersion: 0, // 0 = no work yet
    latePolicy: "Штраф 10% за каждый день опоздания (макс. 3 дня)",
  };

  // File formats based on task type
  const acceptedFormats = [".zip", ".pdf", ".jpg", ".png"];
  const maxFileSize = 10; // MB

  // Handle file selection
  const handleFileSelected = (file: File) => {
    // Create uploaded file object
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "long",
      }),
    };

    setUploadedFile(newFile);

    // Start validation checks after upload
    setTimeout(() => {
      setValidationChecks([
        {
          id: "1",
          name: "Проверка на плагиат",
          description: "Сравнение с базой работ",
          status: "queued",
        },
        {
          id: "2",
          name: "Линтинг кода",
          description: "Проверка стиля и качества кода",
          status: "not-started",
        },
        {
          id: "3",
          name: "Формат файлов",
          description: "Соответствие требованиям задания",
          status: "not-started",
        },
        {
          id: "4",
          name: "Анонимизация",
          description: "Проверка на личные данные",
          status: "not-started",
        },
      ]);

      // Simulate checks running
      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) => (i === 0 ? { ...check, status: "running" } : check)),
        );
      }, 500);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) =>
            i === 0
              ? { ...check, status: "passed", message: "Совпадений не обнаружено" }
              : i === 1
                ? { ...check, status: "running" }
                : check,
          ),
        );
      }, 2000);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) =>
            i === 1
              ? { ...check, status: "warning", message: "3 предупреждения о стиле кода" }
              : i === 2
                ? { ...check, status: "running" }
                : check,
          ),
        );
      }, 3500);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) =>
            i === 2
              ? { ...check, status: "passed", message: "Все файлы в порядке" }
              : i === 3
                ? { ...check, status: "running" }
                : check,
          ),
        );
      }, 5000);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) =>
            i === 3 ? { ...check, status: "passed", message: "Личных данных не найдено" } : check,
          ),
        );
      }, 6000);
    }, 100);
  };

  // Handle file replace
  const handleReplace = () => {
    setUploadedFile(null);
    setValidationChecks([]);
    setUploadError("");
  };

  // Handle file download
  const handleDownload = () => {
    console.log("Download file:", uploadedFile?.name);
    // Simulate download
    alert(`Скачивание: ${uploadedFile?.name}`);
  };

  // Handle file delete
  const handleDelete = () => {
    if (confirm("Вы уверены, что хотите удалить этот файл?")) {
      setUploadedFile(null);
      setValidationChecks([]);
      setUploadError("");
    }
  };

  // Handle save draft
  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      alert("Черновик сохранён");
    }, 1000);
  };

  // Handle submit
  const handleSubmit = () => {
    // Check if deadline passed
    if (taskRules.isDeadlinePassed) {
      const confirmSubmit = confirm("Дедлайн истёк. Применяется штраф за просрочку. Продолжить?");
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    // Simulate submit
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Success state - show after work
  if (isSuccess) {
    return (
      <AppShell title="Отправка работы">
        <Breadcrumbs
          items={[
            { label: "Курсы", href: ROUTES.courses },
            { label: courseName, href: ROUTES.course(courseId) },
            { label: taskTitle, href: ROUTES.task(courseId, taskId) },
            { label: "Отправка" },
          ]}
        />

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-[#f1f8f4] border-2 border-[#9cf38d] rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#9cf38d] rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">✓</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              Работа успешно отправлена!
            </h2>
            <p className="text-[16px] text-[#767692] leading-[1.5] mb-6">
              Ваша работа принята и будет проверена. Вы можете отслеживать статус на странице
              задания.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  window.location.hash = `/courses/${courseId}/tasks/${taskId}/submissions`;
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#3d6bc6] hover:bg-[#2d5bb6] text-white rounded-[12px] transition-colors text-[15px] font-medium"
              >
                Перейти к истории версий
              </button>
              <button
                onClick={() => {
                  window.location.hash = `/task/${taskId}`;
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:border-[#d2def8] hover:bg-[#f9f9f9] transition-colors text-[15px] font-medium"
              >
                Вернуться к заданию
              </button>
            </div>
          </div>
        </div>

        <LayoutDebugger />
      </AppShell>
    );
  }

  return (
    <AppShell title="Отправка работы">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Курсы", href: ROUTES.courses },
          { label: courseName, href: ROUTES.course(courseId) },
          { label: taskTitle, href: ROUTES.task(courseId, taskId) },
          { label: "Отправка" },
        ]}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Отправка работы
        </h1>
        <p className="text-[16px] text-[#767692] leading-[1.5]">{taskTitle}</p>
      </div>

      {/* 2-column layout: Form + Status Rail */}
      <div className="task-layout">
        {/* Left column: Form */}
        <div className="space-y-6">
          {/* Upload area */}
          <section className="bg-[#f9f9f9] rounded-[20px] p-6">
            <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
              Загрузить файлы
            </h2>
            <FileUploadArea
              acceptedFormats={acceptedFormats}
              maxSizeMB={maxFileSize}
              onFileSelected={handleFileSelected}
              onUploadStart={() => setIsUploading(true)}
              onUploadProgress={(progress) => setUploadProgress(progress)}
              onUploadComplete={() => setIsUploading(false)}
              onUploadError={(error) => setUploadError(error)}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              error={uploadError}
              disabled={isSubmitting}
            />
          </section>

          {/* Current draft/work preview */}
          {uploadedFile && (
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Загруженные файлы
              </h2>
              <FilePreviewCard
                file={uploadedFile}
                onReplace={handleReplace}
                onDownload={handleDownload}
                onDelete={handleDelete}
                disabled={isSubmitting}
              />
            </section>
          )}

          {/* Comment to teacher */}
          <section className="bg-[#f9f9f9] rounded-[20px] p-6">
            <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
              Комментарий преподавателю
              <span className="text-[#767692] font-normal ml-2">(опционально)</span>
            </h2>
            <textarea
              className="w-full min-h-[120px] px-4 py-3 bg-white border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] placeholder:text-[#767692] focus:border-[#a0b8f1] focus:outline-none resize-none transition-colors"
              placeholder="Добавьте комментарий к работе (не обязательно)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </section>

          {/* CTAs */}
          <section className="bg-white rounded-[20px] p-6 border-2 border-[#e6e8ee]">
            <div className="flex flex-col tablet:flex-row gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={!uploadedFile || isSaving || isSubmitting}
                className="flex-1 px-6 py-3 bg-white border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] text-[16px] font-medium hover:border-[#d2def8] hover:bg-[#f9f9f9] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? "Сохранение..." : "Сохранить черновик"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!uploadedFile || isSaving || isSubmitting}
                className="flex-1 px-6 py-3 bg-[#3d6bc6] text-white rounded-[12px] text-[16px] font-medium hover:bg-[#2d5bb6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting
                  ? "Отправка..."
                  : taskRules.currentVersion > 0
                    ? `Сдать работу (v${taskRules.currentVersion + 1})`
                    : "Сдать работу"}
              </button>
            </div>

            {/* Inline hints */}
            {!uploadedFile && (
              <p className="text-[13px] text-[#767692] mt-3 text-center">
                Загрузите файл, чтобы отправить работу
              </p>
            )}
            {taskRules.currentVersion > 0 && uploadedFile && (
              <p className="text-[13px] text-[#5b8def] mt-3 text-center">
                Это будет новая версия работы (v{taskRules.currentVersion + 1})
              </p>
            )}
            {taskRules.isDeadlinePassed && (
              <p className="text-[13px] text-[#d4183d] mt-3 text-center font-medium">
                ⚠️ Дедлайн прошёл. Применяется штраф за просрочку.
              </p>
            )}
          </section>
        </div>

        {/* Right rail: Status & Help */}
        <div className="space-y-6 hide-below-desktop">
          <div className="task-sidebar-sticky space-y-6">
            {/* Task rules placeholder */}
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Правила задания
              </h2>
              <TaskRulesCard rules={taskRules} />
            </section>

            {/* Validation checks placeholder */}
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Проверки
              </h2>
              <ValidationChecks checks={validationChecks} />
            </section>
          </div>
        </div>
      </div>

      <LayoutDebugger />
    </AppShell>
  );
}
