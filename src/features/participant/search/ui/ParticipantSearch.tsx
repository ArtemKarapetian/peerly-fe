import { useTranslation } from "react-i18next";

import { SearchInput } from "@/shared/ui";

interface ParticipantSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ParticipantSearch({ value, onChange, placeholder }: ParticipantSearchProps) {
  const { t } = useTranslation();
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? t("feature.participantSearch.placeholder")}
    />
  );
}
