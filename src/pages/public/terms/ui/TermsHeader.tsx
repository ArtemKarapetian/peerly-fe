import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TermsHeader() {
  const { t } = useTranslation();
  return (
    <div className="mb-8 tablet:mb-12">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
          <FileText className="size-6 text-primary" />
        </div>
        <h1 className="text-page-h1 tablet:text-[40px] font-medium text-foreground tracking-[-0.5px]">
          {t("page.terms.title")}
        </h1>
      </div>
      <p className="text-15 text-muted-foreground">{t("page.terms.lastUpdated")}</p>
    </div>
  );
}
