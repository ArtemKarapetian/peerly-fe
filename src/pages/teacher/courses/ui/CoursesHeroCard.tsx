import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import type { CourseRow } from "../model/types";

import { CreateCourseButton } from "./CreateCourseButton";

interface CoursesHeroCardProps {
  total: number;
  active: number;
}

export function CoursesHeroCard({ total, active }: CoursesHeroCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-page-h1 font-medium text-foreground tracking-[-0.5px] mb-1">
            {t("teacher.courses.title")}
          </h1>
          <p className="text-15 text-muted-foreground">
            <CoursesCountLabel total={total} active={active} />
          </p>
        </div>
        <div className="shrink-0">
          <CreateCourseButton />
        </div>
      </div>
    </Card>
  );
}

function CoursesCountLabel({ total, active }: { total: number; active: number }) {
  const { t } = useTranslation();
  if (active === 0) return <>{t("teacher.courses.createFirst")}</>;
  if (total === active) return <>{t("teacher.courses.coursesCount", { count: active })}</>;
  return (
    <>
      {active} {t("teacher.courses.activeCourses", { count: active })}, {total - active}{" "}
      {t("teacher.courses.inArchive")}
    </>
  );
}

export type { CourseRow };
