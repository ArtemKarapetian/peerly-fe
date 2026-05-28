import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ContactInstructorBanner() {
  const { t } = useTranslation();
  return (
    <div className="bg-brand-primary-lighter rounded-xl p-6 tablet:p-8">
      <h3 className="text-xl font-semibold text-foreground mb-4">{t("page.help.noAnswerFound")}</h3>
      <div className="space-y-4">
        <p className="text-foreground/80">{t("page.help.contactInstructorDesc")}</p>
        <div className="flex items-start gap-3 p-4 bg-card rounded-md">
          <Mail className="size-5 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-foreground mb-1">
              {t("page.help.contactInstructor")}
            </div>
            <div className="text-sm text-foreground/70">{t("page.help.contactInstructorHint")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
