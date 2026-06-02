import { useTranslation } from "react-i18next";

import { Card, Textarea } from "@/shared/ui";

interface CommentCardProps {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}

export function CommentCard({ value, onChange, disabled }: CommentCardProps) {
  const { t } = useTranslation();
  return (
    <Card variant="section">
      <h2 className="text-15 font-medium text-foreground mb-3">
        {t("page.submitWork.commentToTeacher")}{" "}
        <span className="text-muted-foreground font-normal ml-2 text-13">
          {t("page.submitWork.commentOptional")}
        </span>
      </h2>
      <Textarea
        className="min-h-[120px] rounded-2md"
        placeholder={t("page.submitWork.commentPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </Card>
  );
}
