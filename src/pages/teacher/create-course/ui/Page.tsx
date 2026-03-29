import { Save, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { courseRepo } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function CreateCoursePage() {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create new course
      const newCourse = await courseRepo.create({
        title: name,
        code,
        instructorId: "teacher-1",
        semester,
        description,
        archived: false,
      });

      // Navigate to the new course
      window.location.hash = `/teacher/course/${newCourse.id}`;
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

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                {t("teacher.createCourse.semesterLabel")}
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary]"
              >
                <option value="">{t("teacher.createCourse.selectSemester")}</option>
                <option value="Весна 2025">{t("teacher.createCourse.spring2025")}</option>
                <option value="Осень 2024">{t("teacher.createCourse.fall2024")}</option>
                <option value="Лето 2024">{t("teacher.createCourse.summer2024")}</option>
              </select>
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

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-3">
                {t("teacher.createCourse.visibilityLabel")}
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={(e) => setVisibility(e.target.value as "public")}
                    className="w-4 h-4 text-[--brand-primary] focus:ring-2 focus:ring-[--brand-primary]/30"
                  />
                  <div>
                    <div className="text-sm font-medium text-[--text-primary]">
                      {t("teacher.createCourse.public")}
                    </div>
                    <div className="text-xs text-[--text-secondary]">
                      {t("teacher.createCourse.publicDesc")}
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={(e) => setVisibility(e.target.value as "private")}
                    className="w-4 h-4 text-[--brand-primary] focus:ring-2 focus:ring-[--brand-primary]/30"
                  />
                  <div>
                    <div className="text-sm font-medium text-[--text-primary]">
                      {t("teacher.createCourse.private")}
                    </div>
                    <div className="text-xs text-[--text-secondary]">
                      {t("teacher.createCourse.privateDesc")}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => (window.location.hash = "/teacher/courses")}
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
