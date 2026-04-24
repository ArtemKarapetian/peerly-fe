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
  const tabClass = (active: boolean) =>
    `relative px-6 py-4 text-[16px] font-medium transition-colors ${
      active ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="border-b-2 border-border">
      <div className="flex gap-0">
        <button
          onClick={() => onTabChange("assignments")}
          className={tabClass(activeTab === "assignments")}
        >
          {t("entity.course.assignmentsTab")}
          {assignmentsCount !== undefined && ` (${assignmentsCount})`}
          {activeTab === "assignments" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary" />
          )}
        </button>

        <button
          onClick={() => onTabChange("participants")}
          className={tabClass(activeTab === "participants")}
        >
          {t("entity.course.participantsTab")}
          {participantsCount !== undefined && ` (${participantsCount})`}
          {activeTab === "participants" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary" />
          )}
        </button>
      </div>
    </div>
  );
}
