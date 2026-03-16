import { Calendar, Check, Clock, MessageSquare, Pencil, Trash2, User, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Extension,
  ExtensionStatus,
  getExtensionStatusLabel,
  getExtensionTypeLabel,
} from "@/entities/extension";

type Props = {
  extensions: Extension[]; // уже отфильтрованный список
  filterStatus: ExtensionStatus | "all";

  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  onEdit: (extension: Extension) => void;
  onDelete: (id: string) => void;
};

export function ExtensionsTable({
  extensions,
  filterStatus,
  onApprove,
  onDeny,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useTranslation();
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
    return date.toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-card border border-border rounded-[20px] overflow-hidden">
      {extensions.length === 0 ? (
        <div className="p-12 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-2">{t("widget.extensions.noExtensions")}</p>
          <p className="text-sm text-muted-foreground">
            {filterStatus === "all"
              ? t("widget.extensions.addOrWait")
              : `${t("widget.extensions.noExtensionsWithStatus")} "${getExtensionStatusLabel(filterStatus)}"`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("widget.extensions.student")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("widget.extensions.type")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("widget.extensions.submissionDeadline")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("widget.extensions.reviewDeadline")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("widget.extensions.reason")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("common.status")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {extensions.map((ext) => (
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
                            onClick={() => onApprove(ext.id)}
                            className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                            title={t("widget.extensions.approveTitle")}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeny(ext.id)}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            title={t("widget.extensions.denyTitle")}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onEdit(ext)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                        title={t("widget.extensions.editTitle")}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(ext.id)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                        title={t("widget.extensions.deleteTitle")}
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
  );
}
