import { Save, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { useCreateCourse } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createCourse = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createCourse.mutate(
      { title: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: (course) => {
          toast.success(t("teacher.createCourse.created"));
          void navigate(`/teacher/courses/${course.id}`);
        },
        onError: (err) =>
          toast.error(humanizeApiError(err, t("teacher.createCourse.errorCreating"))),
      },
    );
  };

  return (
    <AppShell title={t("teacher.createCourse.title")}>
      <Breadcrumbs
        items={[CRUMBS.teacherCourses, { label: t("teacher.createCourse.breadcrumb") }]}
      />

      <div className="max-w-[800px] mx-auto">
        <PageHeader title={t("teacher.createCourse.title")} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-lg)] p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                {t("teacher.createCourse.courseNameLabel")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t("teacher.createCourse.courseNamePlaceholder")}
                className="w-full px-4 py-2.5 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                {t("teacher.createCourse.descriptionLabel")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={t("teacher.createCourse.descriptionPlaceholder")}
                className="w-full px-4 py-3 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary] resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void navigate(ROUTES.teacherCourses)}
              disabled={createCourse.isPending}
            >
              <X className="w-4 h-4" />
              {t("teacher.createCourse.cancelBtn")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!name.trim() || createCourse.isPending}
            >
              <Save className="w-4 h-4" />
              {createCourse.isPending ? t("common.saving") : t("teacher.createCourse.createBtn")}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
