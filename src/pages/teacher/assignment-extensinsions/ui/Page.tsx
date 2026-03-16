import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { Extension, ExtensionStatus, extensionRepo } from "@/entities/extension";
import { MOCK_STUDENTS } from "@/entities/user/model/student.ts";

import { useExtensionDecisions } from "@/features/extension/decide";
import { AddExtensionModal } from "@/features/extension/manage/AddExtensionModal.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  ExtensionsFilters,
  ExtensionsHeader,
  ExtensionsSummary,
  ExtensionsTable,
} from "@/widgets/assignment-extensions";

interface TeacherAssignmentExtensionsPageProps {
  assignmentId: string;
}

/**
 * TeacherAssignmentExtensionsPage - Manage deadline extensions for an assignment
 */
export function TeacherAssignmentExtensionsPage({
  assignmentId,
}: TeacherAssignmentExtensionsPageProps) {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const {
    data: extensions,
    isLoading,
    error,
    refetch,
  } = useAsync(() => extensionRepo.getByAssignment(assignmentId), [assignmentId]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExtension, setEditingExtension] = useState<Extension | null>(null);
  const [filterStatus, setFilterStatus] = useState<ExtensionStatus | "all">("all");

  const { approve, deny, remove } = useExtensionDecisions({
    onChanged: refetch,
    teacherId: "teacher1",
  });

  const handleEdit = (extension: Extension) => {
    setEditingExtension(extension);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingExtension(null);
    refetch();
  };

  if (isLoading)
    return (
      <AppShell title={t("widget.extensions.deadlineExtensions")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("widget.extensions.deadlineExtensions")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  const resolvedExtensions = extensions!;
  const filteredExtensions =
    filterStatus === "all"
      ? resolvedExtensions
      : resolvedExtensions.filter((ext) => ext.status === filterStatus);

  return (
    <AppShell title={t("widget.extensions.deadlineExtensions")}>
      <div className="max-w-[1200px]">
        <Breadcrumbs
          items={[CRUMBS.teacherAssignments, { label: t("widget.extensions.deadlineExtensions") }]}
        />

        <div className="mt-6">
          <ExtensionsHeader onAdd={() => setShowAddModal(true)} />

          <ExtensionsFilters value={filterStatus} onChange={setFilterStatus} />

          <ExtensionsTable
            extensions={filteredExtensions}
            filterStatus={filterStatus}
            onApprove={(id) => void approve(id)}
            onDeny={(id) => void deny(id)}
            onEdit={handleEdit}
            onDelete={(id) => void remove(id)}
          />

          <ExtensionsSummary extensions={resolvedExtensions} />
        </div>
      </div>

      {showAddModal && (
        <AddExtensionModal
          assignmentId={assignmentId}
          students={MOCK_STUDENTS}
          existingExtension={editingExtension}
          onClose={handleModalClose}
        />
      )}
    </AppShell>
  );
}
