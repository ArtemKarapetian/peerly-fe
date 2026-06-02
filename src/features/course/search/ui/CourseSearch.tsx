import { useTranslation } from "react-i18next";

import { SearchInput } from "@/shared/ui";

interface CourseSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CourseSearch({ value, onChange, placeholder }: CourseSearchProps) {
  const { t } = useTranslation();
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? t("feature.courseSearch.placeholder")}
    />
  );
}
