import { Download, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatBytes } from "../lib/formatBytes";
import type { SubmissionRow } from "../model/types";

interface SubmissionDetailProps {
  row: SubmissionRow;
  onClose: () => void;
  onDownload: (fileId: string, fileName: string) => Promise<void>;
}

export function SubmissionDetail({ row, onClose, onDownload }: SubmissionDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40" onClick={onClose}>
      <div
        className="w-full max-w-[600px] bg-card h-full overflow-y-auto border-l-2 border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <DetailHeader row={row} onClose={onClose} />
        <div className="p-6 space-y-6">
          <CommentSection comment={row.sub.content} />
          <FilesSection files={row.sub.files} onDownload={onDownload} />
          <MarksSection sub={row.sub} />
        </div>
      </div>
    </div>
  );
}

function DetailHeader({ row, onClose }: { row: SubmissionRow; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-medium text-foreground">{row.studentName}</h2>
        <p className="text-13 text-muted-foreground">
          {row.assignment?.title ?? t("teacher.submissions.unknownAssignment")}
        </p>
      </div>
      <button onClick={onClose} className="p-2 rounded-sm hover:bg-muted">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

function CommentSection({ comment }: { comment: string | null | undefined }) {
  const { t } = useTranslation();
  if (!comment?.trim()) return null;
  return (
    <section>
      <h3 className="text-sm font-medium text-foreground mb-2">
        {t("teacher.submissions.studentComment")}
      </h3>
      <p className="text-sm text-foreground whitespace-pre-line">{comment}</p>
    </section>
  );
}

interface FilesSectionProps {
  files: SubmissionRow["sub"]["files"];
  onDownload: (fileId: string, fileName: string) => Promise<void>;
}

function FilesSection({ files, onDownload }: FilesSectionProps) {
  const { t } = useTranslation();
  return (
    <section>
      <h3 className="text-sm font-medium text-foreground mb-2">{t("teacher.submissions.files")}</h3>
      {files.length === 0 ? (
        <p className="text-13 text-muted-foreground">{t("teacher.submissions.noFiles")}</p>
      ) : (
        <ul className="space-y-2">
          {files.map((f) => (
            <FileRow key={f.id} file={f} onDownload={() => void onDownload(f.id, f.name)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function FileRow({
  file,
  onDownload,
}: {
  file: SubmissionRow["sub"]["files"][number];
  onDownload: () => void;
}) {
  const { t } = useTranslation();
  return (
    <li className="flex items-center justify-between gap-3 p-3 border border-border rounded-2md">
      <div className="min-w-0">
        <p className="text-sm text-foreground truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
      </div>
      <button
        onClick={onDownload}
        className="inline-flex items-center gap-2 px-3 py-2 text-13 text-brand-primary hover:bg-info-light rounded-sm"
      >
        <Download className="w-4 h-4" />
        {t("common.download")}
      </button>
    </li>
  );
}

function MarksSection({ sub }: { sub: SubmissionRow["sub"] }) {
  const { t } = useTranslation();
  if (sub.studentMark == null && sub.teacherMark == null && sub.finalMark == null) {
    return null;
  }
  return (
    <section>
      <h3 className="text-sm font-medium text-foreground mb-2">{t("teacher.submissions.marks")}</h3>
      <div className="grid grid-cols-3 gap-3 text-center">
        <MarkCell label={t("teacher.submissions.studentMark")} value={sub.studentMark} />
        <MarkCell label={t("teacher.submissions.teacherMark")} value={sub.teacherMark} />
        <MarkCell label={t("teacher.submissions.finalMark")} value={sub.finalMark} />
      </div>
    </section>
  );
}

function MarkCell({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="border border-border rounded-2md p-3">
      <p className="text-2xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-lg font-medium text-foreground">{value ?? "—"}</p>
    </div>
  );
}
