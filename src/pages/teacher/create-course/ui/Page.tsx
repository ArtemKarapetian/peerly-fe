import { Save, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { courseRepo } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create new course
      const newCourse = await courseRepo.create({
        title: name,
        code,
        instructorId: "teacher-1",
        description,
        archived: false,
      });

      void navigate(`/teacher/courses/${newCourse.id}`);
    } catch {
      alert(t("teacher.createCourse.errorCreating"));
    }
  };

  return (
    <AppShell title={t("teacher.createCourse.title")}>
      <Breadcrumbs
        items={[CRUMBS.teacherCourses, { label: t("teacher.createCourse.breadcrumb") }]}
      />

      <div className="max-w-[800px] mx-auto">
        <PageHeader title={t("teacher.createCourse.title")} />

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-6"
        >
          <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-lg)] p-6 space-y-5">
            {/* Name */}
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

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                {t("teacher.createCourse.courseCodeLabel")}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder={t("teacher.createCourse.courseCodePlaceholder")}
                className="w-full px-4 py-2.5 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary]"
              />
            </div>

            {/* Description */}
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

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void navigate("/teacher/courses")}
            >
              <X className="w-4 h-4" />
              {t("teacher.createCourse.cancelBtn")}
            </Button>
            <Button type="submit" variant="primary">
              <Save className="w-4 h-4" />
              {t("teacher.createCourse.createBtn")}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
