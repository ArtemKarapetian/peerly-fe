import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

interface SubmissionPreview {
  comment: string;
  files: { id: string; name: string; size: number }[];
  checklist: string;
}

export function SubmissionPreviewCard({ comment, files, checklist }: SubmissionPreview) {
  const { t } = useTranslation();
  return (
    <Card variant="section" className="space-y-4">
      <h2 className="text-xl desktop:text-[22px] tracking-[-0.3px] text-foreground font-medium">
        {t("page.reviewFill.workTitle")}
      </h2>

      {checklist.trim() && <ChecklistBlock checklist={checklist} />}

      <CommentBlock comment={comment} />

      {files.length > 0 && <FilesBlock files={files} />}
    </Card>
  );
}

function ChecklistBlock({ checklist }: { checklist: string }) {
  const { t } = useTranslation();
  return (
    <div className="bg-muted rounded-2md p-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
        {t("student.task.checklist")}
      </p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{checklist}</p>
    </div>
  );
}

function CommentBlock({ comment }: { comment: string }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
        {t("page.reviewFill.studentComment")}
      </p>
      <p className="text-sm text-foreground whitespace-pre-wrap">
        {comment.trim() || t("page.reviewFill.noStudentComment")}
      </p>
    </div>
  );
}

interface FilesBlockProps {
  files: { id: string; name: string }[];
}

function FilesBlock({ files }: FilesBlockProps) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
        {t("page.reviewFill.files")}
      </p>
      <ul className="space-y-1">
        {files.map((file) => (
          <li key={file.id} className="text-sm text-foreground bg-muted rounded-sm px-3 py-2">
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export type { SubmissionPreview };
