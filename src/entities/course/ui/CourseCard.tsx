/**
 * CourseCard - Карточка курса
 * Мягкий стиль без толстых рамок, с hover эффектом
 */

interface CourseCardProps {
  id: string;
  title: string;
  teacher: string;
  coverColor?: string;
  onClick?: () => void;
}

export function CourseCard({ title, teacher, coverColor = "#f2b2d6", onClick }: CourseCardProps) {
  // Generate initials from teacher name for avatar
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <button
      onClick={onClick}
      className="
        bg-white rounded-[20px] overflow-hidden w-full
        border border-[#e6e8ee]
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        transition-all duration-200
        hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:border-[#b7bdff]
        text-left
        group
      "
    >
      {/* Cover Image */}
      <div className="w-full h-[120px]" style={{ backgroundColor: coverColor }} />

      {/* Content */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {/* Title */}
        <h3
          className="
          text-[15px] leading-[1.3] tracking-[-0.3px] text-[#21214f]
          font-semibold
          line-clamp-2
          min-h-[2.6em]
        "
        >
          {title}
        </h3>

        {/* Teacher with Avatar */}
        <div className="flex items-center gap-2">
          {/* Teacher Avatar */}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold text-white"
            style={{ backgroundColor: coverColor }}
          >
            {getInitials(teacher)}
          </div>
          <p
            className="
            flex-1 text-[13px] leading-[1.4] text-[#767692]
            truncate
          "
          >
            {teacher}
          </p>
        </div>
      </div>
    </button>
  );
}
