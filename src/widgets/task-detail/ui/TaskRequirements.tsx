import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TaskRequirements() {
  const { t } = useTranslation();

  const requirements = [
    t("widget.taskRequirements.independent"),
    t("widget.taskRequirements.minWords"),
    t("widget.taskRequirements.citeSources"),
    t("widget.taskRequirements.fileFormat"),
    t("widget.taskRequirements.formatting"),
  ];

  return (
    <div className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
      <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-foreground mb-4">
        {t("widget.taskRequirements.title")}
      </h2>

      <div className="space-y-3">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <div className="size-5 rounded-full bg-brand-primary-light flex items-center justify-center">
                <Check className="size-3.5 text-foreground" />
              </div>
            </div>
            <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-muted-foreground leading-[1.5]">
              {requirement}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
