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
import { useTranslation } from "react-i18next";

import i18n from "@/shared/lib/i18n/config";
import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

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
const loadAnnouncements = (
  courses: Awaited<ReturnType<typeof courseRepo.getAll>>,
): Announcement[] => {
  const stored = localStorage.getItem("teacher_announcements");
  if (stored) {
    const parsed: StoredAnnouncement[] = JSON.parse(stored) as StoredAnnouncement[];
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
      title: i18n.t("teacher.announcements.mockTitle1"),
      content: i18n.t("teacher.announcements.mockContent1"),
      courseId: courses[0]?.id || "",
      courseName: courses[0]?.title || "",
      createdAt: new Date(now - 14 * 24 * 60 * 60 * 1000),
      publishedAt: new Date(now - 14 * 24 * 60 * 60 * 1000),
      isPublished: true,
      isPinned: true,
    },
    {
      id: "ann-2",
      title: i18n.t("teacher.announcements.mockTitle2"),
      content: i18n.t("teacher.announcements.mockContent2"),
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
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useAsync(async () => {
    const courses = await courseRepo.getAll();
    return { courses };
  }, []);

  if (isLoading)
    return (
      <AppShell title={t("teacher.announcements.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.announcements.title")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  return <AnnouncementsContent data={data!} />;
}

function AnnouncementsContent({
  data,
}: {
  data: { courses: Awaited<ReturnType<typeof courseRepo.getAll>> };
}) {
  const { t } = useTranslation();
  const { courses } = data;

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
      alert(t("teacher.announcements.fillRequired"));
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
      alert(t("teacher.announcements.fillRequired"));
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
    if (confirm(t("teacher.announcements.deleteConfirm"))) {
      saveAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  const handlePublish = (id: string) => {
    saveAnnouncements(
      announcements.map((a) =>
        a.id === id ? { ...a, isPublished: true, publishedAt: new Date() } : a,
      ),
    );
    alert(t("teacher.announcements.publishedAlert"));
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
    <AppShell title={t("teacher.announcements.title")}>
      <Breadcrumbs items={[{ label: t("teacher.announcements.breadcrumb") }]} />

      <PageHeader
        title={t("teacher.announcements.title")}
        subtitle={t("teacher.announcements.subtitle")}
        action={
          !isCreating && !editingId ? (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-primary-foreground rounded-[10px] hover:bg-brand-primary-hover transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.25)] text-[14px] font-medium"
            >
              <Plus className="w-4 h-4" />
              {t("teacher.announcements.create")}
            </button>
          ) : undefined
        }
      />

      <div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.announcements.published")}
              </span>
            </div>
            <p className="text-[28px] font-medium text-success">{publishedCount}</p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Edit className="w-4 h-4 text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.announcements.drafts")}
              </span>
            </div>
            <p className="text-[28px] font-medium text-muted-foreground">{draftCount}</p>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-medium text-foreground">
                {editingId
                  ? t("teacher.announcements.editTitle")
                  : t("teacher.announcements.newTitle")}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-muted rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {t("teacher.announcements.titleLabel")}
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={t("teacher.announcements.titlePlaceholder")}
                  className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {t("teacher.announcements.courseLabel")}
                </label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
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
                <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {t("teacher.announcements.contentLabel")}
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder={t("teacher.announcements.contentPlaceholder")}
                  className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors min-h-[150px] resize-y"
                />
              </div>

              {/* Pin option */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-2 focus:ring-ring focus:ring-offset-0"
                  />
                  <span className="text-[14px] text-foreground">
                    {t("teacher.announcements.pinAnnouncement")}
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-[15px] font-medium">
                    {editingId
                      ? t("teacher.announcements.saveChanges")
                      : t("teacher.announcements.createDraft")}
                  </span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted transition-colors text-[15px] font-medium"
                >
                  {t("teacher.announcements.cancelBtn")}
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
                className="bg-card border-2 border-border rounded-[20px] p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[20px] font-medium text-foreground">
                        {announcement.title}
                      </h3>
                      {announcement.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[12px] font-medium">
                          <CheckCircle className="w-3 h-3" />
                          {t("teacher.announcements.publishedBadge")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[12px] font-medium">
                          <Edit className="w-3 h-3" />
                          {t("teacher.announcements.draftBadge")}
                        </span>
                      )}
                      {announcement.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium">
                          {t("teacher.announcements.pinnedBadge")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-[13px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {announcement.courseName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t("teacher.announcements.createdAt")}{" "}
                        {announcement.createdAt.toLocaleDateString()}
                      </span>
                      {announcement.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Send className="w-3 h-3" />
                          {t("teacher.announcements.publishedAt")}{" "}
                          {announcement.publishedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] text-foreground leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t-2 border-border">
                  {!announcement.isPublished ? (
                    <button
                      onClick={() => handlePublish(announcement.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-success text-primary-foreground rounded-[8px] hover:bg-success transition-colors text-[14px]"
                    >
                      <Send className="w-4 h-4" />
                      {t("teacher.announcements.publishBtn")}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnpublish(announcement.id)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-border text-muted-foreground rounded-[8px] hover:bg-muted transition-colors text-[14px]"
                    >
                      {t("teacher.announcements.unpublishBtn")}
                    </button>
                  )}
                  <button
                    onClick={() => handleTogglePin(announcement.id)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-border text-foreground rounded-[8px] hover:bg-muted transition-colors text-[14px]"
                  >
                    {announcement.isPinned
                      ? t("teacher.announcements.unpinBtn")
                      : t("teacher.announcements.pinBtn")}
                  </button>
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-border text-foreground rounded-[8px] hover:bg-muted transition-colors text-[14px]"
                  >
                    <Edit className="w-4 h-4" />
                    {t("teacher.announcements.editBtn")}
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-border text-error rounded-[8px] hover:border-error hover:bg-error-light transition-colors text-[14px] ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("teacher.announcements.deleteBtn")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
              <Megaphone className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                {t("teacher.announcements.noAnnouncements")}
              </h3>
              <p className="text-[14px] text-muted-foreground mb-4">
                {t("teacher.announcements.createFirstDesc")}
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[15px] font-medium">
                  {t("teacher.announcements.createAnnouncement")}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
