import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { CreateCourseButton } from "./CreateCourseButton";

interface CoursesEmptyStateProps {
  isSearching: boolean;
}

export function CoursesEmptyState({ isSearching }: CoursesEmptyStateProps) {
  const { t } = useTranslation();
  return (
    <Card className="p-12 text-center">
      <div className="w-12 h-12 bg-brand-primary-lighter rounded-md flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-[17px] font-medium text-foreground mb-2">
        {isSearching ? t("teacher.courses.noCoursesSearch") : t("teacher.courses.noCourses")}
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        {isSearching ? t("teacher.courses.tryChangingSearch") : t("teacher.courses.createFirst")}
      </p>
      {!isSearching && <CreateCourseButton />}
    </Card>
  );
}
