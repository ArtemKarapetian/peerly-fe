import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Field, FiltersCard, Select, TextField } from "@/shared/ui";

import type { SubmissionsRawData, StatusFilter } from "../model/types";

interface SubmissionFiltersProps {
  assignments: SubmissionsRawData["assignments"];
  filterAssignment: string;
  filterStatus: StatusFilter;
  searchStudent: string;
  resultsCount: number;
  onAssignmentChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onSearchChange: (v: string) => void;
  onReset: () => void;
}

export function SubmissionFilters({
  assignments,
  filterAssignment,
  filterStatus,
  searchStudent,
  resultsCount,
  onAssignmentChange,
  onStatusChange,
  onSearchChange,
  onReset,
}: SubmissionFiltersProps) {
  const { t } = useTranslation();
  const filtersDirty =
    filterAssignment !== "all" || filterStatus !== "all" || searchStudent.length > 0;

  return (
    <FiltersCard
      columns={3}
      onReset={onReset}
      showReset={filtersDirty}
      resultsLabel={
        <>
          {t("teacher.submissions.foundSubmissions")}{" "}
          <strong className="text-foreground">{resultsCount}</strong>
        </>
      }
    >
      <AssignmentFilter
        assignments={assignments}
        value={filterAssignment}
        onChange={onAssignmentChange}
      />
      <StatusFilterField value={filterStatus} onChange={onStatusChange} />
      <StudentSearchField value={searchStudent} onChange={onSearchChange} />
    </FiltersCard>
  );
}

function AssignmentFilter({
  assignments,
  value,
  onChange,
}: {
  assignments: SubmissionsRawData["assignments"];
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <Field label={t("common.assignments")}>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">{t("teacher.submissions.allAssignments")}</option>
        {assignments.map((a) => (
          <option key={a.id} value={a.id}>
            {a.title}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function StatusFilterField({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
}) {
  const { t } = useTranslation();
  return (
    <Field label={t("common.status")}>
      <Select value={value} onChange={(e) => onChange(e.target.value as StatusFilter)}>
        <option value="all">{t("teacher.submissions.allStatuses")}</option>
        <option value="submitted">{t("teacher.submissions.submitted")}</option>
        <option value="late">{t("teacher.submissions.late")}</option>
        <option value="draft">{t("teacher.submissions.draft")}</option>
      </Select>
    </Field>
  );
}

function StudentSearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  return (
    <Field label={t("teacher.submissions.studentSearch")}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("teacher.submissions.studentNamePlaceholder")}
          className="pl-10"
        />
      </div>
    </Field>
  );
}
