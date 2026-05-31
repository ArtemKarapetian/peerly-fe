import { useTranslation } from "react-i18next";

import { LandingContainer } from "./LandingContainer";
import { LandingCTAButton } from "./LandingCTAButton";

export function LandingCTASection() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-muted py-16 tablet:py-20 desktop:py-28">
      <LandingContainer>
        <div className="text-center space-y-8 tablet:space-y-10">
          <h2 className="text-4xl tablet:text-5xl desktop:text-6xl font-semibold text-foreground leading-[1.1] max-w-[900px] mx-auto">
            {t("page.landing.ctaTitle")}
          </h2>
          <div className="flex flex-col tablet:flex-row items-center justify-center gap-3">
            <LandingCTAButton size="large" />
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
