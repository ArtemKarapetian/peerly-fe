import { useTranslation } from "react-i18next";

import { LandingContainer } from "./LandingContainer";

export function LandingIntro() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-muted py-16 tablet:py-20 desktop:py-24">
      <LandingContainer>
        <div className="text-center space-y-6 max-w-[860px] mx-auto">
          <h2 className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
            {t("page.landing.introLabel")}
          </h2>
          <h3 className="text-4xl tablet:text-5xl desktop:text-6xl font-semibold text-foreground leading-[1.1]">
            {t("page.landing.introTitle")}
          </h3>
          <p className="text-base text-foreground/70">{t("page.landing.introSubtitle")}</p>
        </div>
      </LandingContainer>
    </section>
  );
}
