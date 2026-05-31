import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Card, StatusBadge } from "@/shared/ui";

import type { DemoAssignment } from "@/entities/assignment/model/types";
import type { DemoCourse } from "@/entities/course/model/types";

interface Teacher {
  name: string;
}

interface CourseHeaderCardProps {
  course: DemoCourse;
  teacher: Teacher | null;
  courseAssignments: DemoAssignment[];
}

export function CourseHeaderCard({ course, teacher, courseAssignments }: CourseHeaderCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const publishedCount = courseAssignments.filter((a) => a.status === "published").length;

  return (
    <Card className="p-4 tablet:p-6 mb-6">
      <div className="flex flex-col tablet:flex-row tablet:items-start tablet:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
            <h1 className="text-[clamp(20px,4.5vw,32px)] font-medium text-foreground tracking-[-0.5px] leading-tight [overflow-wrap:anywhere] [text-wrap:balance]">
              {course.name}
            </h1>
            <CourseStatusBadge status={course.status} />
          </div>
          {teacher && (
            <p className="text-sm text-muted-foreground">
              {t("teacher.courseDetail.meta.teacherLabel")}{" "}
              <span className="text-foreground font-medium">{teacher.name}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col tablet:flex-row items-stretch tablet:items-start gap-4 shrink-0">
          <div className="flex items-center gap-4 text-center self-start">
            <MetricBlock
              value={course.enrollmentCount}
              label={t("teacher.courseDetail.meta.participants")}
            />
            <div className="w-px h-12 bg-border" />
            <MetricBlock
              value={publishedCount}
              label={t("teacher.courseDetail.meta.assignments")}
            />
          </div>
          <button
            onClick={() => void navigate(`/teacher/analytics?courseId=${course.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors text-sm font-medium self-start"
          >
            <BarChart3 className="w-4 h-4" />
            {t("teacher.courseDetail.openAnalytics")}
          </button>
        </div>
      </div>
    </Card>
  );
}

function CourseStatusBadge({ status }: { status: DemoCourse["status"] }) {
  const { t } = useTranslation();
  const labelKey = `teacher.courseDetail.status.${status}`;
  const variantByStatus: Record<DemoCourse["status"], "success" | "warning" | "secondary"> = {
    active: "success",
    draft: "warning",
    archived: "secondary",
  };
  return <StatusBadge variant={variantByStatus[status]}>{t(labelKey)}</StatusBadge>;
}

function MetricBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[72px]">
      <p className="text-2xl font-medium text-foreground tabular-nums leading-none mb-1">{value}</p>
      <p className="text-13 text-muted-foreground whitespace-nowrap">{label}</p>
    </div>
  );
}
