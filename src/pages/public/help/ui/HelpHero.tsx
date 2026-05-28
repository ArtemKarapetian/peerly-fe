import { useTranslation } from "react-i18next";

export function HelpHero() {
  const { t } = useTranslation();
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl tablet:text-5xl font-semibold text-foreground mb-4">
        {t("page.help.title")}
      </h1>
      <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
        {t("page.help.subtitle")}
      </p>
    </div>
  );
}
