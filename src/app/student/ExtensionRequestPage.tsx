import { useState } from "react";
import { AppShell } from "@/app/components/AppShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Clock, Calendar, MessageSquare, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { ExtensionType, requestExtension } from "@/app/utils/extensions";
import { useAuth } from "@/app/contexts/AuthContext";

/**
 * ExtensionRequestPage - Student page to request deadline extension
 */
export default function ExtensionRequestPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<ExtensionType>("submission");
  const [desiredDate, setDesiredDate] = useState("");
  const [reason, setReason] = useState("");

  // Extract params from hash (demo)
  const hash = window.location.hash;
  const match = hash.match(/\/courses\/([^/]+)\/tasks\/([^/]+)\/extension-request/);
  const courseId = match?.[1] || "1";
  const taskId = match?.[2] || "1";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!desiredDate || !reason.trim()) {
      return;
    }

    // Create extension request
    requestExtension(
      taskId,
      user?.id || "1",
      user?.name || "Текущий студент",
      type,
      type !== "review" ? desiredDate : undefined,
      type !== "submission" ? desiredDate : undefined,
      reason,
    );

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppShell title="Запрос продления">
        <div className="max-w-[600px] mx-auto">
          <div className="mt-12 text-center space-y-6">
            {/* Success icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Success message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">Запрос отправлен</h1>
              <p className="text-muted-foreground">
                Ваш запрос на продление дедлайна получен преподавателем. Вы получите уведомление,
                когда он будет рассмотрен.
              </p>
            </div>

            {/* Info card */}
            <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-[12px] p-4 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-foreground/80">
                  <strong>Что дальше?</strong>
                  <p className="mt-1 text-muted-foreground">
                    Преподаватель рассмотрит ваш запрос в ближайшее время. Статус запроса вы можете
                    отслеживать на странице задания.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center pt-4">
              <a
                href={`#/task/${taskId}`}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Вернуться к заданию
              </a>
              <a
                href="#/courses"
                className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
              >
                К курсам
              </a>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Запрос продления">
      <div className="max-w-[700px]">
        <Breadcrumbs
          items={[
            { label: "Курсы", href: "#/courses" },
            { label: "Course 1", href: `#/course/${courseId}` },
            { label: "Task 1", href: `#/task/${taskId}` },
            { label: "Запрос продления" },
          ]}
        />

        <div className="mt-6 space-y-6">
          {/* Back link */}
          <a
            href={`#/task/${taskId}`}
            className="inline-flex items-center gap-2 text-sm text-accent-blue hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к заданию
          </a>

          {/* Header */}
          <div>
            <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
              Запрос на продление дедлайна
            </h1>
            <p className="text-muted-foreground">
              Опишите причину, по которой вам требуется дополнительное время для выполнения задания
            </p>
          </div>

          {/* Info card */}
          <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-[20px] p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground mb-2">О запросе продления</h2>
                <p className="text-sm text-muted-foreground">
                  Запрос будет рассмотрен преподавателем. Обоснованные причины (болезнь, личные
                  обстоятельства, технические проблемы) имеют больше шансов на одобрение. Вы
                  получите уведомление о решении.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-[20px] p-6 space-y-6"
          >
            {/* Extension Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Что вы хотите продлить?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-4 border border-border rounded-[12px] cursor-pointer hover:bg-accent/50 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="submission"
                    checked={type === "submission"}
                    onChange={(e) => setType(e.target.value as ExtensionType)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Дедлайн сдачи работы</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Продлить срок для отправки вашей работы
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-[12px] cursor-pointer hover:bg-accent/50 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="review"
                    checked={type === "review"}
                    onChange={(e) => setType(e.target.value as ExtensionType)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Дедлайн проверки работ</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Продлить срок для peer review других работ
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-[12px] cursor-pointer hover:bg-accent/50 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="both"
                    checked={type === "both"}
                    onChange={(e) => setType(e.target.value as ExtensionType)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Оба дедлайна</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Продлить и сдачу работы, и проверку
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Desired Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Желаемый новый дедлайн
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
                Укажите реалистичный срок, достаточный для выполнения задания
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Причина запроса
                </div>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={5}
                placeholder="Опишите причину, по которой вам необходимо продление дедлайна. Будьте конкретны и честны..."
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-none"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Подробное объяснение поможет преподавателю принять решение
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-muted/50 rounded-[12px] p-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Рекомендации</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Запрашивайте продление заблаговременно, не в последний момент</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Приложите документы, если это возможно (медицинские справки и т.д.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Будьте готовы к возможному отказу и альтернативным решениям</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={!desiredDate || !reason.trim()}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить запрос
              </button>
              <a
                href={`#/task/${taskId}`}
                className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium text-center"
              >
                Отмена
              </a>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
