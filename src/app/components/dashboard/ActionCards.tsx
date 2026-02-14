import { CheckSquare, MessageSquare, ChevronRight } from "lucide-react";

/**
 * ActionCards - Карточки действий, требующих внимания
 *
 * - Нужно проверить: N (ссылка на список рецензий)
 * - Есть новые отзывы: N (ссылка на полученные отзывы)
 */

export interface ActionCardData {
  reviewsPending: number; // Количество заданий на рецензию
  newFeedback: number; // Количество новых отзывов
}

interface ActionCardsProps {
  data: ActionCardData;
  onReviewsClick: () => void;
  onFeedbackClick: () => void;
}

export function ActionCards({ data, onReviewsClick, onFeedbackClick }: ActionCardsProps) {
  const cards = [
    {
      id: "reviews",
      icon: CheckSquare,
      title: "Нужно проверить",
      count: data.reviewsPending,
      accentColor: "#5b8def",
      onClick: onReviewsClick,
      emptyText: "Нет заданий на проверку",
    },
    {
      id: "feedback",
      icon: MessageSquare,
      title: "Есть новые отзывы",
      count: data.newFeedback,
      accentColor: "#10b981",
      onClick: onFeedbackClick,
      emptyText: "Нет новых отзывов",
    },
  ];

  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const hasItems = card.count > 0;

        return (
          <button
            key={card.id}
            onClick={card.onClick}
            disabled={!hasItems}
            className={`
              w-full text-left p-4 transition-all rounded-[12px]
              ${
                hasItems
                  ? "hover:bg-white hover:shadow-sm cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0`}
                style={{ backgroundColor: hasItems ? `${card.accentColor}15` : "#f9f9f9" }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: hasItems ? card.accentColor : "#767692" }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[#767692] mb-1">{card.title}</div>

                {hasItems ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[28px] font-semibold text-[#21214f]">{card.count}</span>
                    <ChevronRight className="w-5 h-5 text-[#767692]" />
                  </div>
                ) : (
                  <div className="text-[14px] text-[#767692]">{card.emptyText}</div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
