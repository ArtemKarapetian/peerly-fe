import { AppShell } from "@/app/components/AppShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { ROUTES } from "@/app/routes";
import { MessageSquare, Clock, CheckCircle, XCircle, Eye } from "lucide-react";

/**
 * AppealsPage - Student appeals list
 */

export default function AppealsPage() {
  const appeals = [
    {
      id: "1",
      course: "Web Development",
      assignment: "Final Project",
      status: "pending",
      submittedDate: "2026-01-20",
      reason: "Несогласие с оценкой peer review",
      reviewerGrade: 75,
      appealGrade: null,
    },
    {
      id: "2",
      course: "Data Structures",
      assignment: "Binary Trees",
      status: "approved",
      submittedDate: "2026-01-15",
      reason: "Технические проблемы при отправке",
      reviewerGrade: 60,
      appealGrade: 85,
    },
    {
      id: "3",
      course: "Algorithms",
      assignment: "Sorting",
      status: "rejected",
      submittedDate: "2026-01-10",
      reason: "Запрос на пересмотр критериев",
      reviewerGrade: 70,
      appealGrade: 70,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[8px] text-[12px] font-medium">
            <Clock className="w-4 h-4" />
            На рассмотрении
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[12px] font-medium">
            <CheckCircle className="w-4 h-4" />
            Одобрена
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[8px] text-[12px] font-medium">
            <XCircle className="w-4 h-4" />
            Отклонена
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell title="Appeals">
      <Breadcrumbs items={[{ label: "Студент", href: ROUTES.dashboard }, { label: "Апелляции" }]} />

      <div className="mt-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
              Мои апелляции
            </h1>
            <p className="text-[16px] text-[#767692]">История запросов на пересмотр оценок</p>
          </div>
        </div>

        {/* Appeals List */}
        <div className="space-y-4">
          {appeals.map((appeal) => (
            <div key={appeal.id} className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[20px] font-medium text-[#21214f]">{appeal.course}</h3>
                    {getStatusBadge(appeal.status)}
                  </div>
                  <p className="text-[15px] text-[#767692] mb-1">Задание: {appeal.assignment}</p>
                  <p className="text-[13px] text-[#767692]">
                    Подано: {new Date(appeal.submittedDate).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-[#f9f9f9] rounded-[12px]">
                  <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                    Оценка reviewer
                  </p>
                  <p className="text-[24px] font-medium text-[#21214f]">{appeal.reviewerGrade}%</p>
                </div>
                <div className="p-4 bg-[#f9f9f9] rounded-[12px]">
                  <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                    Итоговая оценка
                  </p>
                  <p
                    className={`text-[24px] font-medium ${
                      appeal.appealGrade && appeal.appealGrade > appeal.reviewerGrade
                        ? "text-[#4caf50]"
                        : "text-[#21214f]"
                    }`}
                  >
                    {appeal.appealGrade ? `${appeal.appealGrade}%` : "—"}
                  </p>
                </div>
                <div className="p-4 bg-[#f9f9f9] rounded-[12px]">
                  <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                    Изменение
                  </p>
                  <p
                    className={`text-[24px] font-medium ${
                      appeal.appealGrade && appeal.appealGrade > appeal.reviewerGrade
                        ? "text-[#4caf50]"
                        : appeal.appealGrade && appeal.appealGrade < appeal.reviewerGrade
                          ? "text-[#d4183d]"
                          : "text-[#767692]"
                    }`}
                  >
                    {appeal.appealGrade
                      ? (appeal.appealGrade > appeal.reviewerGrade ? "+" : "") +
                        (appeal.appealGrade - appeal.reviewerGrade)
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#f9f9f9] rounded-[12px] mb-4">
                <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-2">
                  Причина апелляции
                </p>
                <p className="text-[14px] text-[#21214f]">{appeal.reason}</p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`#/courses/1/tasks/1/appeal?id=${appeal.id}`}
                  className="px-4 py-2 border-2 border-[#e6e8ee] text-[#21214f] rounded-[8px] hover:bg-[#f9f9f9] transition-colors text-[14px] font-medium inline-flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Подробнее
                </a>
              </div>
            </div>
          ))}
        </div>

        {appeals.length === 0 && (
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-12 text-center">
            <MessageSquare className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
            <h3 className="text-[18px] font-medium text-[#21214f] mb-2">
              У вас пока нет апелляций
            </h3>
            <p className="text-[14px] text-[#767692]">
              Вы можете подать апелляцию, если не согласны с оценкой
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4">
          <div className="flex gap-3">
            <MessageSquare className="w-5 h-5 text-[#5b8def] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">Об апелляциях</h4>
              <p className="text-[13px] text-[#767692]">
                Апелляция рассматривается преподавателем в течение 3-5 рабочих дней. Вы можете
                подать апелляцию в течение 7 дней после получения оценки.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
