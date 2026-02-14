import { useState, useCallback } from "react";
import { AppShell } from "@/app/components/AppShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { ROUTES } from "@/app/routes";
import { Clock, Plus, Pencil, Trash2, User, Calendar, MessageSquare, X, Check } from "lucide-react";
import {
  Extension,
  ExtensionStatus,
  getExtensionsByAssignment,
  deleteExtension,
  approveExtension,
  denyExtension,
  getExtensionStatusLabel,
  getExtensionTypeLabel,
} from "@/app/utils/extensions";
import { AddExtensionModal } from "@/app/components/AddExtensionModal";
import { toast } from "sonner";

interface TeacherAssignmentExtensionsPageProps {
  assignmentId: string;
}

/**
 * TeacherAssignmentExtensionsPage - Manage deadline extensions for an assignment
 */
export default function TeacherAssignmentExtensionsPage({
  assignmentId,
}: TeacherAssignmentExtensionsPageProps) {
  const [extensions, setExtensions] = useState<Extension[]>(() =>
    getExtensionsByAssignment(assignmentId),
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExtension, setEditingExtension] = useState<Extension | null>(null);
  const [filterStatus, setFilterStatus] = useState<ExtensionStatus | "all">("all");

  const loadExtensions = useCallback(() => {
    const data = getExtensionsByAssignment(assignmentId);
    setExtensions(data);
  }, [assignmentId]);

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить это продление?")) {
      deleteExtension(id);
      loadExtensions();
      toast.success("Продление удалено");
    }
  };

  const handleApprove = (id: string) => {
    approveExtension(id, "teacher1"); // demo teacher id
    loadExtensions();
    toast.success("Продление одобрено");
  };

  const handleDeny = (id: string) => {
    if (confirm("Вы уверены, что хотите отклонить запрос на продление?")) {
      denyExtension(id, "teacher1"); // demo teacher id
      loadExtensions();
      toast.info("Запрос отклонён");
    }
  };

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

  const getStatusBadge = (status: ExtensionStatus) => {
    const styles: Record<ExtensionStatus, string> = {
      manual:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      requested:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      approved:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      denied:
        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    };

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${styles[status]}`}
      >
        {getExtensionStatusLabel(status)}
      </span>
    );
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
                Продления дедлайнов
              </h1>
              <p className="text-muted-foreground">
                Управление исключениями по дедлайнам для задания "Peer Review Essay"
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Plus className="w-5 h-5" />
              Добавить продление
            </button>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-[12px] p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Фильтр:</span>
              <div className="flex gap-2">
                {(["all", "requested", "approved", "manual", "denied"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {status === "all" ? "Все" : getExtensionStatusLabel(status as ExtensionStatus)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Extensions Table */}
          <div className="bg-card border border-border rounded-[20px] overflow-hidden">
            {filteredExtensions.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">Нет продлений</p>
                <p className="text-sm text-muted-foreground">
                  {filterStatus === "all"
                    ? "Добавьте продление для студента или дождитесь запросов"
                    : `Нет продлений со статусом "${getExtensionStatusLabel(filterStatus as ExtensionStatus)}"`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Студент
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Тип
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Дедлайн сдачи
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Дедлайн проверки
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Причина
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Статус
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExtensions.map((ext) => (
                      <tr
                        key={ext.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                              <User className="w-4 h-4 text-accent-foreground" />
                            </div>
                            <span className="font-medium text-foreground">{ext.studentName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">
                            {getExtensionTypeLabel(ext.type)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm">
                            {ext.submissionDeadlineOverride ? (
                              <>
                                <Calendar className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                <span className="text-foreground font-medium">
                                  {formatDateTime(ext.submissionDeadlineOverride)}
                                </span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm">
                            {ext.reviewDeadlineOverride ? (
                              <>
                                <Calendar className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                <span className="text-foreground font-medium">
                                  {formatDateTime(ext.reviewDeadlineOverride)}
                                </span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-[200px]">
                          <div className="flex items-start gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {ext.reason}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(ext.status)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {ext.status === "requested" && (
                              <>
                                <button
                                  onClick={() => handleApprove(ext.id)}
                                  className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                                  title="Одобрить"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeny(ext.id)}
                                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                  title="Отклонить"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEdit(ext)}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                              title="Редактировать"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(ext.id)}
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-2 tablet:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-[12px] p-4">
              <div className="text-2xl font-semibold text-foreground mb-1">{extensions.length}</div>
              <div className="text-sm text-muted-foreground">Всего продлений</div>
            </div>
            <div className="bg-card border border-border rounded-[12px] p-4">
              <div className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                {extensions.filter((e) => e.status === "requested").length}
              </div>
              <div className="text-sm text-muted-foreground">Ожидают ответа</div>
            </div>
            <div className="bg-card border border-border rounded-[12px] p-4">
              <div className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-1">
                {extensions.filter((e) => e.status === "approved").length}
              </div>
              <div className="text-sm text-muted-foreground">Одобрено</div>
            </div>
            <div className="bg-card border border-border rounded-[12px] p-4">
              <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                {extensions.filter((e) => e.status === "manual").length}
              </div>
              <div className="text-sm text-muted-foreground">Вручную</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddExtensionModal
          assignmentId={assignmentId}
          existingExtension={editingExtension}
          onClose={handleModalClose}
        />
      )}
    </AppShell>
  );
}
