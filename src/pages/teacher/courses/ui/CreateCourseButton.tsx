import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/shared/ui/utils.ts";

interface CreateCourseButtonProps {
  className?: string;
}

export function CreateCourseButton({ className }: CreateCourseButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => void navigate(ROUTES.teacherCreateCourse)}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-primary-foreground rounded-2md hover:bg-brand-primary-hover transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.2)] text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Plus className="w-4 h-4" />
      {t("teacher.courses.createCourse")}
    </button>
  );
}
