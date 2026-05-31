import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import type { CourseRow } from "../model/types";

import { CreateCourseButton } from "./CreateCourseButton";

interface CoursesHeroCardProps {
  total: number;
  active: number;
  draft: number;
  archived: number;
}

export function CoursesHeroCard({ total, active, draft, archived }: CoursesHeroCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-page-h1 font-medium text-foreground tracking-[-0.5px] mb-1">
            {t("teacher.courses.title")}
          </h1>
          <p className="text-15 text-muted-foreground">
            <CoursesCountLabel total={total} active={active} draft={draft} archived={archived} />
          </p>
        </div>
        <div className="shrink-0">
          <CreateCourseButton />
        </div>
      </div>
    </Card>
  );
}

function CoursesCountLabel({
  total,
  active,
  draft,
  archived,
}: {
  total: number;
  active: number;
  draft: number;
  archived: number;
}) {
  const { t } = useTranslation();
  if (total === 0) return <>{t("teacher.courses.createFirst")}</>;

  const parts: string[] = [];
  if (active > 0) parts.push(`${active} ${t("teacher.courses.activeCourses", { count: active })}`);
  if (draft > 0) parts.push(`${draft} ${t("teacher.courses.inDraft", { count: draft })}`);
  if (archived > 0)
    parts.push(`${archived} ${t("teacher.courses.inArchive", { count: archived })}`);

  return <>{parts.join(", ")}</>;
}

export type { CourseRow };
