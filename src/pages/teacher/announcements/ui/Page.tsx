import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Send,
  X,
  Calendar,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

import { CRUMBS } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { courseRepo } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherAnnouncementsPage - Шаблоны уведомлений/анонсов
 *
 * Функции:
 * - Создание шаблонов объявлений
 * - Публикация объявления в курсе (demo)
 * - Отображение в Student course page на вкладке "Анонсы"
 */

interface Announcement {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  createdAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  isPinned: boolean;
}

interface StoredAnnouncement {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  createdAt: string;
  publishedAt?: string;
  isPublished: boolean;
  isPinned: boolean;
}

// Load announcements from localStorage or use defaults
const loadAnnouncements = (courses: ReturnType<typeof courseRepo.getAll>): Announcement[] => {
  const stored = localStorage.getItem("teacher_announcements");
  if (stored) {
    const parsed: StoredAnnouncement[] = JSON.parse(stored);
    return parsed.map((a) => ({
      ...a,
      createdAt: new Date(a.createdAt),
      publishedAt: a.publishedAt ? new Date(a.publishedAt) : undefined,
    }));
  }

  // Default announcements with fixed dates
  const now = Date.now();
  return [
    {
      id: "ann-1",
      title: "Приветствие в начале курса",
      content:
        "Добро пожаловать в курс! В этом семестре мы изучим основы веб-разработки. Пожалуйста, ознакомьтесь с программой курса и графиком сдачи заданий.",
      courseId: courses[0]?.id || "",
      courseName: courses[0]?.title || "",
      createdAt: new Date(now - 14 * 24 * 60 * 60 * 1000),
      publishedAt: new Date(now - 14 * 24 * 60 * 60 * 1000),
      isPublished: true,
      isPinned: true,
    },
    {
      id: "ann-2",
      title: "Дедлайн первого задания",
      content:
        "Напоминаю, что дедлайн первого задания — 15 марта в 23:59. Убедитесь, что загрузили все необходимые файлы.",
      courseId: courses[0]?.id || "",
      courseName: courses[0]?.title || "",
      createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000),
      publishedAt: new Date(now - 7 * 24 * 60 * 60 * 1000),
      isPublished: true,
      isPinned: false,
    },
  ];
};

