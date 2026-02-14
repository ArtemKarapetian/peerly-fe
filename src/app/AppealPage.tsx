import { useState } from "react";
import { AppShell } from "@/app/components/AppShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Button } from "@/app/components/ui/button.tsx";
import { AlertCircle, Send } from "lucide-react";
import { ROUTES } from "@/app/routes";

/**
 * AppealPage - Страница подачи апелляции на оценку
 */

interface AppealPageProps {
  taskId?: string;
  reviewId?: string;
}

export default function AppealPage({
  taskId: _taskId = "1",
  reviewId: _reviewId = "1",
}: AppealPageProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Navigate back after 2 seconds
    setTimeout(() => {
      window.location.hash = "/gradebook";
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <AppShell>
        <div className="max-w-[800px] mx-auto">
          <div className="bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[var(--radius-lg)] p-8 text-center">
            <div className="w-16 h-16 bg-[#4caf50] rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-semibold text-[--text-primary] mb-2">
              Апелляция отправлена
            </h2>
            <p className="text-[--text-secondary]">
              Преподаватель рассмотрит вашу апелляцию в течение 3-5 рабочих дней
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Breadcrumbs
        items={[{ label: "Журнал оценок", href: ROUTES.gradebook }, { label: "Апелляция" }]}
      />

      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Запрос пересмотра оценки
          </h1>
          <p className="text-[--text-secondary]">
            Опишите причину, по которой вы считаете, что оценка должна быть пересмотрена
          </p>
        </div>

        {/* Info Alert */}
        <div className="bg-[#fff8e1] border border-[#ffd54f] rounded-[var(--radius-md)] p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#f57c00] shrink-0 mt-0.5" />
          <div className="text-sm text-[--text-primary]">
            <p className="font-medium mb-1">Обратите внимание:</p>
            <ul className="list-disc list-inside space-y-1 text-[--text-secondary]">
              <li>Апелляция будет рассмотрена преподавателем в течение 3-5 рабочих дней</li>
              <li>Оценка может быть как повышена, так и понижена</li>
              <li>Результат рассмотрения апелляции является окончательным</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-[--text-primary] mb-2">
              Причина апелляции *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary]"
            >
              <option value="">Выберите причину</option>
              <option value="criteria">Несогласие с применением критериев оценивания</option>
              <option value="calculation">Ошибка в подсчете баллов</option>
              <option value="misunderstanding">Недопонимание требований задания</option>
              <option value="technical">Технические проблемы при сдаче</option>
              <option value="other">Другое</option>
            </select>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-[--text-primary] mb-2">
              Подробное описание *
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              rows={8}
              placeholder="Опишите детально, почему вы считаете, что оценка должна быть пересмотрена..."
              className="w-full px-4 py-3 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary] resize-none"
            />
            <p className="text-sm text-[--text-tertiary] mt-2">Минимум 100 символов</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[--surface-border]">
            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!reason || details.length < 100}
            >
              <Send className="w-4 h-4" />
              Отправить апелляцию
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
