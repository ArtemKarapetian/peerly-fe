import { Search } from "lucide-react";

/**
 * CourseSearch - Поиск курсов
 */

interface CourseSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CourseSearch({
  value,
  onChange,
  placeholder = "Поиск курсов...",
}: CourseSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767692]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-4 py-2.5
          text-[14px] leading-[1.4] text-[#21214f]
          placeholder:text-[#c7c7c7]
          bg-white
          border border-[#e6e8ee] rounded-[12px]
          outline-none
          transition-colors
          focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20
        "
      />
    </div>
  );
}
