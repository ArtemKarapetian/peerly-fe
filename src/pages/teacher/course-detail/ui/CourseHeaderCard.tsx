import { BarChart3, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { Card, StatusBadge } from "@/shared/ui";

import type { DemoAssignment } from "@/entities/assignment/model/types";
import { usePublishCourse } from "@/entities/course";
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
  const publishMutation = usePublishCourse(course.id);

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync();
      toast.success(t("teacher.courseDetail.publishSuccess"));
    } catch (err) {
      toast.error(humanizeApiError(err, t("teacher.courseDetail.publishError")));
    }
  };

  return (
    <Card className="p-4 tablet:p-6 mb-6">
      <div className="flex flex-col gap-4">
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

          <div className="flex items-center gap-4 shrink-0">
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
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {course.status === "draft" && (
            <button
              onClick={() => void handlePublish()}
              disabled={publishMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {t("teacher.courseDetail.publish")}
            </button>
          )}
          <button
            onClick={() => void navigate(`/teacher/analytics?courseId=${course.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border text-foreground bg-card rounded-md hover:border-brand-primary hover:text-brand-primary transition-colors text-sm font-medium"
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
