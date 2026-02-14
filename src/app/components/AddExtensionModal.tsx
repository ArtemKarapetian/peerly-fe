import { useState } from "react";
import { X, Calendar, User, MessageSquare, Bell } from "lucide-react";
import { Extension, ExtensionType, createExtension, updateExtension } from "@/app/utils/extensions";
import { toast } from "sonner";

interface AddExtensionModalProps {
  assignmentId: string;
  existingExtension?: Extension | null;
  onClose: () => void;
}

// Mock students data
const MOCK_STUDENTS = [
  { id: "1", name: "Анна Смирнова" },
  { id: "2", name: "Иван Петров" },
  { id: "3", name: "Дмитрий Козлов" },
  { id: "4", name: "Мария Сидорова" },
  { id: "5", name: "Ольга Петрова" },
  { id: "6", name: "Алексей Новikov" },
];

export function AddExtensionModal({
  assignmentId,
  existingExtension,
  onClose,
}: AddExtensionModalProps) {
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
      toast.error("Выберите студента");
      return;
    }

    if (type === "submission" && !submissionDeadline) {
      toast.error("Укажите новый дедлайн сдачи");
      return;
    }

    if (type === "review" && !reviewDeadline) {
      toast.error("Укажите новый дедлайн проверки");
      return;
    }

    if (type === "both" && (!submissionDeadline || !reviewDeadline)) {
      toast.error("Укажите оба дедлайна");
      return;
    }

    if (!reason.trim()) {
      toast.error("Укажите причину продления");
      return;
    }

    const studentName = MOCK_STUDENTS.find((s) => s.id === selectedStudent)?.name || "";

    if (isEditing && existingExtension) {
      updateExtension(existingExtension.id, {
        type,
        submissionDeadlineOverride: type !== "review" ? submissionDeadline : undefined,
        reviewDeadlineOverride: type !== "submission" ? reviewDeadline : undefined,
        reason,
        notifyStudent,
      });
      toast.success("Продление обновлено");
    } else {
      createExtension({
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
      toast.success(notifyStudent ? "Продление создано, студент уведомлён" : "Продление создано");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-[20px] max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-[20px]">
          <h2 className="text-xl font-semibold text-foreground">
            {isEditing ? "Редактировать продление" : "Добавить продление"}
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
                Студент
              </div>
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={isEditing}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            >
              <option value="">Выберите студента</option>
              {MOCK_STUDENTS.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            {isEditing && (
              <p className="mt-1 text-xs text-muted-foreground">
                Студента нельзя изменить после создания
              </p>
            )}
          </div>

          {/* Extension Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Тип продления</label>
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
                  <div className="font-medium text-foreground">Только сдача работы</div>
                  <div className="text-xs text-muted-foreground">Продлить дедлайн submission</div>
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
                  <div className="font-medium text-foreground">Только проверка работ</div>
                  <div className="text-xs text-muted-foreground">Продлить дедлайн peer review</div>
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
                  <div className="font-medium text-foreground">Оба дедлайна</div>
                  <div className="text-xs text-muted-foreground">Продлить submission и review</div>
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
                  Новый дедлайн сдачи
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
                  Новый дедлайн проверки
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
                Причина продления
              </div>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Укажите причину продления дедлайна..."
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Notify Student Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">Уведомить студента</div>
                <div className="text-xs text-muted-foreground">Отправить email о продлении</div>
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
              {isEditing ? "Сохранить изменения" : "Создать продление"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
