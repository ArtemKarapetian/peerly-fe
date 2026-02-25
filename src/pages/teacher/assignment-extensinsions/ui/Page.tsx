import { useState, useCallback } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ROUTES } from "@/shared/config/routes.ts";
import { Plus } from "lucide-react";
import { AddExtensionModal } from "@/features/extension/manage/AddExtensionModal.tsx";
import { Extension, ExtensionStatus, extensionRepo } from "@/entities/extension";
import { MOCK_STUDENTS } from "@/entities/user/model/student.ts";
import { useExtensionDecisions } from "@/features/extension/decide";
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
  const [extensions, setExtensions] = useState<Extension[]>(() =>
    extensionRepo.getByAssignment(assignmentId),
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExtension, setEditingExtension] = useState<Extension | null>(null);
  const [filterStatus, setFilterStatus] = useState<ExtensionStatus | "all">("all");

  const loadExtensions = useCallback(() => {
    const data = extensionRepo.getByAssignment(assignmentId);
    setExtensions(data);
  }, [assignmentId]);

  const { approve, deny, remove } = useExtensionDecisions({
    onChanged: loadExtensions,
    teacherId: "teacher1",
  });

  const handleEdit = (extension: Extension) => {
    setEditingExtension(extension);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingExtension(null);
    loadExtensions();
  };

  const filteredExtensions =
    filterStatus === "all" ? extensions : extensions.filter((ext) => ext.status === filterStatus);

  return (
    <AppShell title="Продления дедлайнов">
      <div className="max-w-[1200px]">
        <Breadcrumbs
          items={[
            { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
            { label: "Конструктор заданий", href: ROUTES.teacherDashboard },
            { label: "Задание", href: ROUTES.teacherDashboard },
            { label: "Продления дедлайнов" },
          ]}
        />

        <div className="mt-6">
          <ExtensionsHeader onAdd={() => setShowAddModal(true)} />

          <ExtensionsFilters value={filterStatus} onChange={setFilterStatus} />

          <ExtensionsTable
            extensions={filteredExtensions}
            filterStatus={filterStatus}
            onApprove={approve}
            onDeny={deny}
            onEdit={handleEdit}
            onDelete={remove}
          />

          <ExtensionsSummary extensions={extensions} />
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
