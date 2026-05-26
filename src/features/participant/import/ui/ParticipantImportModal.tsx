import { X, Search, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useParticipantImport } from "../model/useParticipantImport";

interface ParticipantImportModalProps {
  courseId: string;
  onClose: () => void;
}

export function ParticipantImportModal({ courseId, onClose }: ParticipantImportModalProps) {
  const { t } = useTranslation();
  const {
    query,
    setQuery,
    groups,
    selectedGroupId,
    setSelectedGroupId,
    candidates,
    selectedIds,
    toggleSelected,
    isSearching,
    isAdding,
    loadError,
    hasQuery,
    add,
    canSubmit,
  } = useParticipantImport(courseId);

  const handleAdd = async () => {
    const result = await add();
    if (!result) return;
    if (result.successMessage) toast.success(result.successMessage);
    if (result.errorMessage) toast.error(result.errorMessage);
    if (result.added > 0) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b-2 border-border">
          <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px]">
            {t("feature.participantImport.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-sm transition-colors"
            aria-label={t("feature.participantImport.close")}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {loadError ? (
          <div className="flex items-center gap-2 m-6 p-4 bg-error-light text-destructive rounded-md">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{loadError}</span>
          </div>
        ) : null}

        <div className="p-6 space-y-4 border-b-2 border-border">
          <div>
            <label className="block text-13 font-medium text-foreground mb-2">
              {t("feature.participantImport.targetGroup")}
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              disabled={groups.length === 0}
              className="w-full px-4 py-2 border-2 border-border rounded-md text-15 bg-card focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
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
            </select>
          </div>

          <div>
            <label className="block text-13 font-medium text-foreground mb-2">
              {t("feature.participantImport.searchLabel")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("feature.participantImport.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-md text-15 focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <p className="text-sm text-muted-foreground text-center py-8">{t("common.loading")}</p>
          ) : candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {hasQuery
                ? t("feature.participantImport.noResults")
                : t("feature.participantImport.startTyping")}
            </p>
          ) : (
            <ul className="space-y-2">
              {candidates.map((s) => {
                const checked = selectedIds.has(s.id);
                return (
                  <li key={s.id}>
                    <label
                      className={`flex items-center gap-3 p-3 border-2 rounded-md cursor-pointer transition-colors ${
                        checked
                          ? "border-brand-primary bg-brand-primary-lighter"
                          : "border-border hover:bg-surface-hover"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelected(s.id)}
                        className="w-4 h-4 accent-brand-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {s.name || s.email}
                        </p>
                        {s.name ? (
                          <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                        ) : null}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-border">
          <p className="text-13 text-muted-foreground">
            {t("feature.participantImport.selectedCount", { count: selectedIds.size })}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
            >
              {t("feature.participantImport.cancel")}
            </button>
            <button
              onClick={() => void handleAdd()}
              disabled={!canSubmit}
              className="px-6 py-2 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isAdding
                ? t("common.saving")
                : t("feature.participantImport.addBtn", { count: selectedIds.size })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
