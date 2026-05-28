import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  submitting: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function WizardFooter({
  currentStep,
  totalSteps,
  canProceed,
  submitting,
  onPrev,
  onNext,
}: WizardFooterProps) {
  const { t } = useTranslation();
  const isLast = currentStep >= totalSteps;

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={currentStep === 1 || submitting}
        className="flex items-center gap-2 px-4 py-3 border border-border text-foreground rounded-md hover:bg-surface-hover hover:border-border-strong transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        {t("teacher.createAssignment.backBtn")}
      </button>

      <div className="text-sm text-muted-foreground">
        {t("teacher.createAssignment.stepOf", { current: currentStep, total: totalSteps })}
      </div>

      {isLast ? (
        <div aria-hidden className="invisible flex items-center gap-2 px-6 py-3">
          <span>{t("teacher.createAssignment.nextBtn")}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {t("teacher.createAssignment.nextBtn")}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
