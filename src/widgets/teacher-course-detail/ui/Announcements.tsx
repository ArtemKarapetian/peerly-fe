import { Plus, Megaphone } from "lucide-react";
import { announcementRepo } from "@/entities/announcement";

interface TeacherCourseAnnouncementsProps {
  courseId: string;
}

export function TeacherCourseAnnouncements({ courseId }: TeacherCourseAnnouncementsProps) {
  const announcements = announcementRepo.getAll().filter((a) => a.courseId === courseId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[15px] text-[#767692]">Объявления для студентов курса</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors">
          <Plus className="w-4 h-4" />
          Создать объявление
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <h3 className="text-[17px] font-medium text-[#21214f] mb-2">{announcement.title}</h3>
            <p className="text-[14px] text-[#767692] mb-3">{announcement.content}</p>
            <p className="text-[13px] text-[#767692]">
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
            <Megaphone className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
            <p className="text-[15px] text-[#767692] mb-4">Объявлений пока нет</p>
            <button className="px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors">
              Создать объявление
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
