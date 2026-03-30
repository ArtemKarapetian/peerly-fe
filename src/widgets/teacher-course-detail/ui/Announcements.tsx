import { Plus, Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { announcementRepo } from "@/entities/announcement";

interface TeacherCourseAnnouncementsProps {
  courseId: string;
}

export function TeacherCourseAnnouncements({ courseId }: TeacherCourseAnnouncementsProps) {
  const { t } = useTranslation();
  const announcements = announcementRepo.getAll().filter((a) => a.courseId === courseId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[15px] text-muted-foreground">{t("widget.announcements.subtitle")}</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors">
          <Plus className="w-4 h-4" />
          {t("widget.announcements.create")}
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-2 border-border rounded-[12px] p-4">
            <h3 className="text-[17px] font-medium text-foreground mb-2">{announcement.title}</h3>
            <p className="text-[14px] text-muted-foreground mb-3">{announcement.content}</p>
            <p className="text-[13px] text-muted-foreground">
              {announcement.publishedAt.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-[15px] text-muted-foreground mb-4">
              {t("widget.announcements.noAnnouncements")}
            </p>
            <button className="px-4 py-2 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors">
              {t("widget.announcements.create")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
