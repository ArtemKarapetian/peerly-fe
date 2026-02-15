import { useState } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import {
  AlertCircle,
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Target,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/app/providers/auth.tsx";
import { createAppeal, AppealReason } from "@/app/utils/appeals";

/**
 * CreateAppealPage - Student Appeal (Regrade/Review Request)
 *
 * Allows students to request a regrade or appeal a review decision
 */

interface CreateAppealPageProps {
  courseId?: string;
  taskId?: string;
}

export default function CreateAppealPage({ courseId, taskId }: CreateAppealPageProps = {}) {
  const { user } = useAuth();

  const [reason, setReason] = useState<AppealReason>("unfair_score");
  const [message, setMessage] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data - in real app, fetch from work
  const courseName = "Веб-программирование"; // Mock
  const taskName = "Задание 1: Введение в peer review"; // Mock
  const currentScore = 78;
  const maxScore = 100;
  const reviewCount = 3;
  const deadline = "25 января 2026, 23:59";

  const reasonOptions: { value: AppealReason; label: string }[] = [
    { value: "unfair_score", label: "Несправедливая оценка" },
    { value: "wrong_interpretation", label: "Неправильная интерпретация" },
    { value: "technical_issue", label: "Техническая проблема" },
    { value: "other", label: "Другое" },
  ];

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!message.trim()) {
      newErrors.push("Сообщение обязательно для заполнения");
    } else if (message.trim().length < 20) {
      newErrors.push("Сообщение должно содержать минимум 20 символов");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create appeal
    createAppeal({
      studentId: user?.id || "student-1",
      courseId: courseId || "course-1",
      courseName,
      taskId: taskId || "task-1",
      taskName,
      reason,
      message: message.trim(),
      attachmentName: attachmentName || undefined,
      currentScore,
      maxScore,
      reviewCount,
    });

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const handleFileSelect = () => {
    // Demo file upload
    const demoFileName = `document_${Date.now()}.pdf`;
    setAttachmentName(demoFileName);
  };

  if (showSuccess) {
    return (
      <AppShell title="Апелляция отправлена">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-[500px] text-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-accent-foreground" />
            </div>
            <h1 className="text-[28px] font-medium text-foreground mb-3">Апелляция отправлена</h1>
            <p className="text-[16px] text-muted-foreground mb-8">
              Ваш запрос на пересмотр оценки отправлен преподавателю. Вы получите уведомление, когда
              будет получен ответ.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => (window.location.hash = "/appeals")}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium inline-flex items-center gap-2"
              >
                Мои апелляции
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => (window.location.hash = `/courses/${courseId}`)}
                className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium"
              >
                Вернуться к курсу
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Запрос на пересмотр">
      <Breadcrumbs
        items={[
          { label: "Курсы", href: "/courses" },
          { label: courseName, href: `/courses/${courseId}` },
          { label: taskName, href: `/courses/${courseId}/tasks/${taskId}` },
          { label: "Апелляция" },
        ]}
      />

      <div className="mt-6 max-w-[800px]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-accent rounded-[12px] flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-accent-foreground" />
          </div>
          <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
            Запрос на пересмотр оценки
          </h1>
        </div>
        <p className="text-[16px] text-muted-foreground mb-8">
          Опишите причину, по которой вы считаете, что оценка должна быть пересмотрена
        </p>

        {/* Context Summary */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <h2 className="text-[18px] font-medium text-foreground mb-4">Информация о задании</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-[12px]">
              <Target className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Текущая оценка</p>
                <p className="text-[20px] font-medium text-foreground">
                  {currentScore} / {maxScore}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-[12px]">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Получено рецензий</p>
                <p className="text-[20px] font-medium text-foreground">{reviewCount}</p>
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-muted rounded-[12px]">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Срок подачи апелляции</p>
                <p className="text-[15px] font-medium text-foreground">{deadline}</p>
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
                <p className="text-[14px] font-medium text-destructive mb-2">Ошибки заполнения:</p>
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
          <h2 className="text-[18px] font-medium text-foreground mb-6">Форма апелляции</h2>

          {/* Reason Category */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Причина обращения
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
              Выберите категорию, которая лучше всего описывает вашу проблему
            </p>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Подробное описание <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите подробно, почему вы считаете, что оценка должна быть пересмотрена. Укажите конкретные критерии или аспекты работы..."
                className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors resize-none"
                rows={8}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[13px] text-muted-foreground">Минимум 20 символов</p>
              <p className="text-[13px] text-muted-foreground">{message.length} / 1000</p>
            </div>
          </div>

          {/* Attachment Upload */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Приложение (опционально)
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
                    Удалить
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-[14px] text-muted-foreground mb-3">
                    Загрузите дополнительные материалы или доказательства
                  </p>
                  <button
                    onClick={handleFileSelect}
                    className="px-4 py-2 border-2 border-border text-foreground rounded-[8px] hover:bg-muted/50 transition-colors text-[14px] font-medium"
                  >
                    Выбрать файл
                  </button>
                  <p className="text-[12px] text-muted-foreground mt-2">PDF, DOC, DOCX до 10 МБ</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Отправка..." : "Отправить апелляцию"}
          </button>
          <button
            onClick={() => (window.location.hash = `/courses/${courseId}/tasks/${taskId}`)}
            disabled={isSubmitting}
            className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium disabled:opacity-50"
          >
            Отмена
          </button>
        </div>

        {/* Info Note */}
        <div className="bg-accent/10 border-2 border-accent/30 rounded-[12px] p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] text-foreground font-medium mb-1">Важная информация</p>
              <p className="text-[13px] text-muted-foreground">
                Преподаватель рассмотрит вашу апелляцию в течение 5 рабочих дней. Вы получите
                уведомление, когда будет принято решение.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
