import { FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { EmptyState } from "@/shared/ui";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";

import { AssignmentRow } from "./AssignmentRow";
import { PickerFilters } from "./PickerFilters";
import { PickerFooter } from "./PickerFooter";
import { PickerHeader } from "./PickerHeader";

interface AssignmentPickerModalProps {
  rubricId: string;
  rubricName: string;
  onClose: () => void;
}

export function AssignmentPickerModal({
  rubricId: _rubricId,
  rubricName,
  onClose,
}: AssignmentPickerModalProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const { data: fetchedData } = useAsync(
    () => Promise.all([courseRepo.getAll(), assignmentRepo.getAll()]),
    [],
  );
  const courses = fetchedData?.[0] ?? [];
  const assignments = fetchedData?.[1] ?? [];

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourseId === "all" || assignment.courseId === selectedCourseId;
    return matchesSearch && matchesCourse;
  });

  const handleAttach = () => {
    if (!selectedAssignmentId) {
      alert(t("feature.assignmentPicker.selectAssignment"));
      return;
    }
    const assignment = assignments.find((a) => a.id === selectedAssignmentId);
    if (assignment) {
      alert(
        t("feature.assignmentPicker.rubricAttached", {
          rubricName,
          assignmentTitle: assignment.title,
        }),
      );
      onClose();
    }
  };

  const courseNameById = (courseId: string) => courses.find((c) => c.id === courseId)?.name ?? "";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <PickerHeader rubricName={rubricName} onClose={onClose} />

        <PickerFilters
          searchQuery={searchQuery}
          selectedCourseId={selectedCourseId}
          courses={courses}
          onSearchChange={setSearchQuery}
          onCourseChange={setSelectedCourseId}
        />

        <div className="flex-1 overflow-y-auto p-6">
          {filteredAssignments.length === 0 ? (
            <EmptyState icon={FileText} message={t("feature.assignmentPicker.notFound")} />
          ) : (
            <div className="space-y-3">
              {filteredAssignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
                  courseName={courseNameById(assignment.courseId)}
                  isSelected={selectedAssignmentId === assignment.id}
                  onSelect={() => setSelectedAssignmentId(assignment.id)}
                />
              ))}
            </div>
          )}
        </div>

        <PickerFooter
          hasSelection={Boolean(selectedAssignmentId)}
          onCancel={onClose}
          onAttach={handleAttach}
        />
      </div>
    </div>
  );
}
