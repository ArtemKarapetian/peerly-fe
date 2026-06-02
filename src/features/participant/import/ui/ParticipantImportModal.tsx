import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useParticipantImport } from "../model/useParticipantImport";

import { CandidateList } from "./CandidateList";
import { ImportFiltersBar } from "./ImportFiltersBar";
import { ImportModalFooter } from "./ImportModalFooter";
import { ImportModalHeader } from "./ImportModalHeader";

interface ParticipantImportModalProps {
  courseId: string;
  initialGroupId?: string;
  lockGroup?: boolean;
  onClose: () => void;
}

export function ParticipantImportModal({
  courseId,
  initialGroupId,
  lockGroup,
  onClose,
}: ParticipantImportModalProps) {
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
  } = useParticipantImport(courseId, initialGroupId);
  const lockedGroupName = groups.find((g) => g.id === selectedGroupId)?.name ?? "";

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
        <ImportModalHeader onClose={onClose} />

        {loadError && (
          <div className="flex items-center gap-2 m-6 p-4 bg-error-light text-error rounded-md">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{loadError}</span>
          </div>
        )}

        <ImportFiltersBar
          groups={groups}
          selectedGroupId={selectedGroupId}
          lockGroup={lockGroup}
          lockedGroupName={lockedGroupName}
          query={query}
          onGroupChange={setSelectedGroupId}
          onQueryChange={setQuery}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <CandidateList
            candidates={candidates}
            selectedIds={selectedIds}
            isSearching={isSearching}
            hasQuery={hasQuery}
            onToggle={toggleSelected}
          />
        </div>

        <ImportModalFooter
          selectedCount={selectedIds.size}
          isAdding={isAdding}
          canSubmit={canSubmit}
          onCancel={onClose}
          onAdd={() => void handleAdd()}
        />
      </div>
    </div>
  );
}
