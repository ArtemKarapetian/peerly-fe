import { Filter, Search, Upload, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { courseRepo } from "@/entities/course";

import { ParticipantImportModal } from "@/features/participant/import";

type RoleFilter = "all" | "student" | "teacher";

interface ParticipantRow {
  id: string;
  name: string;
  role: "student" | "teacher";
}

interface TeacherCourseParticipantsProps {
  courseId: string;
}

export function TeacherCourseParticipants({ courseId }: TeacherCourseParticipantsProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useAsync(
    () => courseRepo.getParticipants(courseId),
    [courseId],
  );

  const participants: ParticipantRow[] = useMemo(() => {
    if (!data) return [];
    const students: ParticipantRow[] = data.students.map((s) => ({
      id: String(s.studentId),
      name: s.name,
      role: "student",
    }));
    const teachers: ParticipantRow[] = data.teachers.map((teacher) => ({
      id: String(teacher.teacherId),
      name: teacher.name,
      role: "teacher",
    }));
    return [...teachers, ...students];
  }, [data]);

  const filtered = participants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorBanner error={error} onRetry={refetch} />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("widget.participants.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors bg-card"
        >
          <option value="all">{t("widget.participants.allRoles")}</option>
          <option value="student">{t("widget.participants.studentsRole")}</option>
          <option value="teacher">{t("widget.participants.teachersRole")}</option>
        </select>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors"
        >
          <Upload className="w-4 h-4" />
          {t("widget.participants.import")}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          {participants.length === 0 ? (
            <>
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-[15px] text-muted-foreground">{t("widget.participants.empty")}</p>
            </>
          ) : (
            <>
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-[15px] text-muted-foreground">
                {t("widget.participants.notFound")}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-0">
          {filtered.map((participant, index) => (
            <div
              key={`${participant.role}-${participant.id}`}
              className={`p-4 hover:bg-card hover:shadow-sm hover:rounded-[12px] transition-all ${
                index !== filtered.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[15px] font-medium text-foreground truncate">
                  {participant.name}
                </p>
                {participant.role === "teacher" ? (
                  <span className="px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium shrink-0">
                    {t("widget.participants.roleBadgeTeacher")}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-info-light text-info rounded-[6px] text-[12px] font-medium shrink-0">
                    {t("widget.participants.roleBadgeStudent")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-6 text-[14px] text-muted-foreground">
        <span>
          {t("widget.participants.total")}{" "}
          <strong className="text-foreground">{participants.length}</strong>
        </span>
        <span>
          {t("widget.participants.studentsCount")}{" "}
          <strong className="text-foreground">
            {participants.filter((p) => p.role === "student").length}
          </strong>
        </span>
        <span>
          {t("widget.participants.teachersCount")}{" "}
          <strong className="text-foreground">
            {participants.filter((p) => p.role === "teacher").length}
          </strong>
        </span>
      </div>

      {isImportModalOpen && (
        <ParticipantImportModal courseId={courseId} onClose={() => setIsImportModalOpen(false)} />
      )}
    </div>
  );
}
