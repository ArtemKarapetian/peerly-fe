import { useTranslation } from "react-i18next";

/**
 * CourseTabs - Табы для переключения между Заданиями и Участниками
 * Классический underline стиль без pill кнопок
 */

interface CourseTabsProps {
  activeTab: "assignments" | "participants";
  onTabChange: (tab: "assignments" | "participants") => void;
  assignmentsCount?: number;
  participantsCount?: number;
}

export function CourseTabs({
  activeTab,
  onTabChange,
  assignmentsCount,
  participantsCount,
}: CourseTabsProps) {
  const { t } = useTranslation();
  return (
    <div className="border-b border-[#e6e8ee]">
      <div className="flex items-center gap-8 px-5">
        <button
          onClick={() => onTabChange("assignments")}
          className={`
            relative px-1 py-3 text-[15px] leading-[1.3] tracking-[-0.3px]
            transition-colors
            ${
              activeTab === "assignments"
                ? "text-[#21214f] font-semibold"
                : "text-[#767692] hover:text-[#21214f]"
            }
          `}
        >
          {t("entity.course.assignmentsTab")}
          {assignmentsCount !== undefined && ` (${assignmentsCount})`}
          {/* Underline для активного таба */}
          {activeTab === "assignments" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#21214f]" />
          )}
        </button>

        <button
          onClick={() => onTabChange("participants")}
          className={`
            relative px-1 py-3 text-[15px] leading-[1.3] tracking-[-0.3px]
            transition-colors
            ${
              activeTab === "participants"
                ? "text-[#21214f] font-semibold"
                : "text-[#767692] hover:text-[#21214f]"
            }
          `}
        >
          {t("entity.course.participantsTab")}
          {participantsCount !== undefined && ` (${participantsCount})`}
          {/* Underline для активного таба */}
          {activeTab === "participants" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#21214f]" />
          )}
        </button>
      </div>
    </div>
  );
}
