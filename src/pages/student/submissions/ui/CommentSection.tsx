import { useTranslation } from "react-i18next";

import { hasNonEmptyComment } from "../lib/formatters";

interface CommentSectionProps {
  content: string | null | undefined;
}

export function CommentSection({ content }: CommentSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-base font-medium text-foreground mb-3">
        {t("student.submissions.commentTitle")}
      </h2>
      {hasNonEmptyComment(content) ? (
        <p className="text-15 text-foreground whitespace-pre-wrap leading-[1.5]">{content}</p>
      ) : (
        <p className="text-sm text-muted-foreground italic">{t("student.submissions.noComment")}</p>
      )}
    </section>
  );
}
