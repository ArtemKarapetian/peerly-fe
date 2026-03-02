import { FileText } from "lucide-react";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { TaskReviewAccordion } from "@/widgets/received-reviews";

import { mockReceivedReviews } from "../model/mockReceivedReviews";

export default function ReceivedReviewsPage() {
  return (
    <AppShell title="Полученные отзывы">
      <div className="max-w-[1000px]">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Полученные отзывы
        </h1>
        <p className="text-[16px] text-[#767692] mb-6">
          Просматривайте рецензии на свои работы от других студентов
        </p>

        {mockReceivedReviews.length > 0 ? (
          <TaskReviewAccordion tasks={mockReceivedReviews} />
        ) : (
          <div className="bg-[#f9f9f9] rounded-[20px] p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d2e1f8] rounded-full mb-4">
              <FileText className="w-8 h-8 text-[#3d6bc6]" />
            </div>
            <h3 className="text-[20px] font-medium text-[#21214f] mb-2 tracking-[-0.5px]">
              Вы ещё не получали отзывы
            </h3>
            <p className="text-[15px] text-[#767692] leading-[1.5] mb-6">
              Отзывы появятся здесь после того, как другие студенты проверят ваши работы.
            </p>
            <button
              onClick={() => (window.location.hash = "/courses")}
              className="inline-flex items-center justify-center px-5 py-3 bg-[#3d6bc6] hover:bg-[#2f5aa8] text-white rounded-[12px] text-[15px] font-medium transition-colors"
            >
              Перейти к курсам
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
