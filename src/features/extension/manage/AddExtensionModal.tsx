import { Bell, Calendar, MessageSquare, User, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { extensionRepo, type Extension, type ExtensionType } from "@/entities/extension";
import { MOCK_STUDENTS } from "@/entities/user/model/student.ts";

type StudentOption = { id: string; name: string };

interface AddExtensionModalProps {
  assignmentId: string;
  students: StudentOption[];
  existingExtension?: Extension | null;
  onClose: () => void;
}

export function AddExtensionModal({
  assignmentId,
  existingExtension,
  onClose,
}: AddExtensionModalProps) {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState(existingExtension?.studentId || "");
  const [type, setType] = useState<ExtensionType>(existingExtension?.type || "submission");
  const [submissionDeadline, setSubmissionDeadline] = useState(
    existingExtension?.submissionDeadlineOverride
      ? new Date(existingExtension.submissionDeadlineOverride).toISOString().slice(0, 16)
      : "",
  );
  const [reviewDeadline, setReviewDeadline] = useState(
    existingExtension?.reviewDeadlineOverride
      ? new Date(existingExtension.reviewDeadlineOverride).toISOString().slice(0, 16)
      : "",
  );
  const [reason, setReason] = useState(existingExtension?.reason || "");
  const [notifyStudent, setNotifyStudent] = useState(existingExtension?.notifyStudent ?? true);

  const isEditing = !!existingExtension;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent) {
      toast.error(t("feature.addExtension.selectStudent"));
      return;
    }

    if (type === "submission" && !submissionDeadline) {
      toast.error(t("feature.addExtension.specifySubmissionDeadline"));
      return;
    }

    if (type === "review" && !reviewDeadline) {
      toast.error(t("feature.addExtension.specifyReviewDeadline"));
      return;
    }

    if (type === "both" && (!submissionDeadline || !reviewDeadline)) {
      toast.error(t("feature.addExtension.specifyBothDeadlines"));
      return;
    }

    if (!reason.trim()) {
      toast.error(t("feature.addExtension.specifyReason"));
      return;
    }

    const studentName = MOCK_STUDENTS.find((s) => s.id === selectedStudent)?.name || "";

    if (isEditing && existingExtension) {
      void extensionRepo.update(existingExtension.id, {
        type,
        submissionDeadlineOverride: type !== "review" ? submissionDeadline : undefined,
        reviewDeadlineOverride: type !== "submission" ? reviewDeadline : undefined,
        reason,
        notifyStudent,
      });
      toast.success(t("feature.addExtension.extensionUpdated"));
    } else {
      void extensionRepo.create({
        assignmentId,
        studentId: selectedStudent,
        studentName,
        type,
        submissionDeadlineOverride: type !== "review" ? submissionDeadline : undefined,
        reviewDeadlineOverride: type !== "submission" ? reviewDeadline : undefined,
        reason,
        status: "manual",
        processedAt: new Date().toISOString(),
        processedBy: "teacher1",
        notifyStudent,
      });
      toast.success(
        notifyStudent
          ? t("feature.addExtension.createdAndNotified")
          : t("feature.addExtension.created"),
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-[20px] max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-[20px]">
          <h2 className="text-xl font-semibold text-foreground">
            {isEditing
              ? t("feature.addExtension.editExtension")
              : t("feature.addExtension.addExtension")}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                {t("feature.addExtension.student")}
              </div>
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={isEditing}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            >
              <option value="">{t("feature.addExtension.selectStudent")}</option>
              {MOCK_STUDENTS.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            {isEditing && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t("feature.addExtension.cannotChangeStudent")}
              </p>
            )}
          </div>

          {/* Extension Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              {t("feature.addExtension.extensionType")}
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="submission"
                  checked={type === "submission"}
                  onChange={(e) => setType(e.target.value as ExtensionType)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {t("feature.addExtension.submissionOnly")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("feature.addExtension.extendSubmissionDeadline")}
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="review"
                  checked={type === "review"}
                  onChange={(e) => setType(e.target.value as ExtensionType)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {t("feature.addExtension.reviewOnly")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("feature.addExtension.extendReviewDeadline")}
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="both"
                  checked={type === "both"}
                  onChange={(e) => setType(e.target.value as ExtensionType)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {t("feature.addExtension.bothDeadlines")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("feature.addExtension.extendBoth")}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submission Deadline */}
          {(type === "submission" || type === "both") && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  {t("feature.addExtension.newSubmissionDeadline")}
                </div>
              </label>
              <input
                type="datetime-local"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Review Deadline */}
          {(type === "review" || type === "both") && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  {t("feature.addExtension.newReviewDeadline")}
                </div>
              </label>
              <input
                type="datetime-local"
                value={reviewDeadline}
                onChange={(e) => setReviewDeadline(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                {t("feature.addExtension.extensionReason")}
              </div>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={t("feature.addExtension.reasonPlaceholder")}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Notify Student Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">
                  {t("feature.addExtension.notifyStudent")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("feature.addExtension.sendEmail")}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyStudent}
                onChange={(e) => setNotifyStudent(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {isEditing
                ? t("feature.addExtension.saveChanges")
                : t("feature.addExtension.createExtension")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
