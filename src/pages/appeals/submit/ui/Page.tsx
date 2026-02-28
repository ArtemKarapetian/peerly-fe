import { useState } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ROUTES } from "@/shared/config/routes.ts";
import { MessageSquare, AlertCircle, Send, ArrowLeft } from "lucide-react";

/**
 * SubmitAppealPage - Submit an appeal for a specific task
 */

export default function SubmitAppealPage() {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppShell title="Appeal Submitted">
        <div className="max-w-[600px] mx-auto mt-12">
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-8 text-center">
            <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-[#4caf50]" />
            </div>
            <h1 className="text-[28px] font-medium text-[#21214f] mb-3">Апелляция отправлена!</h1>
            <p className="text-[15px] text-[#767692] mb-6">
              Ваш запрос получен и будет рассмотрен преподавателем в течение 3-5 рабочих дней. Вы
              получите уведомление, когда решение будет принято.
            </p>
            <div className="flex gap-3">
              <a
                href="#/appeals"
                className="flex-1 px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[15px] font-medium"
              >
                Мои апелляции
              </a>
              <a
                href="#/courses/1"
                className="flex-1 px-4 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[15px] font-medium"
              >
                К курсу
              </a>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Submit Appeal">
      <Breadcrumbs
        items={[
          { label: "Курсы", href: ROUTES.courses },
          { label: "Web Development", href: ROUTES.course("1") },
          { label: "Final Project", href: ROUTES.task("1", "1") },
          { label: "Апелляция" },
        ]}
      />

      <div className="mt-6 max-w-[800px]">
        <a
          href="#/task/1"
          className="inline-flex items-center gap-2 text-[14px] text-[#5b8def] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к заданию
        </a>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-[#e9f5ff] rounded-[12px] flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-[#5b8def]" />
          </div>
          <div>
            <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
              Подать апелляцию
            </h1>
            <p className="text-[16px] text-[#767692]">
              Задание: Final Project • Текущая оценка: 75%
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-[#fff4e5] border-2 border-[#ff9800] rounded-[16px] p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff9800] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">Важная информация</h4>
              <ul className="text-[13px] text-[#767692] space-y-1">
                <li>• Апелляция может быть подана только один раз для каждого задания</li>
                <li>• Рассмотрение занимает 3-5 рабочих дней</li>
                <li>• Окончательное решение принимает преподаватель</li>
                <li>• Оценка может измениться как в большую, так и в меньшую сторону</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
            <h2 className="text-[20px] font-medium text-[#21214f] mb-6">Детали апелляции</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Причина апелляции
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                >
                  <option value="">Выберите причину...</option>
                  <option value="grading_error">Ошибка в оценивании</option>
                  <option value="criteria_misunderstanding">
                    Неправильное понимание критериев
                  </option>
                  <option value="technical_issues">Технические проблемы</option>
                  <option value="partial_credit">Частичный зачёт не учтён</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Подробное описание
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                  rows={8}
                  placeholder="Опишите, почему вы считаете, что оценка должна быть пересмотрена. Укажите конкретные пункты рубрики и аргументы..."
                  className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors resize-none"
                />
                <p className="mt-2 text-[12px] text-[#767692]">
                  Минимум 100 символов. Чем подробнее опишете проблему, тем быстрее будет
                  рассмотрение.
                </p>
              </div>
            </div>
          </div>

          {/* Review Info */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
            <h2 className="text-[20px] font-medium text-[#21214f] mb-4">Текущая оценка</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#f9f9f9] rounded-[12px]">
                <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                  Reviewer 1
                </p>
                <p className="text-[24px] font-medium text-[#21214f]">78%</p>
              </div>
              <div className="p-4 bg-[#f9f9f9] rounded-[12px]">
                <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                  Reviewer 2
                </p>
                <p className="text-[24px] font-medium text-[#21214f]">72%</p>
              </div>
              <div className="p-4 bg-[#e9f5ff] rounded-[12px]">
                <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Средняя</p>
                <p className="text-[24px] font-medium text-[#5b8def]">75%</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!reason || details.length < 100}
              className={`flex-1 px-6 py-4 rounded-[12px] text-[15px] font-medium transition-colors ${
                reason && details.length >= 100
                  ? "bg-[#5b8def] text-white hover:bg-[#4a7de8]"
                  : "bg-[#f0f0f0] text-[#d7d7d7] cursor-not-allowed"
              }`}
            >
              Отправить апелляцию
            </button>
            <a
              href="#/task/1"
              className="px-6 py-4 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[15px] font-medium"
            >
              Отмена
            </a>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
