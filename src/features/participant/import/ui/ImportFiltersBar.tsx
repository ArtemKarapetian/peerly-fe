import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Select, TextField } from "@/shared/ui";

interface GroupOption {
  id: string;
  name: string;
}

interface ImportFiltersBarProps {
  groups: GroupOption[];
  selectedGroupId: string;
  lockGroup?: boolean;
  lockedGroupName: string;
  query: string;
  onGroupChange: (id: string) => void;
  onQueryChange: (q: string) => void;
}

export function ImportFiltersBar({
  groups,
  selectedGroupId,
  lockGroup,
  lockedGroupName,
  query,
  onGroupChange,
  onQueryChange,
}: ImportFiltersBarProps) {
  const { t } = useTranslation();
  const queryTooShort = query.trim().length > 0 && query.trim().length < 3;

  return (
    <div className="p-6 space-y-4 border-b-2 border-border">
      <div>
        <label className="block text-13 font-medium text-foreground mb-2">
          {t("feature.participantImport.targetGroup")}
        </label>
        {lockGroup ? (
          <div className="w-full px-4 py-2 border-2 border-border rounded-md text-15 bg-muted text-foreground">
            {lockedGroupName || t("common.loading")}
          </div>
        ) : (
          <Select
            value={selectedGroupId}
            onChange={(e) => onGroupChange(e.target.value)}
            disabled={groups.length === 0}
            className="py-2"
          >
            {groups.length === 0 ? (
              <option>{t("feature.participantImport.noGroups")}</option>
            ) : (
              groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))
            )}
          </Select>
        )}
      </div>

      <div>
        <label className="block text-13 font-medium text-foreground mb-2">
          {t("feature.participantImport.searchLabel")}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <TextField
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t("feature.participantImport.searchPlaceholder")}
            className="pl-10 py-2"
          />
        </div>
        {queryTooShort && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t("feature.participantImport.minChars")}
          </p>
        )}
      </div>
    </div>
  );
}
