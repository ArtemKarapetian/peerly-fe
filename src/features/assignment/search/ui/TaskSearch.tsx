import { useTranslation } from "react-i18next";

import { SearchInput } from "@/shared/ui";

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TaskSearch({ value, onChange, placeholder }: TaskSearchProps) {
  const { t } = useTranslation();
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? t("feature.taskSearch.placeholder")}
    />
  );
}
