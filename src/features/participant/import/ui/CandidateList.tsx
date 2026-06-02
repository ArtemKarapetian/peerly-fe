import { useTranslation } from "react-i18next";

import { EmptyState } from "@/shared/ui";

interface Candidate {
  id: string;
  name: string;
  email: string;
}

interface CandidateListProps {
  candidates: Candidate[];
  selectedIds: Set<string>;
  isSearching: boolean;
  hasQuery: boolean;
  onToggle: (id: string) => void;
}

export function CandidateList({
  candidates,
  selectedIds,
  isSearching,
  hasQuery,
  onToggle,
}: CandidateListProps) {
  const { t } = useTranslation();

  if (isSearching) {
    return <p className="text-sm text-muted-foreground text-center py-8">{t("common.loading")}</p>;
  }
  if (candidates.length === 0) {
    return (
      <EmptyState
        className="py-8"
        message={
          hasQuery
            ? t("feature.participantImport.noResults")
            : t("feature.participantImport.startTyping")
        }
      />
    );
  }

  return (
    <ul className="space-y-2">
      {candidates.map((candidate) => (
        <CandidateRow
          key={candidate.id}
          candidate={candidate}
          checked={selectedIds.has(candidate.id)}
          onToggle={() => onToggle(candidate.id)}
        />
      ))}
    </ul>
  );
}

function CandidateRow({
  candidate,
  checked,
  onToggle,
}: {
  candidate: Candidate;
  checked: boolean;
  onToggle: () => void;
}) {
  const stateClass = checked
    ? "border-brand-primary bg-brand-primary-lighter"
    : "border-border hover:bg-surface-hover";
  return (
    <li>
      <label
        className={`flex items-center gap-3 p-3 border-2 rounded-md cursor-pointer transition-colors ${stateClass}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-4 h-4 accent-brand-primary"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {candidate.name || candidate.email}
          </p>
          {candidate.name && (
            <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
          )}
        </div>
      </label>
    </li>
  );
}
