import { Save, X } from "lucide-react";
import { useState } from "react";

import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { Button } from "@/shared/ui/button.tsx";

import { courseRepo } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function CreateCoursePage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new course
    const newCourse = courseRepo.create({
      title: name,
      code,
      instructorId: "teacher-1",
      semester,
      description,
      archived: false,
    });

    // Navigate to the new course
    window.location.hash = `/teacher/course/${newCourse.id}`;
  };

  return (
    <AppShell title="Создание курса">
      <Breadcrumbs
        items={[
          { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
          { label: "Курсы", href: ROUTES.teacherDashboard },
          { label: "Создать курс" },
        ]}
      />

      <div className="max-w-[800px] mx-auto mt-4">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Создать ��овый курс
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-lg)] p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Название курса *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Например: Веб-разработка"
                className="w-full px-4 py-2.5 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary]"
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Код курса *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Например: CS101"
                className="w-full px-4 py-2.5 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary]"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Семестр *
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary]"
              >
                <option value="">Выберите семестр</option>
                <option value="Весна 2025">Весна 2025</option>
                <option value="Осень 2024">Осень 2024</option>
                <option value="Лето 2024">Лето 2024</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Краткое описание курса..."
                className="w-full px-4 py-3 border border-[--surface-border] rounded-[var(--radius-md)] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary] resize-none"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-3">
                Видимость
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
                    <div className="text-sm font-medium text-[--text-primary]">Публичный</div>
                    <div className="text-xs text-[--text-secondary]">Курс виден всем студентам</div>
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
                    <div className="text-sm font-medium text-[--text-primary]">Приватный</div>
                    <div className="text-xs text-[--text-secondary]">Только по приглашению</div>
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
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              <Save className="w-4 h-4" />
              Создать курс
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
