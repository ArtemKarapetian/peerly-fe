import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SubmitReviewButtonProps {
  canSubmit: boolean;
  onSubmit: () => void;
}

export function SubmitReviewButton({ canSubmit, onSubmit }: SubmitReviewButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onSubmit}
      disabled={!canSubmit}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-md text-15 font-medium transition-colors"
    >
      <Send className="w-4 h-4" />
      <span>{t("page.reviewFill.submitReview")}</span>
    </button>
  );
}