export default function TeacherAnnouncementsPage() {
  const courses = courseRepo.getAll();

  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadAnnouncements(courses),
  );
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCourseId, setFormCourseId] = useState(courses[0]?.id || "");
  const [formPinned, setFormPinned] = useState(false);

  // Save to localStorage whenever announcements change
  const saveAnnouncements = (newAnnouncements: Announcement[]) => {
    setAnnouncements(newAnnouncements);
    localStorage.setItem("teacher_announcements", JSON.stringify(newAnnouncements));
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      alert("Заполните название и содержание");
      return;
    }

    const course = courses.find((c) => c.id === formCourseId);
    const newAnnouncement: Announcement = {
      id: `ann-${crypto.randomUUID()}`,
      title: formTitle,
      content: formContent,
      courseId: formCourseId,
      courseName: course?.title || "",
      createdAt: new Date(),
      isPublished: false,
      isPinned: formPinned,
    };

    saveAnnouncements([newAnnouncement, ...announcements]);

    // Reset form
    setFormTitle("");
    setFormContent("");
    setFormPinned(false);
    setIsCreating(false);
  };

  const handleUpdate = () => {
    if (!editingId || !formTitle.trim() || !formContent.trim()) {
      alert("Заполните название и содержание");
      return;
    }

    const course = courses.find((c) => c.id === formCourseId);
    saveAnnouncements(
      announcements.map((a) =>
        a.id === editingId
          ? {
              ...a,
              title: formTitle,
              content: formContent,
              courseId: formCourseId,
              courseName: course?.title || "",
              isPinned: formPinned,
            }
          : a,
      ),
    );

    // Reset form
    setFormTitle("");
    setFormContent("");
    setFormPinned(false);
    setEditingId(null);
  };

  const handleEdit = (announcement: Announcement) => {
    setFormTitle(announcement.title);
    setFormContent(announcement.content);
    setFormCourseId(announcement.courseId);
    setFormPinned(announcement.isPinned);
    setEditingId(announcement.id);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить это объявление?")) {
      saveAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  const handlePublish = (id: string) => {
    saveAnnouncements(
      announcements.map((a) =>
        a.id === id ? { ...a, isPublished: true, publishedAt: new Date() } : a,
      ),
    );
    alert('Объявление опубликовано! Студенты курса увидят его на вкладке "��нонсы".');
  };

  const handleUnpublish = (id: string) => {
    saveAnnouncements(
      announcements.map((a) =>
        a.id === id ? { ...a, isPublished: false, publishedAt: undefined } : a,
      ),
    );
  };

  const handleTogglePin = (id: string) => {
    saveAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a)),
    );
  };

  const handleCancel = () => {
    setFormTitle("");
    setFormContent("");
    setFormPinned(false);
    setIsCreating(false);
    setEditingId(null);
  };

  const publishedCount = announcements.filter((a) => a.isPublished).length;
  const draftCount = announcements.filter((a) => !a.isPublished).length;

  return (
    <AppShell title="Объявления">
      <Breadcrumbs items={[CRUMBS.teacherDashboard, { label: "Объявления" }]} />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
              Объявления
            </h1>
            <p className="text-[16px] text-[#767692]">
              Создавайте и публикуйте объявления для студентов курса
            </p>
          </div>
          {!isCreating && !editingId && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[15px] font-medium">Создать объявление</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#4caf50]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">
                Опубликовано
              </span>
            </div>
            <p className="text-[28px] font-medium text-[#4caf50]">{publishedCount}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Edit className="w-4 h-4 text-[#767692]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Черновики</span>
            </div>
            <p className="text-[28px] font-medium text-[#767692]">{draftCount}</p>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-medium text-[#21214f]">
                {editingId ? "Редактировать объявление" : "Новое объявление"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-[#767692]" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Название объявления
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Например: Напоминание о дедлайне"
                  className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Курс
                </label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Содержание
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Введите текст объявления..."
                  className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors min-h-[150px] resize-y"
                />
              </div>

              {/* Pin option */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-[#e6e8ee] text-[#5b8def] focus:ring-2 focus:ring-[#5b8def] focus:ring-offset-0"
                  />
                  <span className="text-[14px] text-[#21214f]">
                    Закрепить объявление (будет показано вверху списка)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  className="flex items-center gap-2 px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-[15px] font-medium">
                    {editingId ? "Сохранить изменения" : "Создать черновик"}
                  </span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[15px] font-medium"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[20px] font-medium text-[#21214f]">
                        {announcement.title}
                      </h3>
                      {announcement.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[12px] font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Опубликовано
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f5f5f5] text-[#767692] rounded-[6px] text-[12px] font-medium">
                          <Edit className="w-3 h-3" />
                          Черновик
                        </span>
                      )}
                      {announcement.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[12px] font-medium">
                          📌 Закреплено
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-[13px] text-[#767692]">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {announcement.courseName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Создано: {announcement.createdAt.toLocaleDateString("ru-RU")}
                      </span>
                      {announcement.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Send className="w-3 h-3" />
                          Опубликовано: {announcement.publishedAt.toLocaleDateString("ru-RU")}
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] text-[#21214f] leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t-2 border-[#e6e8ee]">
                  {!announcement.isPublished ? (
                    <button
                      onClick={() => handlePublish(announcement.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#4caf50] text-white rounded-[8px] hover:bg-[#45a049] transition-colors text-[14px]"
                    >
                      <Send className="w-4 h-4" />
                      Опубликовать
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnpublish(announcement.id)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[#e6e8ee] text-[#767692] rounded-[8px] hover:bg-[#f9f9f9] transition-colors text-[14px]"
                    >
                      Снять с публикации
                    </button>
                  )}
                  <button
                    onClick={() => handleTogglePin(announcement.id)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#e6e8ee] text-[#21214f] rounded-[8px] hover:bg-[#f9f9f9] transition-colors text-[14px]"
                  >
                    {announcement.isPinned ? "Открепить" : "Закрепить"}
                  </button>
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#e6e8ee] text-[#21214f] rounded-[8px] hover:bg-[#f9f9f9] transition-colors text-[14px]"
                  >
                    <Edit className="w-4 h-4" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#e6e8ee] text-[#d4183d] rounded-[8px] hover:border-[#d4183d] hover:bg-[#fff5f5] transition-colors text-[14px] ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Удалить
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-12 text-center">
              <Megaphone className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-[#21214f] mb-2">Нет объявлений</h3>
              <p className="text-[14px] text-[#767692] mb-4">
                Создайте первое объявление для студентов
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[15px] font-medium">Создать объявление</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
