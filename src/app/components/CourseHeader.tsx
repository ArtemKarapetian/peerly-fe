/**
 * CourseHeader - Заголовок курса с изображением, названием и преподавателем
 */

interface CourseHeaderProps {
  title: string;
  teacher: string;
  coverColor?: string;
}

export function CourseHeader({ title, teacher, coverColor = '#f2b2d6' }: CourseHeaderProps) {
  return (
    <div className="bg-[#f9f9f9] w-full rounded-[20px] overflow-hidden">
      {/* Cover Image */}
      <div 
        className="w-full h-[100px] rounded-t-[20px]" 
        style={{ backgroundColor: coverColor }}
      />
      
      {/* Text Content */}
      <div className="px-5 pb-5 pt-3 space-y-1">
        <h1 className="text-[32px] font-medium leading-[1.05] tracking-[-0.5px] text-[#21214f]">
          {title}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-[16px] leading-[1.1] tracking-[-0.72px] text-[#4b4963]">
            {teacher}
          </span>
          <div className="w-[17px] h-[17px] rounded-full bg-[#d7d7d7]" />
        </div>
      </div>
    </div>
  );
}