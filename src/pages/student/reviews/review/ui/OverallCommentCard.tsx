import { useTranslation } from "react-i18next";

import { Card, Textarea } from "@/shared/ui";

interface OverallCommentCardProps {
  value: string;
  minLength: number;
  readonly: boolean;
  onChange: (value: string) => void;
}

export function OverallCommentCard({
  value,
  minLength,
  readonly,
  onChange,
}: OverallCommentCardProps) {
  const { t } = useTranslation();
  const valid = value.trim().length >= minLength;
  return (
    <Card variant="section">
      <h3 className="text-lg desktop:text-xl tracking-[-0.3px] text-foreground font-medium mb-2">
        {t("page.reviewFill.overallComment")}
        <span className="text-error ml-1">*</span>
      </h3>
      <Textarea
        value={value}
        disabled={readonly}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={t("page.reviewFill.overallCommentPlaceholder")}
        className="px-3 py-2 rounded-2md text-sm"
      />
      <p className={`text-xs mt-2 ${valid ? "text-success" : "text-muted-foreground"}`}>
        {value.length} / {minLength} {t("page.reviewFill.characters", { count: value.length })}
      </p>
    </Card>
  );
}
